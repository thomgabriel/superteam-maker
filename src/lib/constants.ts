export const SPECIFIC_ROLES = [
  'Software Engineer',
  'Backend Developer',
  'Frontend Developer',
  'Protocol Engineer',
  'AI / ML Engineer',
  'Data Scientist',
  'Game Developer',
  'Mobile Developer',
  'Systems Engineer',
  'Hardware Engineer',
  'Product Designer',
  'Visual Designer',
  'Biz Dev',
  'Community Manager',
  'Content Creator',
  'Finance & Ops',
  'Lawyer',
  'Marketer',
  'Product Manager',
] as const;

export type SpecificRole = typeof SPECIFIC_ROLES[number];

export const INTERESTS = [
  'DePIN',
  'DeFi',
  'Payments',
  'Gaming',
  'Social',
  'Developer Infrastructure',
  'Security Tools',
  'Community DAOs',
  'RWAs',
  'Consumer / Other',
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
  business_gtm: 'Negócios / GTM',
};
