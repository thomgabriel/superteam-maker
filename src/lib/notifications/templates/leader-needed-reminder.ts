import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { LeaderNeededReminderPayload } from '../types';

export function build(
  payload: LeaderNeededReminderPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);
  const hoursRemaining = Math.max(0, Math.round(payload.hours_remaining));
  const hoursText = hoursRemaining === 1 ? '1 hora' : `${hoursRemaining} horas`;

  return {
    subject: `Faltam ${hoursText} pro ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()} ter líder`,
    html: renderLayout({
      preheader: 'Sem liderança, o time não ativa.',
      eyebrow: 'Lembrete',
      heading: 'Ninguém assumiu',
      headingAccent: 'ainda.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Seu time <strong style="color:#ffd23f;">${safeTeamName}</strong> tá esperando
          liderança. Faltam <strong>${escapeHtml(hoursText)}</strong> antes de ser desfeito.
        </p>
        <p style="margin:0 0 16px;">
          Se ninguém puxa, todo mundo perde. Pode ser você — não precisa de experiência,
          precisa só querer organizar o grupo.
        </p>
        <p style="margin:0;">
          Ou combine com alguém do time pra assumir. Um clique resolve.
        </p>
      `,
      ctaLabel: 'Assumir liderança agora',
      ctaHref,
    }),
  };
}
