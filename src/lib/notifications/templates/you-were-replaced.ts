import { escapeHtml } from '@/lib/security';
import {
  buildPlatformUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { YouWereReplacedPayload } from '../types';

export function build(
  payload: YouWereReplacedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildPlatformUrl(context);

  return {
    subject: 'Seu lugar no time foi passado adiante',
    html: renderLayout({
      preheader: 'Sem drama — você volta pra fila com prioridade.',
      eyebrow: 'Atualização',
      heading: 'Você saiu do time.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          Como não rolou atividade sua no <strong style="color:#ffd23f;">${safeTeamName}</strong>
          nas primeiras 48h, o sistema passou seu lugar pra próxima pessoa da fila.
        </p>
        <p style="margin:0 0 16px;">
          É um fluxo normal — hackathon é rápido e os times precisam começar a se mexer logo.
          Se ainda quer participar, tá tudo certo: basta voltar pra fila.
        </p>
        <p style="margin:0;">
          Se foi intencional, ignora essa mensagem.
        </p>
      `,
      ctaLabel: 'Voltar pra fila',
      ctaHref,
    }),
  };
}
