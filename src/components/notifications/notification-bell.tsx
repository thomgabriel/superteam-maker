'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

interface NotificationItem {
  id: string;
  kind: string;
  title: string;
  message: string;
  href: string;
  created_at: string;
  read_at: string | null;
}

interface ApiResponse {
  items: NotificationItem[];
  unread: number;
}

const POLL_INTERVAL_MS = 30_000;

const RELATIVE_TIME = new Intl.RelativeTimeFormat('pt-BR', { style: 'short' });

function formatRelative(iso: string): string {
  const createdAt = new Date(iso).getTime();
  if (Number.isNaN(createdAt)) return '';
  const diffSeconds = Math.round((createdAt - Date.now()) / 1000);

  const units: Array<[Intl.RelativeTimeFormatUnit, number]> = [
    ['year', 60 * 60 * 24 * 365],
    ['month', 60 * 60 * 24 * 30],
    ['week', 60 * 60 * 24 * 7],
    ['day', 60 * 60 * 24],
    ['hour', 60 * 60],
    ['minute', 60],
  ];

  for (const [unit, seconds] of units) {
    if (Math.abs(diffSeconds) >= seconds) {
      return RELATIVE_TIME.format(Math.round(diffSeconds / seconds), unit);
    }
  }
  return 'agora';
}

export function NotificationBell() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const fetchNotifications = useCallback(async () => {
    try {
      const res = await fetch('/api/notifications', {
        cache: 'no-store',
        credentials: 'include',
      });
      if (!res.ok) return;
      const data = (await res.json()) as ApiResponse;
      setItems(data.items ?? []);
      setUnread(data.unread ?? 0);
    } catch {
      // Silent: bell is non-critical UI.
    }
  }, []);

  useEffect(() => {
    fetchNotifications();
    const interval = window.setInterval(fetchNotifications, POLL_INTERVAL_MS);
    return () => window.clearInterval(interval);
  }, [fetchNotifications]);

  useEffect(() => {
    if (!open) return;

    function handlePointer(event: MouseEvent) {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }

    function handleKey(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handlePointer);
    document.addEventListener('keydown', handleKey);
    return () => {
      document.removeEventListener('mousedown', handlePointer);
      document.removeEventListener('keydown', handleKey);
    };
  }, [open]);

  const toggle = useCallback(async () => {
    setOpen((prev) => {
      const next = !prev;
      if (next) {
        void fetchNotifications();
      }
      return next;
    });
  }, [fetchNotifications]);

  const markAllAsRead = useCallback(async () => {
    if (unread === 0) return;
    setLoading(true);
    try {
      await fetch('/api/notifications', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ action: 'read' }),
      });
      setItems((rows) =>
        rows.map((row) => (row.read_at ? row : { ...row, read_at: new Date().toISOString() })),
      );
      setUnread(0);
    } finally {
      setLoading(false);
    }
  }, [unread]);

  const handleItemClick = useCallback(
    async (item: NotificationItem) => {
      if (!item.read_at) {
        try {
          await fetch('/api/notifications', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            credentials: 'include',
            body: JSON.stringify({ action: 'read', ids: [item.id] }),
          });
          setItems((rows) =>
            rows.map((row) =>
              row.id === item.id
                ? { ...row, read_at: new Date().toISOString() }
                : row,
            ),
          );
          setUnread((count) => Math.max(0, count - 1));
        } catch {
          // Don't block navigation on mark-as-read failures.
        }
      }
      setOpen(false);
      if (item.href) {
        // Same-origin hrefs use the client router to preserve React state
        // (queue realtime channels, in-flight form state, etc.). External
        // URLs fall back to full navigation.
        const isExternal = /^https?:\/\//i.test(item.href);
        if (isExternal) {
          window.location.href = item.href;
        } else {
          router.push(item.href);
        }
      }
    },
    [router],
  );

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={toggle}
        aria-label={unread > 0 ? `Notificações (${unread} novas)` : 'Notificações'}
        aria-expanded={open}
        className="relative flex h-10 w-10 items-center justify-center rounded-full border border-brand-green/25 bg-brand-dark-green/55 text-brand-off-white/80 transition-colors hover:border-brand-green hover:text-brand-off-white"
      >
        <BellIcon />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex min-h-[18px] min-w-[18px] items-center justify-center rounded-full bg-brand-yellow px-1 text-[10px] font-bold text-brand-dark-green">
            {unread > 9 ? '9+' : unread}
          </span>
        )}
      </button>

      {open && (
        <div
          role="dialog"
          aria-label="Notificações"
          className="absolute right-0 z-40 mt-2 w-[min(360px,calc(100vw-32px))] overflow-hidden rounded-2xl border border-brand-green/25 bg-brand-dark-green/95 shadow-2xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between border-b border-brand-green/20 px-4 py-3">
            <span className="font-heading text-sm font-semibold uppercase tracking-[0.18em] text-brand-off-white">
              Notificações
            </span>
            <button
              type="button"
              onClick={markAllAsRead}
              disabled={loading || unread === 0}
              className="text-xs font-semibold uppercase tracking-[0.18em] text-brand-yellow disabled:cursor-not-allowed disabled:opacity-40"
            >
              Marcar lidas
            </button>
          </div>

          <ul className="max-h-[420px] overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-brand-off-white/60">
                Você está em dia. Nada novo por aqui.
              </li>
            ) : (
              items.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => handleItemClick(item)}
                    className={`flex w-full flex-col gap-1 border-b border-brand-green/10 px-4 py-3 text-left transition-colors hover:bg-brand-green/10 ${
                      item.read_at ? 'opacity-70' : ''
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-heading text-sm font-semibold text-brand-off-white">
                        {item.title}
                      </span>
                      <span className="shrink-0 text-[11px] text-brand-off-white/50">
                        {formatRelative(item.created_at)}
                      </span>
                    </div>
                    <span className="text-xs leading-relaxed text-brand-off-white/70">
                      {item.message}
                    </span>
                    {!item.read_at && (
                      <span className="mt-1 inline-block h-1.5 w-1.5 rounded-full bg-brand-yellow" />
                    )}
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

function BellIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}
