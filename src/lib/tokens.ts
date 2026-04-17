// HMAC-SHA256 signed tokens for one-click email confirm/decline. Nonces
// stored in `confirmation_tokens`; signed payload is base64url.
//
// Flow: mint → email link → GET landing (read-only verify) → POST consume
// via `consumeConfirmationToken` (atomic `UPDATE ... WHERE consumed_at IS
// NULL RETURNING *`).
//
// Requires NOTIFICATION_TOKEN_SECRET env var (rotate quarterly).

import { createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { createServiceRoleClient } from '@/lib/supabase/server';

const TOKEN_VERSION = 'v1';

export type ConfirmationAction = 'confirm' | 'decline';

export interface ConfirmationTokenPayload {
  uid: string;
  tid: string;
  act: ConfirmationAction;
  nonce: string;
  exp: number; // unix seconds
}

export interface SignedConfirmationToken {
  token: string;
  nonce: string;
  expiresAt: Date;
}

interface SignConfirmationTokenArgs {
  uid: string;
  tid: string;
  act: ConfirmationAction;
  /**
   * Lifetime of the token in seconds. Defaults to 72h.
   */
  expSeconds?: number;
}

const DEFAULT_TTL_SECONDS = 72 * 60 * 60;

function getSecret(): Buffer {
  const secret = process.env.NOTIFICATION_TOKEN_SECRET;
  if (!secret) {
    throw new Error(
      'NOTIFICATION_TOKEN_SECRET is not configured — magic-token operations require it.',
    );
  }
  return Buffer.from(secret, 'utf8');
}

function base64UrlEncode(buffer: Buffer): string {
  return buffer
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/u, '');
}

function base64UrlDecode(input: string): Buffer {
  const padded = input.replace(/-/g, '+').replace(/_/g, '/');
  const padLength = (4 - (padded.length % 4)) % 4;
  return Buffer.from(padded + '='.repeat(padLength), 'base64');
}

function hmacSign(payload: string): string {
  const mac = createHmac('sha256', getSecret()).update(payload).digest();
  return base64UrlEncode(mac);
}

function safeEqual(a: string, b: string): boolean {
  const aBuf = Buffer.from(a);
  const bBuf = Buffer.from(b);
  if (aBuf.length !== bBuf.length) return false;
  return timingSafeEqual(aBuf, bBuf);
}

/**
 * Mint a new signed confirmation token and persist its nonce. The caller is
 * responsible for embedding the returned `token` string in the email link.
 */
export async function signConfirmationToken(
  args: SignConfirmationTokenArgs,
): Promise<SignedConfirmationToken> {
  const expSeconds = args.expSeconds ?? DEFAULT_TTL_SECONDS;
  const nonce = base64UrlEncode(randomBytes(16));
  const exp = Math.floor(Date.now() / 1000) + expSeconds;
  const payload: ConfirmationTokenPayload = {
    uid: args.uid,
    tid: args.tid,
    act: args.act,
    nonce,
    exp,
  };

  const payloadJson = JSON.stringify(payload);
  const payloadB64 = base64UrlEncode(Buffer.from(payloadJson, 'utf8'));
  const signature = hmacSign(`${TOKEN_VERSION}.${payloadB64}`);
  const token = `${TOKEN_VERSION}.${payloadB64}.${signature}`;

  const expiresAt = new Date(exp * 1000);

  const db = await createServiceRoleClient();
  const { error } = await db.from('confirmation_tokens').insert({
    nonce,
    user_id: args.uid,
    team_id: args.tid,
    action: args.act,
    expires_at: expiresAt.toISOString(),
  });

  if (error) {
    throw new Error(`Failed to persist confirmation token nonce: ${error.message}`);
  }

  return { token, nonce, expiresAt };
}

export class ConfirmationTokenError extends Error {
  readonly code:
    | 'malformed'
    | 'bad_signature'
    | 'bad_version'
    | 'expired'
    | 'invalid_payload';

