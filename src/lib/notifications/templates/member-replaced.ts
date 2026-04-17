import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { MemberReplacedPayload } from '../types';

export function build(
  payload: MemberReplacedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const safeReplacementName = escapeHtml(payload.replacement_name);
  const safeReplacementRole = escapeHtml(payload.replacement_role);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  return {
    subject: `Novo integrante no ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()}`,
    html: renderLayout({
      preheader: `${payload.replacement_name} entrou no lugar de quem saiu.`,
      eyebrow: 'Time atualizado',
      heading: 'Novo reforço',
      headingAccent: 'no time.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          <strong style="color:#ffd23f;">${safeReplacementName}</strong>
          (${safeReplacementRole}) acabou de entrar no
          <strong>${safeTeamName}</strong>.
        </p>
        <p style="margin:0 0 16px;">
          Aproveita pra apresentar o projeto e alinhar o estado atual — isso faz
          diferença enorme no engajamento dos primeiros dias.
        </p>
        <p style="margin:0;">
          Se tem grupo de WhatsApp, não esquece de adicionar.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
