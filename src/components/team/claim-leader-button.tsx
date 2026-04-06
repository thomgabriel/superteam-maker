'use client';

import { useState } from 'react';
import { claimLeadership } from '@/app/(app)/equipe/[id]/actions';

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
    <div className="space-y-2">
      <button onClick={handleClaim} disabled={loading}
        className="w-full rounded-lg bg-brand-yellow px-4 py-3 font-heading font-semibold text-brand-dark-green transition-opacity hover:opacity-90 disabled:opacity-50">
        {loading ? 'Assumindo...' : 'Assumir liderança'}
      </button>
      {message && <p className="text-center text-sm text-brand-off-white/60">{message}</p>}
    </div>
  );
}
