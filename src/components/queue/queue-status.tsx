"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";

interface QueueStatusProps {
  userId: string;
}

const TIPS = [
  "O match considera funcao principal, senioridade e interesses em comum.",
  "Os times saem em grupos de 3 a 4 pessoas, buscando combinacoes mais equilibradas.",
  "Assim que o seu time ficar pronto, voce vai direto para a tela de revelacao.",
  "Se quiser destravar repertorio enquanto espera, a aba Ideias ja esta liberada.",
];

export function QueueStatus({ userId }: QueueStatusProps) {
  const router = useRouter();
  const [tipIndex, setTipIndex] = useState(0);
  const supabase = createClient();

  useEffect(() => {
    const channel = supabase
      .channel("pool-updates")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "matchmaking_pool",
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          if (payload.new.status === "assigned") {
            router.push("/equipe/revelacao");
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
    <div className="mx-auto w-full max-w-3xl">
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
          Etapa 2
        </p>

        <div className="mt-7 flex flex-col items-center gap-5 sm:flex-row sm:justify-center sm:text-left">
          <div className="relative flex h-20 w-20 items-center justify-center">
            <div className="absolute inset-0 animate-ping rounded-full bg-brand-emerald/16" />
            <div className="absolute inset-[0.55rem] rounded-full border border-brand-emerald/26 bg-brand-emerald/10" />
            <div className="relative h-10 w-10 rounded-full bg-brand-emerald/45 shadow-[0_0_40px_rgba(0,139,76,0.35)]" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-emerald/80">
              Fila em andamento
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-heading text-4xl font-bold leading-[0.96] tracking-tight text-brand-off-white sm:text-5xl lg:text-6xl">
          Encontrando seu
          <span className="block text-brand-emerald">time ideal...</span>
        </h1>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <p className="flex items-center text-sm leading-7 text-brand-off-white/60">
            Voce recebera um email quando o time estiver pronto.
          </p>
        </div>

        <div className="mt-6 rounded-[1.5rem] border border-brand-yellow/20 bg-brand-yellow/8 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/78">
            Enquanto espera
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
            Crie sua conta no Colosseum para chegar pronto quando o time estiver
            fechado.
          </p>
          <div className="mt-4">
            <a
              href="https://arena.colosseum.org/signin"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg border border-brand-yellow/28 bg-brand-yellow/12 px-5 py-3 text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow/18"
            >
              Criar conta no Colosseum
            </a>
          </div>
        </div>

        <Card className="mt-8 min-h-[5rem] rounded-[1.5rem] border-brand-green/24 bg-brand-dark-green/64 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
            Agora
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-off-white/72 transition-opacity">
            {TIPS[tipIndex]}
          </p>
        </Card>
      </div>
    </div>
  );
}
