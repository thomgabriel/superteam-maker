import { escapeHtml, sanitizeExternalUrl } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { LeaderClaimedPayload } from '../types';

export function build(
  payload: LeaderClaimedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const safeLeaderName = escapeHtml(payload.leader_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  const whatsappUrl = payload.whatsapp_url
    ? sanitizeExternalUrl(payload.whatsapp_url)
    : null;

  const whatsappSection = whatsappUrl
    ? `
      <div style="margin:18px 0; padding:16px 18px; border-radius:14px; border:1px solid rgba(0,139,76,0.22); background:rgba(0,139,76,0.08);">
        <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(245,232,202,0.6);">
          Grupo do time
        </div>
        <a href="${escapeHtml(whatsappUrl)}" style="display:inline-block; margin-top:8px; color:#ffd23f; text-decoration:underline; font-weight:600;">
          Entrar no WhatsApp
        </a>
      </div>
    `
    : '';

  return {
    subject: `${payload.leader_name.replace(/[\r\n]+/g, ' ').trim()} assumiu a liderança do ${payload.team_name.replace(/[\r\n]+/g, ' ').trim()}`,
    html: renderLayout({
      preheader: 'O time tá ativo. Hora de organizar os próximos passos.',
      eyebrow: 'Liderança definida',
      heading: 'Time ativo.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          <strong style="color:#ffd23f;">${safeLeaderName}</strong> assumiu a liderança do
          <strong>${safeTeamName}</strong>. Agora começa a parte boa: construir a ideia juntos.
        </p>
        ${whatsappSection}
        <p style="margin:0;">
          Abre a plataforma pra ver detalhes, marcar seu status como pronto e acompanhar o time.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
