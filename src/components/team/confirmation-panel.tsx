"use client";

// Mutual confirmation panel. Live count via Supabase Realtime on
// team_confirmations; falls back to 30s polling on channel error.

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { MemberCard } from "@/components/team/member-card";
import { CountdownBanner } from "@/components/team/countdown-banner";
import { createClient } from "@/lib/supabase/client";
import {
  confirmTeamAction,
  declineTeamAction,
} from "@/app/(app)/team/[id]/actions";

export interface ConfirmationPanelMember {
  id: string;
  user_id: string;
  name: string;
  primary_role: string;
  macro_role: string;
  seniority: string;
}

export interface ConfirmationPanelProps {
  teamId: string;
  teamName: string;
  members: ConfirmationPanelMember[];
  currentUserId: string;
  confirmationDeadline: string | null;
  /**
   * Initial decision by the current user, if any (from SSR). Null = pending.
   */
  myDecision: "confirmed" | "declined" | null;
  /**
   * Initial confirmation counts from SSR, updated live by the realtime channel.
   */
  initialConfirmed: number;
  initialDeclined: number;
}

const DECLINE_REASONS = [
  { value: "not_aligned", label: "Não combina com meu objetivo" },
  { value: "timezone", label: "Problema de fuso horário" },
  { value: "no_fit", label: "Não senti conexão" },
  { value: "other", label: "Outro" },
] as const;

type DeclineReason = (typeof DECLINE_REASONS)[number]["value"];

