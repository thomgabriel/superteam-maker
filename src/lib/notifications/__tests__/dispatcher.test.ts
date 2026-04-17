import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// ---------------------------------------------------------------------------
// Module-level mocks. The dispatcher pulls in:
//   - @/lib/email (sendEmail) — must not hit the network
//   - @/lib/monitoring (logError / logInfo)
//   - @/lib/supabase/server (createServiceRoleClient — only used when caller
//     doesn't pass a client; we always pass one, but mock for safety)
//   - ./templates (renderTemplate)
// ---------------------------------------------------------------------------

const sendEmail = vi.fn();
const logError = vi.fn();
const logInfo = vi.fn();
const renderTemplate = vi.fn();
const createServiceRoleClient = vi.fn();

vi.mock('@/lib/email', () => ({
  sendEmail: (...args: unknown[]) => sendEmail(...args),
}));

vi.mock('@/lib/monitoring', () => ({
  logError: (...args: unknown[]) => logError(...args),
  logInfo: (...args: unknown[]) => logInfo(...args),
}));

vi.mock('@/lib/supabase/server', () => ({
  createServiceRoleClient: (...args: unknown[]) => createServiceRoleClient(...args),
  createServerSupabaseClient: async () => ({}),
}));

vi.mock('../templates', () => ({
  renderTemplate: (...args: unknown[]) => renderTemplate(...args),
}));

const signConfirmationToken = vi.fn();
const buildConfirmationLink = vi.fn((t: string) => `https://app.test/team/confirm?t=${t}`);

vi.mock('@/lib/tokens', () => ({
  signConfirmationToken: (...args: unknown[]) => signConfirmationToken(...args),
  buildConfirmationLink: (...args: Parameters<typeof buildConfirmationLink>) =>
    buildConfirmationLink(...args),
}));

// Imported after mocks so they take effect.
const { emit } = await import('../dispatcher');

// ---------------------------------------------------------------------------
// Fake Supabase client — programmable table handlers.
// Each test configures the handlers it needs; unexpected calls throw so the
// tests fail loudly instead of silently passing.
// ---------------------------------------------------------------------------

interface InsertCapture {
  table: string;
  rows: Record<string, unknown> | Record<string, unknown>[];
}

interface UpdateCapture {
  table: string;
  values: Record<string, unknown>;
  eqColumn?: string;
  eqValue?: unknown;
}

interface FakeState {
  inserts: InsertCapture[];
  updates: UpdateCapture[];
  // How the fake should respond to various queries.
  eventInsertResponse: { data: { id: string } | null; error: unknown };
  notificationsInsertResponse: {
    data: Array<{ id: string; channel: 'email' | 'in_app'; user_id: string }> | null;
    error: unknown;
  };
  preferencesRows: Array<{
    user_id: string;
    email_lifecycle: boolean;
    email_reminders: boolean;
    in_app_enabled: boolean;
  }>;
  usersRows: Array<{ id: string; email: string | null }>;
  // Global throttle lookup: map from throttle_key -> whether a recent event exists.
  throttleHits: Map<string, boolean>;
  // Per-user throttle: for the two-query join (events by key + notifications
  // by event_id × user_id), list users already notified under a given raw key.
  perUserThrottled: Map<string, Set<string>>;
}

