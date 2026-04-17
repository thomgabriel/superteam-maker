// Shared HTML layout for transactional emails.
// Uses the Superteam Brasil palette (dark green, emerald, yellow, off-white).
// Inline styles only — most email clients strip <style> tags.

import { escapeHtml, sanitizeExternalUrl } from '@/lib/security';

export interface LayoutInput {
  preheader?: string; // Hidden inbox preview
  eyebrow?: string; // Small uppercase tag above the H1
  heading: string; // Main H1. Can include <span> for yellow accent.
  headingAccent?: string; // Optional second line rendered in yellow
  bodyHtml: string; // Pre-escaped HTML (use escapeHtml on dynamic text)
  ctaLabel: string;
  ctaHref: string;
  footerNote?: string;
  unsubscribeHref?: string;
}

function resolveAppUrl(): string {
  return (
    sanitizeExternalUrl(process.env.NEXT_PUBLIC_APP_URL) ??
    'https://ideiadosonhos.com/'
  );
}

export function buildUnsubscribeUrl(): string {
  const base = resolveAppUrl();
  return new URL('/settings/notificacoes', base).toString();
}

export function renderLayout(input: LayoutInput): string {
  const appUrl = resolveAppUrl();
  const cta = sanitizeExternalUrl(input.ctaHref) ?? appUrl;
  const unsubscribe = sanitizeExternalUrl(
    input.unsubscribeHref ?? buildUnsubscribeUrl(),
  ) ?? buildUnsubscribeUrl();

  const preheader = input.preheader
    ? `<div style="display:none; max-height:0; overflow:hidden; opacity:0; color:transparent;">${escapeHtml(input.preheader)}</div>`
    : '';

  const eyebrow = input.eyebrow
    ? `<div style="display:inline-block; padding:8px 14px; border-radius:999px; border:1px solid rgba(255,210,63,0.28); background:rgba(255,210,63,0.08); color:#ffd23f; font-size:11px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase;">${escapeHtml(input.eyebrow)}</div>`
    : '';

  const accentLine = input.headingAccent
    ? `<span style="display:block; color:#ffd23f;">${escapeHtml(input.headingAccent)}</span>`
    : '';

  const footer = input.footerNote
    ? `<div style="margin-top:24px; font-size:12px; line-height:1.7; color:rgba(245,232,202,0.46);">${escapeHtml(input.footerNote)}</div>`
    : '';

  return `
    <div style="margin:0; padding:32px 16px; background:#121914; font-family:Inter, Arial, sans-serif; color:#f5e8ca;">
      ${preheader}
      <div style="max-width:560px; margin:0 auto; border:1px solid rgba(0,139,76,0.24); border-radius:28px; overflow:hidden; background:linear-gradient(180deg,#1b231d 0%,#162018 100%);">
        <div style="padding:32px 32px 20px; background:radial-gradient(circle at top, rgba(255,210,63,0.14), transparent 42%), radial-gradient(circle at 20% 20%, rgba(0,139,76,0.18), transparent 28%), linear-gradient(180deg, #1b231d 0%, #162018 100%);">
          ${eyebrow}
          <h1 style="margin:20px 0 0; font-family:Archivo, Inter, Arial, sans-serif; font-size:42px; line-height:1.02; letter-spacing:-0.04em; color:#f5e8ca;">
            ${escapeHtml(input.heading)}
            ${accentLine}
          </h1>
        </div>

        <div style="padding:0 32px 32px;">
          <div style="margin-top:12px; font-size:16px; line-height:1.7; color:rgba(245,232,202,0.82);">
            ${input.bodyHtml}
          </div>

          <div style="margin-top:26px;">
            <a href="${escapeHtml(cta)}"
               style="display:inline-block; padding:15px 24px; border-radius:12px; background:#008b4c; color:#f5e8ca; text-decoration:none; font-family:Archivo, Inter, Arial, sans-serif; font-size:16px; font-weight:700;">
              ${escapeHtml(input.ctaLabel)}
            </a>
          </div>

          ${footer}

          <div style="margin-top:28px; padding-top:18px; border-top:1px solid rgba(245,232,202,0.08); font-size:11px; line-height:1.7; color:rgba(245,232,202,0.42);">
            Superteam Brasil · SuperteamMaker
            <br />
            Você está recebendo esse email porque tem uma conta ativa.
            <a href="${escapeHtml(unsubscribe)}" style="color:#ffd23f; text-decoration:underline;">
              Gerenciar notificações
            </a>
          </div>
        </div>
      </div>
    </div>
  `;
}

export interface TemplateOutput {
  subject: string;
  html: string;
}

export interface TemplateContext {
  magicLink?: string | null;
  // Base URL override (for tests); defaults to NEXT_PUBLIC_APP_URL.
  appUrl?: string;
}

export function buildTeamUrl(teamId: string, context?: TemplateContext): string {
  const base = context?.appUrl ?? resolveAppUrl();
  return new URL(`/team/${teamId}`, base).toString();
}

export function buildPlatformUrl(context?: TemplateContext): string {
  return context?.appUrl ?? resolveAppUrl();
}
