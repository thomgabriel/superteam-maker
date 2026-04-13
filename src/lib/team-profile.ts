import { INTERESTS } from '@/lib/constants';

export const TEAM_NAME_MAX_LENGTH = 80;
export const TEAM_TITLE_MAX_LENGTH = 120;
export const TEAM_DESCRIPTION_MAX_LENGTH = 1200;

type TeamProfileFieldResult =
  | {
      ok: true;
      updates: {
        name?: string;
        idea_title?: string | null;
        idea_description?: string | null;
        project_category?: string | null;
        whatsapp_group_url?: string | null;
      };
    }
  | {
      ok: false;
      message: string;
    };

function trimString(value: unknown): string | undefined {
  return typeof value === 'string' ? value.trim() : undefined;
}

function normalizeOptionalString(value: unknown): string | null | undefined {
  const trimmed = trimString(value);
  if (trimmed === undefined) {
    return undefined;
  }

  return trimmed.length > 0 ? trimmed : null;
}

export function sanitizeTeamProfileUpdate(
  input: Record<string, unknown>,
): TeamProfileFieldResult {
  const updates: {
    name?: string;
    idea_title?: string | null;
    idea_description?: string | null;
    project_category?: string | null;
    whatsapp_group_url?: string | null;
  } = {};

  const name = trimString(input.name);
  if (name !== undefined) {
    if (name.length === 0) {
      return { ok: false, message: 'O nome do time não pode ficar vazio.' };
    }
    if (name.length > TEAM_NAME_MAX_LENGTH) {
      return {
        ok: false,
        message: `O nome do time pode ter no máximo ${TEAM_NAME_MAX_LENGTH} caracteres.`,
      };
    }
    updates.name = name;
  }

  const ideaTitle = normalizeOptionalString(input.idea_title);
  if (ideaTitle !== undefined) {
    if (ideaTitle && ideaTitle.length > TEAM_TITLE_MAX_LENGTH) {
      return {
        ok: false,
        message: `O título da ideia pode ter no máximo ${TEAM_TITLE_MAX_LENGTH} caracteres.`,
      };
    }
    updates.idea_title = ideaTitle;
  }

  const ideaDescription = normalizeOptionalString(input.idea_description);
  if (ideaDescription !== undefined) {
    if (ideaDescription && ideaDescription.length > TEAM_DESCRIPTION_MAX_LENGTH) {
      return {
        ok: false,
        message: `A descrição pode ter no máximo ${TEAM_DESCRIPTION_MAX_LENGTH} caracteres.`,
      };
    }
    updates.idea_description = ideaDescription;
  }

  const projectCategory = normalizeOptionalString(input.project_category);
  if (projectCategory !== undefined) {
    if (projectCategory && !(INTERESTS as readonly string[]).includes(projectCategory)) {
      return {
        ok: false,
        message: 'Selecione uma categoria válida.',
      };
    }
    updates.project_category = projectCategory;
  }

  const whatsappGroupUrl = normalizeOptionalString(input.whatsapp_group_url);
  if (whatsappGroupUrl !== undefined) {
    if (whatsappGroupUrl) {
      if (whatsappGroupUrl.length > 200) {
        return { ok: false, message: 'Link do WhatsApp muito longo.' };
      }
      try {
        const parsed = new URL(whatsappGroupUrl);
        if (parsed.protocol !== 'https:' || parsed.hostname !== 'chat.whatsapp.com' || parsed.pathname.length <= 1 || parsed.search || parsed.hash) {
          return { ok: false, message: 'Use um link válido de grupo do WhatsApp (https://chat.whatsapp.com/...).' };
        }
        updates.whatsapp_group_url = parsed.toString();
      } catch {
        return { ok: false, message: 'Use um link válido de grupo do WhatsApp (https://chat.whatsapp.com/...).' };
      }
    } else {
      updates.whatsapp_group_url = null;
    }
  }

  return { ok: true, updates };
}