function createFakeClient(state: FakeState) {
  // Helper for chainable "select followed by filters then maybeSingle/single"
  // used by the throttle path (notification_events) and the event-row insert
  // follow-up select (notification_events.insert().select('id').single()).
  const fake = {
    from(table: string) {
      return {
        insert(rows: Record<string, unknown> | Record<string, unknown>[]) {
          state.inserts.push({ table, rows });
          // Both notification_events and notifications are followed by .select();
          // notifications_events chains .single(), notifications chains just
          // `.select(...)` returning {data, error} directly.
          return {
            select: (_cols?: string) => {
              if (table === 'notification_events') {
                return {
                  single: async () => state.eventInsertResponse,
                };
              }
              if (table === 'notifications') {
                return Promise.resolve(state.notificationsInsertResponse);
              }
              throw new Error(`Unexpected insert().select on ${table}`);
            },
          };
        },
        update(values: Record<string, unknown>) {
          return {
            eq(col: string, val: unknown) {
              state.updates.push({ table, values, eqColumn: col, eqValue: val });
              return Promise.resolve({ error: null });
            },
          };
        },
        select(_cols?: string) {
          if (table === 'notification_events') {
            // Two shapes land here:
            //  1. Global throttle: .eq('throttle_key', k).gte(...).limit(1)
            //                      .maybeSingle()
            //  2. Per-user throttle: .eq('throttle_key', k).gte(...) — awaited
            //                        directly (no .limit/.maybeSingle), returns
            //                        {data: events[]}.
            let pendingThrottleKey: string | null = null;
            const matchingEvents = () => {
              if (pendingThrottleKey === null) return [];
              const globalHit = state.throttleHits.get(pendingThrottleKey);
              const perUserUsers = state.perUserThrottled.get(pendingThrottleKey);
              if (globalHit || (perUserUsers && perUserUsers.size > 0)) {
                return [{ id: `evt-${pendingThrottleKey}` }];
              }
              return [];
            };
            const chain = {
              eq(col: string, val: unknown) {
                if (col === 'throttle_key') {
                  pendingThrottleKey = String(val);
                }
                return chain;
              },
              gte(_col: string, _val: unknown) {
                return chain;
              },
              limit(_n: number) {
                return chain;
              },
              maybeSingle: async () => {
                const events = matchingEvents();
                return { data: events[0] ?? null, error: null };
              },
              // Thenable so `await chain` (per-user path) returns {data, error}.
              then(
                resolve: (value: { data: unknown; error: unknown }) => unknown,
                reject: (reason: unknown) => unknown,
              ) {
                return Promise.resolve({
                  data: matchingEvents(),
                  error: null,
                }).then(resolve, reject);
              },
            };
            return chain;
          }

          if (table === 'notification_preferences') {
            return {
              in(_col: string, userIds: string[]) {
                const data = state.preferencesRows.filter((r) =>
                  userIds.includes(r.user_id),
                );
                return Promise.resolve({ data, error: null });
              },
            };
          }

          if (table === 'users') {
            return {
              in(_col: string, userIds: string[]) {
                const data = state.usersRows.filter((r) =>
                  userIds.includes(r.id),
                );
                return Promise.resolve({ data, error: null });
              },
            };
          }

          if (table === 'notifications') {
            // Per-user throttle path: .in('event_id', [...]).in('user_id', [...])
            // Returns user_id rows for users listed in perUserThrottled for the
            // event's raw throttle key (inferred from event_id 'evt-<key>').
            let capturedEventIds: string[] = [];
            const n = {
              in(col: string, ids: string[]) {
                if (col === 'event_id') {
                  capturedEventIds = ids;
                  return n;
                }
                if (col === 'user_id') {
                  const throttledUsers = new Set<string>();
                  for (const eventId of capturedEventIds) {
                    const key = eventId.startsWith('evt-')
                      ? eventId.slice('evt-'.length)
                      : null;
                    if (!key) continue;
                    const users = state.perUserThrottled.get(key);
                    if (users) for (const u of users) throttledUsers.add(u);
                  }
                  const matched = ids.filter((u) => throttledUsers.has(u));
                  return Promise.resolve({
                    data: matched.map((u) => ({ user_id: u })),
                    error: null,
                  });
                }
                return n;
              },
            };
            return n;
          }

          throw new Error(`Unexpected select on ${table}`);
        },
      };
    },
  };

  return fake as unknown as Parameters<typeof emit>[2];
}

function freshState(overrides: Partial<FakeState> = {}): FakeState {
  return {
    inserts: [],
    updates: [],
    eventInsertResponse: { data: { id: 'evt-1' }, error: null },
    notificationsInsertResponse: { data: [], error: null },
    preferencesRows: [],
    usersRows: [],
    throttleHits: new Map(),
    perUserThrottled: new Map(),
    ...overrides,
  };
}

beforeEach(() => {
  vi.clearAllMocks();
  // Default: renderTemplate returns a stub; sendEmail succeeds.
  renderTemplate.mockReturnValue({ subject: 'Subj', html: '<p>body</p>' });
  sendEmail.mockResolvedValue({ status: 'sent' });
});

