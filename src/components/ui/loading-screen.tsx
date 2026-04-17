'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const STALLED_AFTER_MS = 10_000;

export function LoadingScreen() {
  const [stalled, setStalled] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setStalled(true), STALLED_AFTER_MS);
    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden px-4">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.12),transparent_42%),radial-gradient(circle_at_18%_22%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
      </div>

      <div className="relative z-10 flex flex-col items-center text-center">
        <Image
          src="/brand/logo/symbol.svg"
          alt="Superteam Brasil"
          width={52}
          height={52}
          priority
        />
        <div className="mt-5 h-10 w-10 animate-spin rounded-full border-2 border-brand-green/25 border-t-brand-emerald" />
        <p className="mt-5 text-xs uppercase tracking-[0.18em] text-brand-off-white/48">
          Carregando
        </p>

        {stalled && (
          <div className="mt-8 flex flex-col items-center gap-3">
            <p className="text-sm text-brand-off-white/60">
              Demorando mais que o esperado...
            </p>
            <Button
              variant="accent"
              size="sm"
              onClick={() => window.location.reload()}
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </main>
  );
}
