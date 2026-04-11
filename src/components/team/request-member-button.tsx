'use client';

import { useState } from 'react';
import { requestExtraMember } from '@/app/(app)/team/[id]/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function RequestMemberButton({ teamId }: { teamId: string }) {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{ success: boolean; message?: string; memberName?: string } | null>(null);

  async function handleRequest() {
    setLoading(true);
    setResult(null);
    try {
      const res = await requestExtraMember(teamId);
      setResult(res);
    } catch {
      setResult({ success: false, message: 'Erro inesperado. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  }

  if (result?.success) {
    return (
      <Card className="rounded-[1.75rem] border-brand-emerald/24 bg-brand-emerald/8 p-5">
        <p className="text-sm leading-7 text-brand-off-white/78">
          <strong className="text-brand-emerald">{result.memberName}</strong> foi adicionado ao time!
        </p>
      </Card>
    );
  }

  return (
    <Card className="rounded-[1.75rem] border-brand-green/22 bg-brand-green/8 p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
        Time com 3 membros
      </p>
      <p className="mt-2 text-sm leading-7 text-brand-off-white/68">
        Você pode pedir mais uma pessoa compatível da fila para completar o time.
      </p>

      {result && !result.success && (
        <p className="mt-3 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {result.message}
        </p>
      )}

      <div className="mt-4">
        <Button
          onClick={handleRequest}
          disabled={loading}
          variant="primary"
          size="lg"
        >
          {loading ? 'Buscando...' : 'Pedir mais um membro'}
        </Button>
      </div>
    </Card>
  );
}
