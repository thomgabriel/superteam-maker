import type { MacroRole } from '@/types/database';

export const ROLE_TO_MACRO: Record<string, MacroRole> = {
  'Desenvolvimento de Software': 'engineering',
  'Dados / IA': 'engineering',
  'Design / UX': 'design',
  'Pesquisa / Validação': 'business_gtm',
  'Produto / Estratégia': 'business_gtm',
  'Pitch / Apresentação': 'business_gtm',
  'Marketing / Growth': 'business_gtm',
  'Negócios / Operações': 'business_gtm',
};

export function getMacroRole(specificRole: string): MacroRole {
  const macro = ROLE_TO_MACRO[specificRole];
  if (!macro) {
    throw new Error(`Unknown role: ${specificRole}`);
  }
  return macro;
}

export function getFlexMacroRoles(
  primaryRole: string,
  secondaryRoles: string[],
): MacroRole[] {
  const primaryMacro = ROLE_TO_MACRO[primaryRole];
  const flexMacros = new Set<MacroRole>();

  for (const role of secondaryRoles) {
    const macro = ROLE_TO_MACRO[role];
    if (macro && macro !== primaryMacro) {
      flexMacros.add(macro);
    }
  }

  return [...flexMacros];
}
