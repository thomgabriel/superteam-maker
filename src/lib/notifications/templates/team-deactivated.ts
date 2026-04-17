import { escapeHtml } from '@/lib/security';
import {
  buildPlatformUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { TeamDeactivatedPayload } from '../types';

const REASON_COPY: Record<TeamDeactivatedPayload['reason'], string> = {
  confirmation_failed: 'não teve confirmações suficientes a tempo',
  activation_timeout: 'ninguém assumiu a liderança dentro do prazo',
  understaffed_grace: 'ficou pequeno demais e o sistema não conseguiu completar',
  manual_admin: 'foi desativado pela organização',
};

export function build(
  payload: TeamDeactivatedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const reasonText = REASON_COPY[payload.reason] ?? 'não conseguiu manter atividade';
  const ctaHref = context?.magicLink ?? buildPlatformUrl(context);

  return {
    subject: `O time ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()} foi desativado`,
    html: renderLayout({
      preheader: 'O ciclo acabou. Você volta pra fila.',
      eyebrow: 'Time desativado',
      heading: 'Fim do ciclo.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          O time <strong style="color:#ffd23f;">${safeTeamName}</strong> foi desativado
          porque ${escapeHtml(reasonText)}.
        </p>
        <p style="margin:0 0 16px;">
          Você volta pra fila automaticamente — o próximo ciclo de matchmaking vai
          considerar seu perfil.
        </p>
        <p style="margin:0;">
          Vale revisar seu perfil: quanto mais completo, maior a chance de cair em
          um time que engata.
        </p>
      `,
      ctaLabel: 'Abrir plataforma',
      ctaHref,
    }),
  };
}
