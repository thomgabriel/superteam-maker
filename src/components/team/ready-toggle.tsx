'use client';

import { useState } from 'react';
import { toggleReady } from '@/app/(app)/team/[id]/actions';
import { Button } from '@/components/ui/button';

export function ReadyToggle({ teamId, isReady }: { teamId: string; isReady: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  async function handleToggle() {
    setLoading(true);
    setError(false);
    try {
      await toggleReady(teamId);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button
        onClick={handleToggle}
        disabled={loading}
        variant={isReady ? 'secondary' : 'primary'}
        size="sm"
        className="mt-2"
      >
        {loading ? '...' : isReady ? 'Marcar como não pronto' : 'Pronto para começar'}
      </Button>
      {error && (
        <p className="mt-1 text-xs text-red-300">Erro ao atualizar. Tente novamente.</p>
      )}
    </>
  );
}