afterEach(() => {
  vi.clearAllMocks();
});

describe('emit — early returns & fan-out', () => {
  it('returns early with no event inserted when user_ids is empty', async () => {
    const state = freshState();
    const client = createFakeClient(state);

    const result = await emit(
      'team_matched',
      {
        user_ids: [],
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      client,
    );

    expect(result.event_id).toBeNull();
    expect(result.notifications_created).toBe(0);
    expect(result.skipped_throttled).toBe(false);
    // No inserts should have been attempted.
    expect(state.inserts).toHaveLength(0);
  });

  it('fans out 4 users × 2 channels for a critical kind (team_matched)', async () => {
    const userIds = ['u1', 'u2', 'u3', 'u4'];
    const insertedRows = userIds.flatMap((uid) => [
      { id: `n-${uid}-email`, channel: 'email' as const, user_id: uid },
      { id: `n-${uid}-in_app`, channel: 'in_app' as const, user_id: uid },
    ]);
    const state = freshState({
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: userIds.map((id) => ({ id, email: `${id}@example.com` })),
    });
    const client = createFakeClient(state);

    const result = await emit(
      'team_matched',
      {
        user_ids: userIds,
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      client,
    );

    expect(result.event_id).toBe('evt-1');
    expect(result.notifications_created).toBe(8);
    expect(result.errors).toHaveLength(0);

    // Exactly 1 event row + 1 bulk notifications insert.
    const eventInserts = state.inserts.filter((i) => i.table === 'notification_events');
    const notificationInserts = state.inserts.filter((i) => i.table === 'notifications');
    expect(eventInserts).toHaveLength(1);
    expect(notificationInserts).toHaveLength(1);
    const notifRows = notificationInserts[0].rows as unknown[];
    expect(Array.isArray(notifRows)).toBe(true);
    expect(notifRows).toHaveLength(8);
  });
});

describe('emit — preferences gating', () => {
  it('skips email channel for non-critical kind when email_reminders is false', async () => {
    // leader_claimed is non-critical and has channels [email, in_app].
    const insertedRows = [
      { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
      { id: 'n-u1-in_app', channel: 'in_app' as const, user_id: 'u1' },
      { id: 'n-u2-in_app', channel: 'in_app' as const, user_id: 'u2' },
    ];
    const state = freshState({
      preferencesRows: [
        {
          user_id: 'u1',
          email_lifecycle: true,
          email_reminders: true,
          in_app_enabled: true,
        },
        // u2 opted out of reminder emails but keeps in_app.
        {
          user_id: 'u2',
          email_lifecycle: true,
          email_reminders: false,
          in_app_enabled: true,
        },
      ],
      // The dispatcher only inserts the rows it decides to emit, so the mock
      // return must match what we expect it to have asked for. We check the
      // *insert payload* below to verify gating.
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: [
        { id: 'u1', email: 'u1@example.com' },
        { id: 'u2', email: 'u2@example.com' },
      ],
    });
    const client = createFakeClient(state);

    await emit(
      'leader_claimed',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        payload: {
          kind: 'leader_claimed',
          team_id: 'team-1',
          team_name: 'Alpha',
          leader_name: 'Ada',
          whatsapp_url: null,
        },
      },
      client,
    );

    const notifInsert = state.inserts.find((i) => i.table === 'notifications');
    expect(notifInsert).toBeDefined();
    const rows = notifInsert!.rows as Array<{ user_id: string; channel: string }>;
    // u1 should have email + in_app; u2 should have only in_app.
    const u1Channels = rows.filter((r) => r.user_id === 'u1').map((r) => r.channel).sort();
    const u2Channels = rows.filter((r) => r.user_id === 'u2').map((r) => r.channel).sort();
    expect(u1Channels).toEqual(['email', 'in_app']);
    expect(u2Channels).toEqual(['in_app']);
  });

  it('bypasses preferences for critical kinds (email delivered despite email_reminders=false)', async () => {
    // team_matched is critical — even with email_reminders=false the user gets email.
    const insertedRows = [
      { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
      { id: 'n-u1-in_app', channel: 'in_app' as const, user_id: 'u1' },
    ];
    const state = freshState({
      preferencesRows: [
        {
          user_id: 'u1',
          email_lifecycle: true,
          email_reminders: false,
          in_app_enabled: true,
        },
      ],
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: [{ id: 'u1', email: 'u1@example.com' }],
    });
    const client = createFakeClient(state);

    await emit(
      'team_matched',
      {
        user_ids: ['u1'],
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      client,
    );

    const notifInsert = state.inserts.find((i) => i.table === 'notifications');
    expect(notifInsert).toBeDefined();
    const rows = notifInsert!.rows as Array<{ user_id: string; channel: string }>;
    const channels = rows.map((r) => r.channel).sort();
    expect(channels).toEqual(['email', 'in_app']);
  });

  it('falls back to DEFAULT_PREFERENCES (all true) when a user has no preferences row', async () => {
    // Non-critical leader_claimed — all channels should still deliver.
    const insertedRows = [
      { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
      { id: 'n-u1-in_app', channel: 'in_app' as const, user_id: 'u1' },
    ];
    const state = freshState({
      preferencesRows: [], // no row for u1
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: [{ id: 'u1', email: 'u1@example.com' }],
    });
    const client = createFakeClient(state);

    await emit(
      'leader_claimed',
      {
        user_ids: ['u1'],
        team_id: 'team-1',
        payload: {
          kind: 'leader_claimed',
          team_id: 'team-1',
          team_name: 'Alpha',
          leader_name: 'Ada',
          whatsapp_url: null,
        },
      },
      client,
    );

    const notifInsert = state.inserts.find((i) => i.table === 'notifications');
    const rows = notifInsert!.rows as Array<{ user_id: string; channel: string }>;
    expect(rows.map((r) => r.channel).sort()).toEqual(['email', 'in_app']);
  });
});

describe('emit — throttle', () => {
  it('returns skipped_throttled=true when a recent event matches the key (global scope)', async () => {
    const state = freshState({
      throttleHits: new Map([['silence:team-1', true]]),
    });
    const client = createFakeClient(state);

    const result = await emit(
      'you_were_replaced',
      {
        user_ids: ['u1'],
        team_id: 'team-1',
        throttle_key: 'silence:team-1',
        payload: {
          kind: 'you_were_replaced',
          team_id: 'team-1',
          team_name: 'Alpha',
        },
      },
      client,
    );

    expect(result.skipped_throttled).toBe(true);
    expect(result.event_id).toBeNull();
    // No writes of any kind.
    expect(state.inserts).toHaveLength(0);
  });

  it('per_user throttle suppresses only users who already received a notification under the raw key', async () => {
    // u1 already received a notification for an event with throttle_key
    // 'silence:team-1'; u2 did not. Only u2 should fan out.
    const insertedRows = [
      { id: 'n-u2-email', channel: 'email' as const, user_id: 'u2' },
    ];
    const state = freshState({
      perUserThrottled: new Map([['silence:team-1', new Set(['u1'])]]),
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: [{ id: 'u2', email: 'u2@example.com' }],
    });
    const client = createFakeClient(state);

    await emit(
      'you_were_replaced',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        throttle_key: 'silence:team-1',
        throttle_scope: 'per_user',
        payload: {
          kind: 'you_were_replaced',
          team_id: 'team-1',
          team_name: 'Alpha',
        },
      },
      client,
    );

    const notifInsert = state.inserts.find((i) => i.table === 'notifications');
    expect(notifInsert).toBeDefined();
    const rows = notifInsert!.rows as Array<{ user_id: string; channel: string }>;
    expect(rows.map((r) => r.user_id)).toEqual(['u2']);
  });
});

describe('emit — error handling', () => {
  it('throws loudly when the event-row insert fails', async () => {
    const state = freshState({
      eventInsertResponse: {
        data: null,
        error: { message: 'unique_violation' },
      },
    });
    const client = createFakeClient(state);

    await expect(
      emit(
        'team_matched',
        {
          user_ids: ['u1'],
          team_id: 'team-1',
          payload: {
            kind: 'team_matched',
            team_id: 'team-1',
            team_name: 'Alpha',
          },
        },
        client,
      ),
    ).rejects.toThrow(/Failed to record notification event/);
    // logError should have been invoked with the right log key.
    expect(logError).toHaveBeenCalledWith(
      'notifications.emit.event_insert_failed',
      expect.anything(),
      expect.objectContaining({ kind: 'team_matched' }),
    );
  });

  it('captures per-user channel delivery failures in result.errors without blocking others', async () => {
    const insertedRows = [
      { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
      { id: 'n-u2-email', channel: 'email' as const, user_id: 'u2' },
    ];
    const state = freshState({
      notificationsInsertResponse: { data: insertedRows, error: null },
      usersRows: [
        { id: 'u1', email: 'u1@example.com' },
        { id: 'u2', email: 'u2@example.com' },
      ],
    });
    const client = createFakeClient(state);

    // Make deliverEmail throw for u1 by having renderTemplate throw on the
    // first call. deliverEmail catches the throw and marks failed, but does
    // NOT re-throw — so to exercise the dispatcher's Promise.all error path,
    // we fail markAsSent-style by throwing from sendEmail for user 1.
    // However deliverEmail swallows errors internally. To reliably trigger
    // the dispatcher's catch block, stub the update chain to throw for u1:
    // the simplest approach is to have sendEmail throw for u1 AND stub the
    // `.update` so it also rejects. Instead, we spy on the in_app channel by
    // using member_replaced (email-only) with renderTemplate throwing on u1 —
    // deliverEmail will mark failed and return cleanly, not rejecting.
    //
    // The cleanest test is to swap to team_dissolved_pre_activation (email
    // only) and have the update chain itself reject on u1 so the outer catch
    // fires. We rewire client.from('notifications').update to reject for a
    // specific id.

    // Rewire: update() for notifications rejects when the target id is u1's.
    const clientWithFlakyUpdate = {
      from(table: string) {
        const inner = (client as unknown as { from: (t: string) => Record<string, unknown> }).from(
          table,
        );
        if (table !== 'notifications') return inner;
        return {
          ...inner,
          update(values: Record<string, unknown>) {
            return {
              eq: async (_col: string, val: unknown) => {
                if (val === 'n-u1-email') {
                  throw new Error('db offline for u1');
                }
                state.updates.push({
                  table,
                  values,
                  eqColumn: _col,
                  eqValue: val,
                });
                return { error: null };
              },
            };
          },
        };
      },
    } as unknown as Parameters<typeof emit>[2];

    const result = await emit(
      'team_dissolved_pre_activation',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        payload: {
          kind: 'team_dissolved_pre_activation',
          team_id: 'team-1',
          team_name: 'Alpha',
          reason: 'confirmation_failed',
        },
      },
      clientWithFlakyUpdate,
    );

    // u1 errored, u2 succeeded — notifications_created still reflects planned count.
    expect(result.notifications_created).toBe(2);
    expect(result.errors).toHaveLength(1);
    expect(result.errors[0].user_id).toBe('u1');
    // u2 still got its update applied.
    expect(
      state.updates.some(
        (u) => u.table === 'notifications' && u.eqValue === 'n-u2-email',
      ),
    ).toBe(true);
  });
});

describe('emit — magic-link minting', () => {
  it('mints a per-user token for team_matched when NOTIFICATION_TOKEN_SECRET is set', async () => {
    vi.stubEnv('NOTIFICATION_TOKEN_SECRET', 'test-secret');
    signConfirmationToken.mockImplementation(
      async ({ uid }: { uid: string }) => ({
        token: `tok-${uid}`,
        nonce: `nonce-${uid}`,
        expiresAt: new Date(),
      }),
    );

    const state = freshState({
      notificationsInsertResponse: {
        data: [
          { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
          { id: 'n-u2-email', channel: 'email' as const, user_id: 'u2' },
        ],
        error: null,
      },
      usersRows: [
        { id: 'u1', email: 'u1@example.com' },
        { id: 'u2', email: 'u2@example.com' },
      ],
    });

    await emit(
      'team_matched',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      createFakeClient(state),
    );

    expect(signConfirmationToken).toHaveBeenCalledTimes(2);
    const calls = signConfirmationToken.mock.calls.map((c) => c[0]);
    expect(calls).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ uid: 'u1', tid: 'team-1', act: 'confirm' }),
        expect.objectContaining({ uid: 'u2', tid: 'team-1', act: 'confirm' }),
      ]),
    );
    vi.unstubAllEnvs();
  });

  it('does not mint when NOTIFICATION_TOKEN_SECRET is missing and logs a loud error once', async () => {
    vi.stubEnv('NOTIFICATION_TOKEN_SECRET', '');
    const state = freshState({
      notificationsInsertResponse: {
        data: [
          { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
          { id: 'n-u2-email', channel: 'email' as const, user_id: 'u2' },
        ],
        error: null,
      },
      usersRows: [
        { id: 'u1', email: 'u1@example.com' },
        { id: 'u2', email: 'u2@example.com' },
      ],
    });

    await emit(
      'team_matched',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      createFakeClient(state),
    );

    expect(signConfirmationToken).not.toHaveBeenCalled();
    const secretMissingLogs = logError.mock.calls.filter(
      (c) => c[0] === 'notifications.emit.magic_link_secret_missing',
    );
    expect(secretMissingLogs).toHaveLength(1);
    vi.unstubAllEnvs();
  });

  it('does not mint for kinds that do not need a magic link', async () => {
    vi.stubEnv('NOTIFICATION_TOKEN_SECRET', 'test-secret');
    const state = freshState({
      notificationsInsertResponse: {
        data: [
          { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
        ],
        error: null,
      },
      usersRows: [{ id: 'u1', email: 'u1@example.com' }],
    });

    await emit(
      'leader_claimed',
      {
        user_ids: ['u1'],
        team_id: 'team-1',
        payload: {
          kind: 'leader_claimed',
          team_id: 'team-1',
          team_name: 'Alpha',
          leader_name: 'Ana',
        },
      },
      createFakeClient(state),
    );

    expect(signConfirmationToken).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it('falls back to empty map when teamId is missing', async () => {
    vi.stubEnv('NOTIFICATION_TOKEN_SECRET', 'test-secret');
    const state = freshState({
      notificationsInsertResponse: {
        data: [
          { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
        ],
        error: null,
      },
      usersRows: [{ id: 'u1', email: 'u1@example.com' }],
    });

    await emit(
      'team_matched',
      {
        user_ids: ['u1'],
        team_id: null,
        payload: { kind: 'team_matched', team_id: '', team_name: 'Alpha' },
      },
      createFakeClient(state),
    );

    expect(signConfirmationToken).not.toHaveBeenCalled();
    vi.unstubAllEnvs();
  });

  it('continues with other users when one mint fails', async () => {
    vi.stubEnv('NOTIFICATION_TOKEN_SECRET', 'test-secret');
    signConfirmationToken.mockImplementation(
      async ({ uid }: { uid: string }) => {
        if (uid === 'u1') throw new Error('mint failed');
        return { token: `tok-${uid}`, nonce: `n-${uid}`, expiresAt: new Date() };
      },
    );

    const state = freshState({
      notificationsInsertResponse: {
        data: [
          { id: 'n-u1-email', channel: 'email' as const, user_id: 'u1' },
          { id: 'n-u2-email', channel: 'email' as const, user_id: 'u2' },
        ],
        error: null,
      },
      usersRows: [
        { id: 'u1', email: 'u1@example.com' },
        { id: 'u2', email: 'u2@example.com' },
      ],
    });

    const result = await emit(
      'team_matched',
      {
        user_ids: ['u1', 'u2'],
        team_id: 'team-1',
        payload: { kind: 'team_matched', team_id: 'team-1', team_name: 'Alpha' },
      },
      createFakeClient(state),
    );

    expect(signConfirmationToken).toHaveBeenCalledTimes(2);
    expect(result.notifications_created).toBe(2);
    expect(
      logError.mock.calls.some(
        (c) => c[0] === 'notifications.emit.magic_link_mint_failed',
      ),
    ).toBe(true);
    vi.unstubAllEnvs();
  });
});
