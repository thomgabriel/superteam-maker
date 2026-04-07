import type { MacroRole } from '@/types/database';

export const ROLE_TO_MACRO: Record<string, MacroRole> = {
  'Desenvolvedor(a) de Software': 'engineering',
  'Cientista de Dados / IA': 'engineering',
  'Analista de Sistemas': 'engineering',
  'Designer de Produto': 'design',
  'Designer Visual / Brand': 'design',
  'Administrador(a)': 'business_gtm',
  'Advogado(a) / Direito': 'business_gtm',
  'Médico(a) / Saúde': 'business_gtm',
  'Economista / Finanças': 'business_gtm',
  'Marketing / Comunicação': 'business_gtm',
  'Product Manager': 'business_gtm',
  'Engenheiro(a)': 'business_gtm',
  'Arquiteto(a) / Urbanismo': 'business_gtm',
  'Professor(a) / Educação': 'business_gtm',
  'Outro': 'business_gtm',
  // Secondary-only roles
  'Marketing / Growth': 'business_gtm',
  'Biz Dev': 'business_gtm',
  'Comunidade / Conteúdo': 'business_gtm',
  'Operações / Finanças': 'business_gtm',
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