export function ConfirmationPanel({
  teamId,
  teamName,
  members,
  currentUserId,
  confirmationDeadline,
  myDecision,
  initialConfirmed,
  initialDeclined,
}: ConfirmationPanelProps) {
  const router = useRouter();
  const supabase = useMemo(() => createClient(), []);
  const [confirmedCount, setConfirmedCount] = useState(initialConfirmed);
  const [declinedCount, setDeclinedCount] = useState(initialDeclined);
  const [decision, setDecision] = useState<"confirmed" | "declined" | null>(
    myDecision,
  );
  const [busy, setBusy] = useState<"confirm" | "decline" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeclineForm, setShowDeclineForm] = useState(false);
  const [reason, setReason] = useState<DeclineReason>("not_aligned");
  const [reasonDetail, setReasonDetail] = useState("");
  const [connectionMode, setConnectionMode] = useState<"realtime" | "polling">(
    "realtime",
  );

  const totalMembers = members.length;

  async function refreshCounts() {
    const { data } = await supabase
      .from("team_confirmations")
      .select("confirmed")
      .eq("team_id", teamId);

    if (!data) return;
    let confirmed = 0;
    let declined = 0;
    for (const row of data as { confirmed: boolean }[]) {
      if (row.confirmed) confirmed += 1;
      else declined += 1;
    }
    setConfirmedCount(confirmed);
    setDeclinedCount(declined);
  }

  useEffect(() => {
    const channel = supabase
      .channel(`team-confirmations-${teamId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "team_confirmations",
          filter: `team_id=eq.${teamId}`,
        },
        () => {
          void refreshCounts();
          router.refresh();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [teamId, supabase]);

  useEffect(() => {
    if (connectionMode !== "polling") return;
    const interval = setInterval(() => {
      void refreshCounts();
      router.refresh();
    }, 30_000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [connectionMode]);

  async function handleConfirm() {
    setBusy("confirm");
    setErrorMessage(null);
    try {
      const fd = new FormData();
      fd.append("teamId", teamId);
      const result = await confirmTeamAction(fd);
      if (!result?.success) {
        setErrorMessage(
          result?.message ?? "Não foi possível confirmar agora. Tente novamente.",
        );
      } else {
        setDecision("confirmed");
        await refreshCounts();
        router.refresh();
      }
    } catch {
      setErrorMessage("Erro inesperado ao confirmar.");
    } finally {
      setBusy(null);
    }
  }

  async function handleDecline() {
    setBusy("decline");
    setErrorMessage(null);
    try {
      const reasonLabel =
        DECLINE_REASONS.find((r) => r.value === reason)?.label ?? reason;
      const composedReason =
        reason === "other" && reasonDetail.trim().length > 0
          ? `${reasonLabel}: ${reasonDetail.trim()}`
          : reasonLabel;

      const fd = new FormData();
      fd.append("teamId", teamId);
      fd.append("reason", composedReason);
      const result = await declineTeamAction(fd);
      if (!result?.success) {
        setErrorMessage(
          result?.message ?? "Não foi possível recusar agora. Tente novamente.",
        );
      } else {
        setDecision("declined");
        setShowDeclineForm(false);
        await refreshCounts();
        router.refresh();
      }
    } catch {
      setErrorMessage("Erro inesperado ao recusar.");
    } finally {
      setBusy(null);
    }
  }

  const nonCurrentMembers = members.filter((m) => m.user_id !== currentUserId);
  const needsThree = Math.max(0, 3 - confirmedCount);

  return (
    <div className="space-y-6">
      <Card className="rounded-[2rem] border-brand-emerald/30 bg-[linear-gradient(180deg,rgba(0,139,76,0.14),rgba(27,35,29,0.92))] p-6 sm:p-7">
        <p className="text-xs uppercase tracking-[0.2em] text-brand-emerald/82">
          Time proposto
        </p>
        <h1 className="mt-4 font-heading text-3xl font-bold leading-tight text-brand-off-white sm:text-4xl">
          {teamName}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-brand-off-white/72">
          Vocês foram sugeridos para formar um time. Cada pessoa precisa
          confirmar que quer seguir com esse grupo. Assim que{" "}
          <span className="font-semibold text-brand-off-white">3 membros</span>{" "}
          confirmarem, o time avança para a próxima etapa.
        </p>

        <div className="mt-5 flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.16em] text-brand-off-white/60">
          <span className="rounded-full border border-brand-emerald/24 bg-brand-emerald/10 px-3 py-1 text-brand-emerald">
            {confirmedCount} de {totalMembers} confirmaram
          </span>
          {declinedCount > 0 && (
            <span className="rounded-full border border-red-400/26 bg-red-400/10 px-3 py-1 text-red-200">
              {declinedCount} recus{declinedCount === 1 ? "ou" : "aram"}
            </span>
          )}
          {needsThree > 0 && (
            <span className="rounded-full border border-brand-yellow/26 bg-brand-yellow/10 px-3 py-1 text-brand-yellow">
              Falta{needsThree === 1 ? "" : "m"} {needsThree} para avançar
            </span>
          )}
          {connectionMode === "polling" && (
            <span className="rounded-full border border-brand-off-white/14 bg-brand-off-white/8 px-3 py-1 text-brand-off-white/55">
              Atualizando a cada 30s
            </span>
          )}
        </div>
      </Card>

      {confirmationDeadline && (
        <CountdownBanner
          deadline={confirmationDeadline}
          label="Prazo para todos confirmarem"
          description="Depois desse prazo, o time é dissolvido e os membros voltam para a fila com prioridade."
        />
      )}

      <section className="grid gap-4 sm:grid-cols-2">
        {members.map((member) => (
          <MemberCard
            key={member.id}
            name={member.name}
            specificRole={member.primary_role}
            macroRole={member.macro_role}
            seniority={member.seniority}
            isLeader={false}
          />
        ))}
      </section>

      <Card className="rounded-[1.75rem] border-brand-green/28 bg-brand-dark-green/82 p-6">
        {decision === "confirmed" ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-emerald/82">
              Você confirmou
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
              Aguardando os outros membros
            </h3>
            <p className="mt-3 text-sm leading-7 text-brand-off-white/70">
              Assim que o time chegar a 3 confirmações, a próxima etapa abre
              automaticamente. Você vai receber um aviso por email e no app.
            </p>
            {nonCurrentMembers.length > 0 && (
              <p className="mt-3 text-xs text-brand-off-white/54">
                Esperando: {nonCurrentMembers.map((m) => m.name).join(", ")}
              </p>
            )}
          </div>
        ) : decision === "declined" ? (
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
              Decisão registrada
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
              Vamos te devolver para a fila
            </h3>
            <p className="mt-3 text-sm leading-7 text-brand-off-white/70">
              Você recusou esse time. O próximo ciclo de matchmaking vai te
              considerar com prioridade.
            </p>
            <button
              type="button"
              onClick={() => router.push("/requeue")}
              className="mt-5 inline-flex items-center justify-center rounded-xl bg-brand-emerald px-5 py-3 text-sm font-semibold text-brand-off-white transition-colors hover:bg-brand-emerald/90"
            >
              Voltar para a fila
            </button>
          </div>
        ) : (
          <>
            <p className="text-xs uppercase tracking-[0.18em] text-brand-emerald/82">
              Sua decisão
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
              Quer seguir com esse time?
            </h3>
            <p className="mt-3 text-sm leading-7 text-brand-off-white/72">
              Confirme se o perfil, a combinação de papéis e o momento fazem
              sentido para você. Se preferir tentar outro grupo, diga o porquê
              — isso ajuda a gente a encontrar times mais alinhados no futuro.
            </p>

            <div className="mt-5 space-y-3">
              <Button
                onClick={handleConfirm}
                disabled={busy !== null}
                variant="primary"
                size="lg"
                fullWidth
              >
                {busy === "confirm" ? "Confirmando..." : "Confirmar meu lugar"}
              </Button>

              {!showDeclineForm ? (
                <Button
                  onClick={() => setShowDeclineForm(true)}
                  disabled={busy !== null}
                  variant="accent"
                  fullWidth
                >
                  Prefiro tentar outro time
                </Button>
              ) : (
                <div className="rounded-[1.25rem] border border-brand-green/28 bg-brand-dark-green/60 p-4">
                  <label
                    htmlFor="decline-reason"
                    className="text-xs uppercase tracking-[0.18em] text-brand-off-white/54"
                  >
                    Motivo
                  </label>
                  <select
                    id="decline-reason"
                    value={reason}
                    onChange={(event) =>
                      setReason(event.target.value as DeclineReason)
                    }
                    className="mt-2 w-full rounded-lg border border-brand-green/30 bg-brand-dark-green/70 px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none"
                  >
                    {DECLINE_REASONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>

                  {reason === "other" && (
                    <textarea
                      value={reasonDetail}
                      onChange={(event) => setReasonDetail(event.target.value)}
                      placeholder="Conta rapidinho (opcional)"
                      maxLength={280}
                      rows={3}
                      className="mt-3 w-full rounded-lg border border-brand-green/30 bg-brand-dark-green/70 px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none"
                    />
                  )}

                  <div className="mt-4 flex flex-col gap-2 sm:flex-row">
                    <Button
                      onClick={handleDecline}
                      disabled={busy !== null}
                      variant="secondary"
                      fullWidth
                    >
                      {busy === "decline"
                        ? "Enviando..."
                        : "Recusar e voltar para a fila"}
                    </Button>
                    <Button
                      onClick={() => setShowDeclineForm(false)}
                      disabled={busy !== null}
                      variant="accent"
                      fullWidth
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {errorMessage && (
          <p className="mt-4 text-sm text-red-200">{errorMessage}</p>
        )}
      </Card>
    </div>
  );
}
