'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { forceAdvanceTeam, forceDissolveTeam } from '@/app/(app)/admin/actions';

interface TeamLifecycleControlsProps {
  teamId: string;
  teamName: string;
  status: string;
}

type ActionKind = 'advance' | 'dissolve';

export function TeamLifecycleControls({ teamId, teamName, status }: TeamLifecycleControlsProps) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [confirmKind, setConfirmKind] = useState<ActionKind | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [dissolveReason, setDissolveReason] = useState('manual_admin');

  const canAdvance = status === 'pending_confirmation' || status === 'forming' || status === 'pending_activation';
  const canDissolve = status !== 'inactive';

  function runAction(kind: ActionKind) {
    setMessage(null);
    startTransition(async () => {
      const result =
        kind === 'advance'
          ? await forceAdvanceTeam(teamId)
          : await forceDissolveTeam(teamId, dissolveReason);
      setMessage(result.message);
      setConfirmKind(null);
      if (result.success) {
        router.refresh();
      }
    });
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={!canAdvance || pending}
          onClick={() => setConfirmKind('advance')}
          className="rounded-full border border-brand-emerald/40 bg-brand-emerald/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-emerald transition-colors hover:border-brand-emerald hover:bg-brand-emerald/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Avançar time
        </button>
        <button
          type="button"
          disabled={!canDissolve || pending}
          onClick={() => setConfirmKind('dissolve')}
          className="rounded-full border border-brand-yellow/40 bg-brand-yellow/10 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-brand-yellow transition-colors hover:border-brand-yellow hover:bg-brand-yellow/20 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Dissolver time
        </button>
      </div>

      {message && (
        <p className="text-[11px] leading-5 text-brand-off-white/60">{message}</p>
      )}

      {confirmKind && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 px-4"
          onClick={() => (pending ? null : setConfirmKind(null))}
        >
          <div
            onClick={(event) => event.stopPropagation()}
            className="w-full max-w-md rounded-[1.5rem] border border-brand-green/24 bg-brand-dark-green/95 p-6 shadow-2xl"
          >
            <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow">
              {confirmKind === 'advance' ? 'Avançar time' : 'Dissolver time'}
            </p>
            <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
              {confirmKind === 'advance'
                ? 'Confirmar avanço manual?'
                : 'Confirmar dissolução manual?'}
            </h3>
            <p className="mt-3 text-sm leading-6 text-brand-off-white/70">
              {confirmKind === 'advance'
                ? `Isso vai mover o time "${teamName}" para pending_activation e abrir um novo prazo de 24h para a liderança ser reivindicada.`
                : `Isso vai mover o time "${teamName}" para inactive e marcar todos os membros ativos como replaced. A ação é irreversível sem SQL manual.`}
            </p>

            {confirmKind === 'dissolve' && (
              <label className="mt-5 block">
                <span className="text-[11px] uppercase tracking-[0.16em] text-brand-off-white/54">
                  Motivo
                </span>
                <select
                  value={dissolveReason}
                  onChange={(event) => setDissolveReason(event.target.value)}
                  className="mt-2 w-full rounded-lg border border-brand-green/24 bg-brand-dark-green/70 px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none"
                >
                  <option value="manual_admin">manual_admin</option>
                  <option value="confirmation_failed">confirmation_failed</option>
                  <option value="activation_timeout">activation_timeout</option>
                  <option value="understaffed_grace">understaffed_grace</option>
                </select>
              </label>
            )}

            <div className="mt-6 flex flex-wrap justify-end gap-2">
              <button
                type="button"
                disabled={pending}
                onClick={() => setConfirmKind(null)}
                className="rounded-full border border-brand-off-white/24 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-brand-off-white/70 transition-colors hover:border-brand-off-white hover:text-brand-off-white disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                disabled={pending}
                onClick={() => runAction(confirmKind)}
                className={`rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition-colors disabled:opacity-50 ${
                  confirmKind === 'advance'
                    ? 'border border-brand-emerald/40 bg-brand-emerald/20 text-brand-emerald hover:bg-brand-emerald/30'
                    : 'border border-brand-yellow/40 bg-brand-yellow/20 text-brand-yellow hover:bg-brand-yellow/30'
                }`}
              >
                {pending ? 'Executando…' : 'Confirmar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
