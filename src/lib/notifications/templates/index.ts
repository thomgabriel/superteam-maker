// Registry of per-kind template builders.
// Each template exports `build(payload, context?) => { subject, html }`.

import type {
  NotificationEventPayload,
  NotificationKind,
  PayloadFor,
} from '../types';
import type { TemplateContext, TemplateOutput } from './layout';

import { build as buildTeamMatched } from './team-matched';
import { build as buildConfirmationReminder } from './confirmation-reminder';
import { build as buildLeaderClaimOpened } from './leader-claim-opened';
import { build as buildTeamDissolvedPreActivation } from './team-dissolved-pre-activation';
import { build as buildLeaderNeededReminder } from './leader-needed-reminder';
import { build as buildLeaderClaimed } from './leader-claimed';
import { build as buildTeamUnderstaffed } from './team-understaffed';
import { build as buildMemberReplaced } from './member-replaced';
import { build as buildYouWereReplaced } from './you-were-replaced';
import { build as buildTeamDeactivated } from './team-deactivated';
import { build as buildLeaderDormantDetected } from './leader-dormant-detected';
import { build as buildLeaderDemoted } from './leader-demoted';

type TemplateBuilder<K extends NotificationKind> = (
  payload: PayloadFor<K>,
  context?: TemplateContext,
) => TemplateOutput;

// Use a conditional mapped type so the registry is fully typed per kind.
type TemplateRegistry = {
  [K in NotificationKind]: TemplateBuilder<K>;
};

export const TEMPLATES: TemplateRegistry = {
  team_matched: buildTeamMatched,
  confirmation_reminder: buildConfirmationReminder,
  leader_claim_opened: buildLeaderClaimOpened,
  team_dissolved_pre_activation: buildTeamDissolvedPreActivation,
  leader_needed_reminder: buildLeaderNeededReminder,
  leader_claimed: buildLeaderClaimed,
  team_understaffed: buildTeamUnderstaffed,
  member_replaced: buildMemberReplaced,
  you_were_replaced: buildYouWereReplaced,
  team_deactivated: buildTeamDeactivated,
  leader_dormant_detected: buildLeaderDormantDetected,
  leader_demoted: buildLeaderDemoted,
};

export function renderTemplate(
  payload: NotificationEventPayload,
  context?: TemplateContext,
): TemplateOutput {
  // Dispatch via the discriminant. The `as` cast is safe because the registry
  // is keyed by the same union.
  const builder = TEMPLATES[payload.kind] as (
    p: NotificationEventPayload,
    c?: TemplateContext,
  ) => TemplateOutput;
  return builder(payload, context);
}

// In-app message extraction — pulls a short title + message from the same
// payload that drives email templates. Keeps the in-app bell minimal without
// parsing HTML.
export interface InAppMessage {
  title: string;
  message: string;
  href: string;
}

export function renderInAppMessage(
  payload: NotificationEventPayload,
  options?: { appUrl?: string },
): InAppMessage {
  const appUrl =
    options?.appUrl ??
    (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_APP_URL
      ? process.env.NEXT_PUBLIC_APP_URL
      : 'https://ideiadosonhos.com/');

  const teamHref = (id: string) => new URL(`/team/${id}`, appUrl).toString();
  const rootHref = new URL('/', appUrl).toString();

  switch (payload.kind) {
    case 'team_matched':
      return {
        title: 'Seu time está pronto',
        message: `${payload.team_name} acabou de ser formado.`,
        href: teamHref(payload.team_id),
      };
    case 'confirmation_reminder':
      return {
        title: 'Confirma seu lugar?',
        message: `O ${payload.team_name} precisa da sua confirmação.`,
        href: teamHref(payload.team_id),
      };
    case 'leader_claim_opened':
      return {
        title: 'Time confirmado',
        message: `Alguém precisa assumir a liderança do ${payload.team_name}.`,
        href: teamHref(payload.team_id),
      };
    case 'leader_needed_reminder':
      return {
        title: 'Liderança pendente',
        message: `${payload.team_name} ainda está sem líder.`,
        href: teamHref(payload.team_id),
      };
    case 'leader_claimed':
      return {
        title: 'Liderança definida',
        message: `${payload.leader_name} assumiu o ${payload.team_name}.`,
        href: teamHref(payload.team_id),
      };
    case 'team_understaffed':
      return {
        title: 'Time incompleto',
        message: `${payload.team_name} tem ${payload.current_member_count} pessoas. Recompor em 24h.`,
        href: teamHref(payload.team_id),
      };
    case 'leader_dormant_detected':
      return {
        title: 'Líder ausente',
        message: `${payload.leader_name} sem atividade há ${Math.round(payload.hours_silent)}h no ${payload.team_name}.`,
        href: teamHref(payload.team_id),
      };
    // The kinds below are email-only per KIND_CHANNELS, but we define fallbacks
    // defensively in case future config adds in_app for them.
    case 'team_dissolved_pre_activation':
      return {
        title: 'Time desfeito',
        message: `${payload.team_name} foi desfeito.`,
        href: rootHref,
      };
    case 'member_replaced':
      return {
        title: 'Novo integrante',
        message: `${payload.replacement_name} entrou no ${payload.team_name}.`,
        href: teamHref(payload.team_id),
      };
    case 'you_were_replaced':
      return {
        title: 'Você saiu do time',
        message: `Seu lugar no ${payload.team_name} foi passado adiante.`,
        href: rootHref,
      };
    case 'team_deactivated':
      return {
        title: 'Time desativado',
        message: `${payload.team_name} foi desativado.`,
        href: rootHref,
      };
    case 'leader_demoted':
      return {
        title: 'Liderança reaberta',
        message: `O ${payload.team_name} reabriu a liderança enquanto você estava longe.`,
        href: teamHref(payload.team_id),
      };
    default: {
      // Exhaustiveness check — adding a new kind without updating this switch
      // surfaces as a type error.
      const _exhaustive: never = payload;
      void _exhaustive;
      return { title: 'Notificação', message: '', href: rootHref };
    }
  }
}

export type { TemplateContext, TemplateOutput } from './layout';
