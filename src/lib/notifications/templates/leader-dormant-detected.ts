// In-app only — the bell UI renders from renderInAppMessage. Build still
// returns subject/html in case we later enable the email channel.

import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { LeaderDormantDetectedPayload } from '../types';

export function build(
  payload: LeaderDormantDetectedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const safeLeaderName = escapeHtml(payload.leader_name);
  const hoursSilent = Math.max(1, Math.round(payload.hours_silent));
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  return {
    subject: `Liderança ausente no ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()}`,
    html: renderLayout({
      eyebrow: 'Atenção',
      heading: 'Líder sumido.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          <strong style="color:#ffd23f;">${safeLeaderName}</strong> tá sem atividade há
          ${hoursSilent}h no <strong>${safeTeamName}</strong>. Se continuar, o time
          pode convocar uma nova liderança.
        </p>
        <p style="margin:0;">
          Vale dar um toque pelo WhatsApp antes de acionar a reconvocação.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
