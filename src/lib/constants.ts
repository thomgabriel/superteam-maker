export const SPECIFIC_ROLES = [
  'Desenvolvimento de Software',
  'Dados / IA',
  'Design / UX',
  'Pesquisa / Validação',
  'Produto / Estratégia',
  'Pitch / Apresentação',
  'Marketing / Growth',
  'Negócios / Operações',
] as const;

export type SpecificRole = typeof SPECIFIC_ROLES[number];

export const INTERESTS = [
  'DePIN',
  'DeFi',
  'Pagamentos',
  'Gaming',
  'Social',
  'Infraestrutura Dev',
  'Segurança',
  'DAOs / Comunidades',
  'RWAs',
  'Consumer / Outros',
] as const;

export type Interest = typeof INTERESTS[number];

export const SENIORITY_LABELS: Record<string, string> = {
  beginner: 'Iniciante',
  junior: 'Júnior',
  mid: 'Pleno',
  senior: 'Sênior',
};

export const MACRO_ROLE_LABELS: Record<string, string> = {
  engineering: 'Engenharia',
  design: 'Design',
  business_gtm: 'Negócios & Estratégia',
};
