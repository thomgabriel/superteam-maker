'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

interface QueueStatusProps {
  userId: string;
}

const TIPS = [
  'Dica: times são formados com base no seu perfil e experiência.',
  'Dica: cada time terá entre 3 e 4 pessoas.',
  'Dica: priorizamos diversidade de funções no time.',
  'Dica: conecte-se com seu time via WhatsApp após o match.',
];

export function QueueStatus({ userId }: QueueStatusProps) {
  const router = useRouter();
  const [tipIndex, setTipIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel('pool-updates')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'matchmaking_pool',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.status === 'assigned') {
            router.push('/equipe/revelacao');
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId, router, supabase]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTipIndex((prev) => (prev + 1) % TIPS.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center text-center">
      <div className="relative mb-8">
        <div className="h-20 w-20 animate-ping rounded-full bg-brand-emerald/20" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="h-12 w-12 rounded-full bg-brand-emerald/40" />
        </div>
      </div>

      <h1 className="font-heading text-2xl font-bold">
        Encontrando seu time...
      </h1>

      <p className="mt-2 text-brand-off-white/60">
        Isso pode levar alguns minutos
      </p>

      <p className="mt-1 text-sm text-brand-emerald">
        Você receberá um email quando seu time estiver pronto
      </p>

      <div className="mt-8 min-h-[3rem] rounded-lg border border-brand-green/20 px-6 py-3">
        <p className="text-sm text-brand-off-white/50 transition-opacity">
          {TIPS[tipIndex]}
        </p>
      </div>
    </div>
  );
}
