import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { TeamUnderstaffedPayload } from '../types';

function formatDeadline(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) {
    return 'em breve';
  }
  return date.toLocaleString('pt-BR', {
    timeZone: 'America/Sao_Paulo',
    day: '2-digit',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function build(
  payload: TeamUnderstaffedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  return {
    subject: `Seu time está com ${payload.current_member_count} pessoas — hora de agir`,
    html: renderLayout({
      preheader: 'O time ficou pequeno. Temos 24h pra recompor.',
      eyebrow: 'Time incompleto',
      heading: 'Faltam pessoas',
      headingAccent: 'no time.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          O time <strong style="color:#ffd23f;">${safeTeamName}</strong> está com apenas
          <strong>${payload.current_member_count} ${
            payload.current_member_count === 1 ? 'pessoa ativa' : 'pessoas ativas'
          }</strong>. O sistema tem 24h pra encontrar alguém na fila.
        </p>
        <p style="margin:0 0 16px;">
          Prazo pra recompor: <strong>${escapeHtml(formatDeadline(payload.grace_deadline_at))}</strong>.
          Se não rolar, o time é desfeito e todo mundo volta pra fila.
        </p>
        <p style="margin:0;">
          O que ajuda agora: manter o time ativo na plataforma e reforçar pelo WhatsApp.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
