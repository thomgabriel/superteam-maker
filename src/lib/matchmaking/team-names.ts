const ADJECTIVES = [
  'Ágil', 'Brilhante', 'Criativo', 'Dinâmico', 'Épico',
  'Forte', 'Genial', 'Hábil', 'Incrível', 'Jovem',
  'Lendário', 'Mágico', 'Nobre', 'Ousado', 'Poderoso',
  'Rápido', 'Sábio', 'Valente', 'Vivo', 'Zeloso',
];

const NOUNS = [
  'Dragões', 'Falcões', 'Lobos', 'Panteras', 'Tigres',
  'Águias', 'Leões', 'Tubarões', 'Corvos', 'Fênix',
  'Cometas', 'Vulcões', 'Raios', 'Trovões', 'Estrelas',
  'Pioneiros', 'Guardiões', 'Navegadores', 'Construtores', 'Inventores',
];

export function generateTeamName(): string {
  const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
  const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
  return `${adj} ${noun}`;
}
