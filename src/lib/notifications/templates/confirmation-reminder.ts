import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { ConfirmationReminderPayload } from '../types';

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
  payload: ConfirmationReminderPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  return {
    subject: `Falta confirmar seu lugar no ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()}`,
    html: renderLayout({
      preheader: 'Seu time precisa de você pra seguir adiante.',
      eyebrow: 'Ação pendente',
      heading: 'Confirma seu lugar?',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          O time <strong style="color:#ffd23f;">${safeTeamName}</strong> ainda tá esperando sua
          confirmação. Sem pelo menos 3 pessoas confirmadas, ele é desfeito automaticamente.
        </p>
        <p style="margin:0 0 16px;">
          Prazo limite: <strong>${escapeHtml(formatDeadline(payload.deadline_at))}</strong>.
        </p>
        <p style="margin:0;">
          Um clique resolve. Se preferir não participar desse time, pode recusar também
          — você volta pra fila com prioridade.
        </p>
      `,
      ctaLabel: 'Confirmar meu lugar',
      ctaHref,
    }),
  };
}
