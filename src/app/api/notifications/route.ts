import { NextResponse, type NextRequest } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { renderInAppMessage } from '@/lib/notifications/templates';
import type { NotificationEventPayload } from '@/lib/notifications/types';
import { logError } from '@/lib/monitoring';

export const dynamic = 'force-dynamic';

interface NotificationJoinRow {
  id: string;
  created_at: string;
  read_at: string | null;
  status: string;
  notification_events:
    | {
        id: string;
        kind: string;
        payload: NotificationEventPayload;
        emitted_at: string;
      }
    | {
        id: string;
        kind: string;
        payload: NotificationEventPayload;
        emitted_at: string;
      }[]
    | null;
}

interface PublicNotification {
  id: string;
  kind: string;
  title: string;
  message: string;
  href: string;
  created_at: string;
  read_at: string | null;
}

export async function GET() {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // RLS on `notifications` restricts by user_id; the explicit filter keeps
    // the query planner happy and doubles as defense in depth.
    const { data, error } = await supabase
      .from('notifications')
      .select(
        `
        id,
        created_at,
        read_at,
        status,
        notification_events:event_id (
          id,
          kind,
          payload,
          emitted_at
        )
      `,
      )
      .eq('user_id', user.id)
      .eq('channel', 'in_app')
      .in('status', ['pending', 'sent', 'delivered'])
      .order('created_at', { ascending: false })
      .limit(30);

    if (error) {
      logError('notifications.api.list_failed', error);
      return NextResponse.json(
        { error: 'Failed to load notifications' },
        { status: 500 },
      );
    }

    const items: PublicNotification[] = ((data ?? []) as NotificationJoinRow[])
      .map((row) => {
        const event = Array.isArray(row.notification_events)
          ? row.notification_events[0]
          : row.notification_events;

        if (!event) return null;

        try {
          const rendered = renderInAppMessage(event.payload);
          return {
            id: row.id,
            kind: event.kind,
            title: rendered.title,
            message: rendered.message,
            href: rendered.href,
            created_at: row.created_at,
            read_at: row.read_at,
          };
        } catch (error) {
          logError('notifications.api.render_failed', error, {
            notification_id: row.id,
          });
          return null;
        }
      })
      .filter((entry): entry is PublicNotification => entry !== null);

    const unread = items.filter((item) => item.read_at === null).length;

    return NextResponse.json({ items, unread });
  } catch (error) {
    logError('notifications.api.unexpected', error);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 },
    );
  }
}

interface PostBody {
  action?: 'read';
  ids?: string[]; // when empty / omitted on 'read', marks all as read
}

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    let body: PostBody = {};
    try {
      body = (await request.json()) as PostBody;
    } catch {
      body = {};
    }

    if (body.action !== 'read') {
      return NextResponse.json(
        { error: 'Unsupported action' },
        { status: 400 },
      );
    }

    const nowIso = new Date().toISOString();

    let query = supabase
      .from('notifications')
      .update({ read_at: nowIso })
      .eq('user_id', user.id)
      .eq('channel', 'in_app')
      .is('read_at', null);

    if (Array.isArray(body.ids) && body.ids.length > 0) {
      // Defensive filter — only string ids
      const clean = body.ids.filter((id): id is string => typeof id === 'string');
      if (clean.length === 0) {
        return NextResponse.json({ updated: 0 });
      }
      query = query.in('id', clean);
    }

    const { data, error } = await query.select('id');

    if (error) {
      logError('notifications.api.mark_read_failed', error);
      return NextResponse.json(
        { error: 'Failed to mark as read' },
        { status: 500 },
      );
    }

    return NextResponse.json({ updated: data?.length ?? 0 });
  } catch (error) {
    logError('notifications.api.mark_read_unexpected', error);
    return NextResponse.json(
      { error: 'Unexpected error' },
      { status: 500 },
    );
  }
}
