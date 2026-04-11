'use client';

import { useState } from 'react';
import { claimLeadership } from '@/app/(app)/team/[id]/actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export function ClaimLeaderButton({ teamId }: { teamId: string }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleClaim() {
    setLoading(true);
    const result = await claimLeadership(teamId);
    if (!result.success) {
      setMessage(result.message ?? 'Erro ao assumir liderança');
    }
    setLoading(false);
  }

  return (
    <Card className="rounded-[1.75rem] border-brand-yellow/24 bg-[linear-gradient(135deg,rgba(255,210,63,0.10),rgba(27,35,29,0.96))] p-5">
      <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/80">
        Quem lidera?
      </p>
      <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
        O time precisa de alguém para organizar o começo.
      </h3>
      <p className="mt-3 text-sm leading-7 text-brand-off-white/68">
        Quem assumir organiza o grupo, define a ideia e atualiza as
        informações do projeto.
      </p>

      <div className="mt-5 space-y-3">
        <Button onClick={handleClaim} disabled={loading} variant="secondary" fullWidth>
          {loading ? 'Assumindo...' : 'Assumir liderança'}
        </Button>
        {message && <p className="text-center text-sm text-brand-off-white/60">{message}</p>}
      </div>
    </Card>
  );
}
