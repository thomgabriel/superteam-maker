import { escapeHtml } from '@/lib/security';
import {
  buildPlatformUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { LeaderDemotedPayload } from '../types';

export function build(
  payload: LeaderDemotedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildPlatformUrl(context);

  return {
    subject: `A liderança do ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()} foi reaberta`,
    html: renderLayout({
      preheader: 'Seu time reabriu a liderança enquanto você estava longe.',
      eyebrow: 'Liderança reaberta',
      heading: 'Reabriram a',
      headingAccent: 'liderança.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Como seu perfil ficou sem atividade recente, os outros membros do
          <strong style="color:#ffd23f;">${safeTeamName}</strong> reabriram a
          liderança. O time voltou pra fase de claim por 24h.
        </p>
        <p style="margin:0 0 16px;">
          Se ainda quer liderar esse time, entra na plataforma rápido e clica em
          <strong>Assumir liderança</strong> antes que outra pessoa assuma.
        </p>
        <p style="margin:0;">
          Se preferir só acompanhar como membro, tá tudo certo — o time continua
          com você dentro.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
