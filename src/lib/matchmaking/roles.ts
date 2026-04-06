import type { MacroRole } from '@/types/database';

export const ROLE_TO_MACRO: Record<string, MacroRole> = {
  'Software Engineer': 'engineering',
  'Backend Developer': 'engineering',
  'Frontend Developer': 'engineering',
  'Protocol Engineer': 'engineering',
  'AI / ML Engineer': 'engineering',
  'Data Scientist': 'engineering',
  'Game Developer': 'engineering',
  'Mobile Developer': 'engineering',
  'Systems Engineer': 'engineering',
  'Hardware Engineer': 'engineering',
  'Product Designer': 'design',
  'Visual Designer': 'design',
  'Biz Dev': 'business_gtm',
  'Community Manager': 'business_gtm',
  'Content Creator': 'business_gtm',
  'Finance & Ops': 'business_gtm',
  'Lawyer': 'business_gtm',
  'Marketer': 'business_gtm',
  'Product Manager': 'business_gtm',
};

export function getMacroRole(specificRole: string): MacroRole {
  const macro = ROLE_TO_MACRO[specificRole];
  if (!macro) {
    throw new Error(`Unknown role: ${specificRole}`);
  }
  return macro;
}