  constructor(code: ConfirmationTokenError['code'], message?: string) {
    super(message ?? code);
    this.code = code;
    this.name = 'ConfirmationTokenError';
  }
}

/**
 * Verify a token string. Returns the parsed payload on success. Throws a
 * `ConfirmationTokenError` on any parse / signature / expiry failure. Does
 * NOT check `consumed_at` — that's the job of `consumeConfirmationToken` so
 * GET can render a landing page without mutating state.
 */
export function verifyConfirmationToken(token: string): ConfirmationTokenPayload {
  if (!token || typeof token !== 'string') {
    throw new ConfirmationTokenError('malformed');
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    throw new ConfirmationTokenError('malformed');
  }

  const [version, payloadB64, signature] = parts;

  if (version !== TOKEN_VERSION) {
    throw new ConfirmationTokenError('bad_version');
  }

  const expectedSig = hmacSign(`${version}.${payloadB64}`);
  if (!safeEqual(signature, expectedSig)) {
    throw new ConfirmationTokenError('bad_signature');
  }

  let parsed: unknown;
  try {
    parsed = JSON.parse(base64UrlDecode(payloadB64).toString('utf8'));
  } catch {
    throw new ConfirmationTokenError('invalid_payload');
  }

  if (!parsed || typeof parsed !== 'object') {
    throw new ConfirmationTokenError('invalid_payload');
  }

  const candidate = parsed as Record<string, unknown>;
  if (
    typeof candidate.uid !== 'string' ||
    typeof candidate.tid !== 'string' ||
    typeof candidate.nonce !== 'string' ||
    typeof candidate.exp !== 'number' ||
    (candidate.act !== 'confirm' && candidate.act !== 'decline')
  ) {
    throw new ConfirmationTokenError('invalid_payload');
  }

  if (candidate.exp * 1000 < Date.now()) {
    throw new ConfirmationTokenError('expired');
  }

  return {
    uid: candidate.uid,
    tid: candidate.tid,
    act: candidate.act,
    nonce: candidate.nonce,
    exp: candidate.exp,
  };
}

export interface ConsumedConfirmationToken {
  nonce: string;
  user_id: string;
  team_id: string;
  action: ConfirmationAction;
  expires_at: string;
  consumed_at: string;
  created_at: string;
}

/**
 * Atomically mark a token as consumed. Returns the row or null if the nonce
 * was already consumed / doesn't exist. Safe against email-scanner replay —
 * only the first successful consume wins.
 */
export async function consumeConfirmationToken(
  nonce: string,
): Promise<ConsumedConfirmationToken | null> {
  if (!nonce) return null;
  const db = await createServiceRoleClient();
  const { data, error } = await db
    .from('confirmation_tokens')
    .update({ consumed_at: new Date().toISOString() })
    .eq('nonce', nonce)
    .is('consumed_at', null)
    .select('*')
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to consume confirmation token: ${error.message}`);
  }

  if (!data) return null;
  return data as ConsumedConfirmationToken;
}

/**
 * Read a token nonce without consuming it. Used by the GET landing page to
 * decide whether to render the confirm UI or a "token already used" state.
 */
export async function peekConfirmationToken(
  nonce: string,
): Promise<ConsumedConfirmationToken | null> {
  if (!nonce) return null;
  const db = await createServiceRoleClient();
  const { data, error } = await db
    .from('confirmation_tokens')
    .select('*')
    .eq('nonce', nonce)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to read confirmation token: ${error.message}`);
  }

  if (!data) return null;
  return data as ConsumedConfirmationToken;
}

/**
 * Convenience builder used by email templates to produce the full URL.
 */
export function buildConfirmationLink(token: string, baseUrl?: string): string {
  // Use || (not ??) so an accidentally-empty env var falls back to localhost
  // instead of producing a relative URL in outbound email links.
  const appUrl =
    (baseUrl && baseUrl.trim()) ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'http://localhost:3000';
  const normalized = appUrl.replace(/\/+$/u, '');
  const encoded = encodeURIComponent(token);
  return `${normalized}/team/confirm?t=${encoded}`;
}
