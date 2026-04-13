'use client';

import { useState } from 'react';
import { reenterPool } from './actions';
import { Button } from '@/components/ui/button';

export function RequeueButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleRequeue() {
    setLoading(true);
    setError(null);
    try {
      await reenterPool();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Button onClick={handleRequeue} disabled={loading} variant="primary" size="lg" fullWidth>
        {loading ? 'Voltando para a fila...' : 'Voltar para a fila'}
      </Button>
      {error && (
        <p className="mt-2 text-center text-sm text-red-300">{error}</p>
      )}
    </>
  );
}
