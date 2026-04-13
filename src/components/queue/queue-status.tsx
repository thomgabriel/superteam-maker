"use client";

import { useEffect, useEffectEvent, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Card } from "@/components/ui/card";
import type { Profile } from "@/types/database";
import Link from "next/link";
import Image from "next/image";
import registeringGif from "@/app/registering.gif";

interface QueueStatusProps {
  userId: string;
  profile: Profile | null;
  interests: string[];
  poolEntryCreatedAt: string | null;
  poolCount: number | null;
}

function formatRelativeTime(dateString: string): string {
  const diffMs = Date.now() - new Date(dateString).getTime();
  const minutes = Math.floor(diffMs / 60000);
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `há ${hours}h`;
  const days = Math.floor(hours / 24);
  return `há ${days}d`;
}

const TIPS = [
  "Os times são montados com base no que você faz, sua experiência e seus interesses.",
  "Cada time tem de 3 a 4 pessoas com perfis diferentes.",
  "Você vai receber um email quando seu time estiver pronto.",
  "Enquanto espera, explore ideias na aba Ideias do menu.",
];

export function QueueStatus({
  userId,
  profile,
  interests,
  poolEntryCreatedAt,
  poolCount,
}: QueueStatusProps) {
  const router = useRouter();
  const [tipIndex, setTipIndex] = useState(0);
  const [connectionMode, setConnectionMode] = useState<"realtime" | "polling">(
    "realtime",
  );
  const supabase = useMemo(() => createClient(), []);

  const syncRedirectPath = useEffectEvent(async () => {
    try {
      const res = await fetch("/api/user-state", {
        method: "GET",
        cache: "no-store",
      });

      if (!res.ok) return;

      const data = await res.json();
      if (
        typeof data.redirectPath === "string" &&
        data.redirectPath !== "/queue"
      ) {
        router.push(data.redirectPath);
      }
    } catch {
      // Keep the waiting experience calm if state sync fails temporarily.
    }
  });

  useEffect(() => {
    let cancelled = false;

    async function checkUserState() {
      if (cancelled) return;
      await syncRedirectPath();
    }

    if (connectionMode !== "polling") {
      return () => {
        cancelled = true;
      };
    }

    checkUserState();
    const pollingInterval = setInterval(checkUserState, 20_000);

    return () => {
      cancelled = true;
      clearInterval(pollingInterval);
    };
  }, [connectionMode, router]);

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
            void syncRedirectPath();
          }
        },
      )
      .subscribe((status) => {
        if (status === "SUBSCRIBED") {
          setConnectionMode("realtime");
          return;
        }

        if (
          status === "CHANNEL_ERROR" ||
          status === "TIMED_OUT" ||
          status === "CLOSED"
        ) {
          setConnectionMode("polling");
        }
      });

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
              Buscando seu time
            </p>
          </div>
        </div>

        <h1 className="mt-8 font-heading text-4xl font-bold leading-[0.96] tracking-tight text-brand-off-white sm:text-5xl lg:text-6xl">
          Montando seu
          <span className="block text-brand-emerald">time...</span>
        </h1>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
          <p className="flex items-center text-sm leading-7 text-brand-off-white/60">
            Quando o time estiver pronto, você recebe um email.
          </p>
        </div>

        {/* Queue context */}
        <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs text-brand-off-white/42">
          {poolCount !== null && (
            <span>
              {poolCount} {poolCount === 1 ? "pessoa" : "pessoas"} na fila agora
            </span>
          )}
          {poolCount !== null && poolEntryCreatedAt && (
            <span className="text-brand-off-white/22">·</span>
          )}
          {poolEntryCreatedAt && (
            <span>Você entrou {formatRelativeTime(poolEntryCreatedAt)}</span>
          )}
        </div>

        {/* Profile recap */}
        {profile && (
          <div className="mt-8 w-full max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.2em] text-brand-off-white/34">
              Perfil enviado
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-x-3 gap-y-2 text-sm text-brand-off-white/52">
              <span className="font-medium text-brand-off-white/74">
                {profile.primary_role}
              </span>
              {profile.phone_number && (
                <>
                  <span className="text-brand-off-white/18">·</span>
                  <span>Tel: ****{profile.phone_number.slice(-4)}</span>
                </>
              )}
              {interests.length > 0 && (
                <>
                  <span className="text-brand-off-white/18">·</span>
                  <span>{interests.slice(0, 3).join(" · ")}</span>
                </>
              )}
              <span className="text-brand-off-white/18">·</span>
              <Link
                href="/profile"
                className="font-medium text-brand-emerald/78 transition-colors hover:text-brand-emerald"
              >
                Editar perfil
              </Link>
            </div>
          </div>
        )}

        <Card className="mt-8 overflow-hidden rounded-[1.75rem] border-brand-yellow/24 bg-[linear-gradient(180deg,rgba(255,210,63,0.10),rgba(255,210,63,0.05))] px-6 py-6 text-left">
          <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/78">
                Enquanto espera
              </p>
              <h2 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
                Entre no Frontier agora
              </h2>
              <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
                Crie sua conta no Colosseum e clique em &quot;Register Now&quot;
                para entrar no hackathon Frontier.
              </p>
              <div className="mt-5">
                <a
                  href="https://arena.colosseum.org/signin?ref=criptosonhos"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center rounded-lg border border-brand-yellow/28 bg-brand-yellow/12 px-5 py-3 text-sm font-semibold text-brand-yellow transition-colors hover:bg-brand-yellow/18"
                >
                  Criar conta no Colosseum
                </a>
              </div>
            </div>

            <div className="mx-auto w-full max-w-[22rem]">
              <div className="overflow-hidden rounded-[1.25rem] border border-brand-yellow/20 bg-brand-dark-green/55 shadow-[0_18px_50px_rgba(0,0,0,0.22)]">
                <Image
                  src={registeringGif}
                  alt='Demonstração do botão "Register Now" no Colosseum'
                  className="h-auto w-full"
                  priority
                />
              </div>
            </div>
          </div>
        </Card>

        <Card className="mt-8 min-h-[5rem] rounded-[1.5rem] border-brand-green/24 bg-brand-dark-green/64 px-6 py-5">
          <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
            {connectionMode === "realtime" ? "Agora" : "Conexão alternativa"}
          </p>
          <p className="mt-3 text-sm leading-7 text-brand-off-white/72 transition-opacity">
            {connectionMode === "realtime"
              ? TIPS[tipIndex]
              : "Estamos verificando seu status automaticamente."}
          </p>
        </Card>
      </div>
    </div>
  );
}
