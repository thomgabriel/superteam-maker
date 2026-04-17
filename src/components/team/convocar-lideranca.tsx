'use client';

import { useState } from 'react';
import { requestLeaderReclaim } from '@/app/(app)/team/[id]/dormant-actions';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface ConvocarLiderancaProps {
  teamId: string;
  dormantSince: string;
}

export function ConvocarLideranca({ teamId, dormantSince }: ConvocarLiderancaProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirming, setConfirming] = useState(false);

  const hoursSince = Math.floor(
    (Date.now() - new Date(dormantSince).getTime()) / (60 * 60 * 1000),
  );

  async function handleConfirm() {
    setLoading(true);
    setError(null);
    try {
      const result = await requestLeaderReclaim(teamId);
      if (!result.success) {
        setError(result.message ?? 'Não foi possível abrir a liderança.');
      }
    } catch {
      setError('Não foi possível abrir a liderança agora.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="rounded-2xl border-brand-yellow/28 bg-[linear-gradient(135deg,rgba(255,210,63,0.12),rgba(27,35,29,0.96))] p-5">
      <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow/82">
        Liderança inativa
      </p>
      <h3 className="mt-2 font-heading text-lg font-semibold text-brand-off-white">
        O líder atual não aparece há {hoursSince}h.
      </h3>
      <p className="mt-2 text-sm leading-6 text-brand-off-white/70">
        Se o time achar necessário, qualquer membro pode abrir a liderança para um novo
        responsável assumir. O time volta para a fase de claim por 24h.
      </p>

      {error && <p className="mt-3 text-sm text-red-300">{error}</p>}

      {!confirming ? (
        <div className="mt-4">
          <Button variant="secondary" onClick={() => setConfirming(true)}>
            Convocar nova liderança
          </Button>
        </div>
      ) : (
        <div className="mt-4 space-y-3">
          <p className="text-sm text-brand-off-white/72">
            Tem certeza? O líder atual perde o status e qualquer membro poderá assumir.
          </p>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleConfirm}
              disabled={loading}
            >
              {loading ? 'Abrindo...' : 'Sim, abrir liderança'}
            </Button>
            <Button
              variant="accent"
              onClick={() => setConfirming(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
          </div>
        </div>
      )}
    </Card>
  );
}
