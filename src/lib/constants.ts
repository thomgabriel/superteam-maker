export const SPECIFIC_ROLES = [
  'Desenvolvedor(a) de Software',
  'Cientista de Dados / IA',
  'Analista de Sistemas',
  'Designer de Produto',
  'Designer Visual / Brand',
  'Administrador(a)',
  'Advogado(a) / Direito',
  'Médico(a) / Saúde',
  'Economista / Finanças',
  'Marketing / Comunicação',
  'Product Manager',
  'Engenheiro(a)',
  'Arquiteto(a) / Urbanismo',
  'Professor(a) / Educação',
  'Outro',
] as const;

export type SpecificRole = typeof SPECIFIC_ROLES[number];

export const SECONDARY_ROLES = [
  'Desenvolvedor(a) de Software',
  'Cientista de Dados / IA',
  'Designer de Produto',
  'Designer Visual / Brand',
  'Product Manager',
  'Marketing / Growth',
  'Biz Dev',
  'Comunidade / Conteúdo',
  'Operações / Finanças',
] as const;

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
  business_gtm: 'Negócios & Domínio',
};
