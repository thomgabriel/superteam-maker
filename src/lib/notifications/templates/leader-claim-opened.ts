import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { LeaderClaimOpenedPayload } from '../types';

export function build(
  payload: LeaderClaimOpenedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  return {
    subject: `O time ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()} está pronto pra começar`,
    html: renderLayout({
      preheader: 'Alguém precisa puxar a liderança. Pode ser você.',
      eyebrow: 'Time confirmado',
      heading: 'Quem puxa a',
      headingAccent: 'liderança?',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Todo mundo confirmou presença no <strong style="color:#ffd23f;">${safeTeamName}</strong>.
          Agora falta só alguém dar o primeiro empurrão e assumir a liderança.
        </p>
        <p style="margin:0 0 16px;">
          O líder recebe um painel extra pra cadastrar ideia, link de WhatsApp e próximos passos.
          Não precisa ser o mais experiente — precisa querer organizar.
        </p>
        <p style="margin:0;">
          Se ninguém assumir em 24h, o time é desfeito e todo mundo volta pra fila.
        </p>
      `,
      ctaLabel: 'Assumir liderança',
      ctaHref,
    }),
  };
}
