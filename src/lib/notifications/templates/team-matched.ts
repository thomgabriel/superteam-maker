import { escapeHtml } from '@/lib/security';
import {
  buildTeamUrl,
  renderLayout,
  type TemplateContext,
  type TemplateOutput,
} from './layout';
import type { TeamMatchedPayload } from '../types';

export function build(
  payload: TeamMatchedPayload,
  context?: TemplateContext,
): TemplateOutput {
  const safeTeamName = escapeHtml(payload.team_name);
  const ctaHref = context?.magicLink ?? buildTeamUrl(payload.team_id, context);

  const cleanName = payload.team_name.replace(/[\r\n]+/g, ' ').trim();

  return {
    subject: `Seu time está pronto no SuperteamMaker · ${cleanName}`,
    html: renderLayout({
      preheader: `Conheça ${cleanName} e combine os próximos passos.`,
      eyebrow: 'Time formado',
      heading: 'Seu time já está',
      headingAccent: 'pronto.',
      bodyHtml: `
        <p style="margin:0 0 16px;">
          O matchmaking encontrou pessoas com perfil complementar pro seu projeto.
          Abra a plataforma pra conhecer o grupo e dar o primeiro passo.
        </p>
        <div style="margin:18px 0; padding:18px 22px; border-radius:18px; border:1px solid rgba(255,210,63,0.22); background:rgba(255,210,63,0.08);">
          <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,210,63,0.82);">
            Seu time
          </div>
          <div style="margin-top:8px; font-family:Archivo, Inter, Arial, sans-serif; font-size:28px; line-height:1.1; color:#ffd23f; font-weight:700;">
            ${safeTeamName}
          </div>
        </div>
        <p style="margin:0;">
          Entre o quanto antes: times que conversam nas primeiras horas têm muito mais
          chance de chegar até a submissão.
        </p>
      `,
      ctaLabel: 'Abrir meu time',
      ctaHref,
    }),
  };
}
