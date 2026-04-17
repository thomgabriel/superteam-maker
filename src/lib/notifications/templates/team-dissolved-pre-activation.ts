import { escapeHtml } from '@/lib/security';
import {
  buildPlatformUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { TeamDissolvedPreActivationPayload } from '../types';

const REASON_COPY: Record<
  TeamDissolvedPreActivationPayload['reason'],
  string
> = {
  confirmation_failed: 'nem todo mundo confirmou presença a tempo',
  activation_timeout: 'a janela de ativação expirou',
  understaffed_grace: 'o time ficou pequeno e não recuperou a tempo',
  manual_admin: 'a organização precisou desfazer o time manualmente',
};

export function build(
  payload: TeamDissolvedPreActivationPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const reasonText = REASON_COPY[payload.reason] ?? 'o time não conseguiu avançar';
  const ctaHref = context?.magicLink ?? buildPlatformUrl(context);

  return {
    subject: `O time ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()} foi desfeito`,
    html: renderLayout({
      preheader: 'Você volta pra fila com prioridade.',
      eyebrow: 'Time desfeito',
      heading: 'Não rolou dessa vez.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          O time <strong style="color:#ffd23f;">${safeTeamName}</strong> foi desfeito
          porque ${escapeHtml(reasonText)}.
        </p>
        <p style="margin:0 0 16px;">
          Tudo certo — você volta pra fila com prioridade. O próximo ciclo de matchmaking
          já considera seu perfil primeiro.
        </p>
        <p style="margin:0;">
          Enquanto aguarda, vale a pena revisar seu perfil e as ideias disponíveis.
        </p>
      `,
      ctaLabel: 'Voltar pra plataforma',
      ctaHref,
    }),
  };
}
