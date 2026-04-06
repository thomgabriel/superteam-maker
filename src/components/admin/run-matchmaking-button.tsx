'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { runMatchmakingNow } from '@/app/(app)/admin/actions';
import { Button } from '@/components/ui/button';

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
    <div className="space-y-3">
      <Button
        type="button"
        onClick={handleClick}
        disabled={isPending}
        variant="secondary"
        size="lg"
        fullWidth
      >
        {isPending ? 'Executando...' : 'Rodar matchmaking agora'}
      </Button>
      {message && <p className="text-sm leading-6 text-brand-off-white/62">{message}</p>}
    </div>
  );
}
