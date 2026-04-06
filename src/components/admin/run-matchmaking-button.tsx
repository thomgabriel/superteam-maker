'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { runMatchmakingNow } from '@/app/(app)/admin/actions';

export function RunMatchmakingButton() {
  const router = useRouter();
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const result = await runMatchmakingNow();
      setMessage(result.message);
      router.refresh();
    });
  }

  return (
    <div className="space-y-2">
      <button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        className="rounded-lg bg-brand-yellow px-4 py-2 font-heading text-sm font-semibold text-brand-dark-green transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {isPending ? 'Executando...' : 'Rodar matchmaking agora'}
      </button>
      {message && <p className="text-sm text-brand-off-white/60">{message}</p>}
    </div>
  );
}

