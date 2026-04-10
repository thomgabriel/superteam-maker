// --- FAQ ---

export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "O que é o Frontier Hackathon?",
    answer:
      "É a edição atual do Colosseum, o maior hackathon global da Solana. Roda 100% online, dura cerca de 5 semanas e qualquer pessoa pode participar de qualquer lugar. São mais de $260K em prêmios diretos, além de cheques de $250K em aceleração pré-seed.",
  },
  {
    question: "Quando começa e quando acaba?",
    answer:
      "Já começou. Prazo final de submissão: 11 de maio.",
  },
  {
    question: "Preciso pagar pra participar?",
    answer: "Não. É 100% gratuito.",
  },
  {
    question: "Preciso já saber Solana ou Rust?",
    answer:
      "Não. Você pode usar qualquer linguagem de programação. Tem gente entrando sabendo só JavaScript e construindo projeto vencedor. A Wiki da Superteam tem tudo pra você começar do zero.",
  },
  {
    question: "Posso participar sozinho?",
    answer:
      "Pode, mas a maioria dos vencedores tem time de 2 a 4 pessoas. Use o SuperteamMaker pra encontrar parceiros.",
  },
  {
    question: "Tem categorias ou tracks?",
    answer:
      "Não. Tudo é julgado junto. Constrói o que quiser, do jeito que quiser, e seu projeto compete contra todos os outros de igual pra igual.",
  },
  {
    question: "Como funciona a Trilha Brasil?",
    answer:
      "É uma trilha exclusiva pra times brasileiros, com R$50.000 em prêmios. Pra concorrer: inscreva-se no hackathon global, marque Brasil como país do time e inscreva o mesmo projeto na Superteam Earn. Pronto, você concorre nas duas trilhas.",
  },
  {
    question: "O que é a aceleração do Colosseum?",
    answer:
      "Os melhores times recebem convite pra entrevista. Pelo menos 10 equipes são selecionadas e cada uma recebe $250K em capital pré-seed, 2 semanas de residência em San Francisco, mentoria 1:1 e acesso a investidores.",
  },
  {
    question: "Posso usar código que já escrevi antes?",
    answer:
      "Pode, mas só o trabalho feito entre o início e o fim do hackathon vai ser julgado. Você precisa declarar o que já existia.",
  },
  {
    question: "Como o projeto é avaliado?",
    answer:
      "6 critérios: Founder + Market Fit, Insight único sobre o problema, Produto e velocidade de execução, Tamanho do mercado, Comunicação dos fundadores e Viabilidade do negócio. Trate sua submissão como pitch pra investidor.",
  },
  {
    question: "Vai ter mentoria?",
    answer:
      "Sim. Workshops, office hours e mentoria com builders brasileiros que já passaram pelo Colosseum. Tudo anunciado no Discord da Superteam Brasil.",
  },
  {
    question: "Qual a dica número 1 de quem já ganhou?",
    answer:
      "Submete antes do prazo final. Não deixa pro último dia. O time que entrega com 1 semana de folga, polido, sempre se sai melhor que o time que entrega às 23h59.",
  },
];

// --- Resources ---

export interface ResourceLink {
  title: string;
  description: string;
  url: string;
}

export interface ResourceGroup {
  title: string;
  links: ResourceLink[];
}

export const RESOURCE_GROUPS: ResourceGroup[] = [
  {
    title: "Inscrição e Submissão",
    links: [
      {
        title: "Inscrição no Colosseum",
        description: "Crie sua conta e inscreva seu projeto no hackathon global.",
        url: "https://arena.colosseum.org?ref=criptosonhos",
      },
      {
        title: "Trilha Brasil ($10K)",
        description: "Inscreva o mesmo projeto na Superteam Earn pra concorrer à trilha BR.",
        url: "https://superteam.fun/earn/listing/hackathon-superteambrasil",
      },
      {
        title: "Site oficial do Frontier",
        description: "Informações gerais, regras e cronograma.",
        url: "https://hackathonsolana.com",
      },
    ],
  },
  {
    title: "Como Construir",
    links: [
      {
        title: "Wiki Superteam Brasil",
        description: "130+ recursos curados: frameworks, protocolos, padrões e ferramentas.",
        url: "https://wiki.superteam.com.br",
      },
      {
        title: "Ideias do que construir",
        description: "Lista de ideias e oportunidades pra inspirar seu projeto.",
        url: "https://build.superteam.fun",
      },
      {
        title: "FAQ oficial do Colosseum",
        description: "Perguntas frequentes direto da organização do hackathon.",
        url: "https://www.colosseum.com/faq",
      },
    ],
  },
  {
    title: "Vibe Coding — Construindo com IA",
    links: [
      {
        title: "Colosseum Copilot",
        description: "Copiloto oficial do Colosseum. Tira dúvidas sobre regras, critérios e boas práticas.",
        url: "https://colosseum.com/copilot",
      },
      {
        title: "Solana Skills (oficial)",
        description: "Skills oficiais da Solana Foundation pro Claude. Seu Claude vira um dev Solana sênior.",
        url: "https://solana.com/skills",
      },
      {
        title: "solana-claude (Superteam Brasil)",
        description: "15 agentes especializados, 24+ comandos slash e 6 servidores MCP integrados.",
        url: "https://github.com/solanabr/solana-claude",
      },
      {
        title: "Noah AI",
        description: "No-code builder pra Solana. Prototipe uma ideia em minutos.",
        url: "https://trynoah.ai",
      },
      {
        title: "Frames Tools",
        description: "Ferramentas de dev construídas pela Frames, equipe BR acelerada pelo Colosseum.",
        url: "https://frames.ag/tools",
      },
      {
        title: "Nansen CLI",
        description: "CLI da Nansen pra agentes de IA acessarem dados on-chain em tempo real.",
        url: "https://github.com/nansen-ai/nansen-cli",
      },
    ],
  },
  {
    title: "Comunidade",
    links: [
      {
        title: "Discord Superteam Brasil",
        description: "Chat principal. Tire dúvidas, encontre parceiros, acompanhe anúncios.",
        url: "https://discord.gg/superteambrasil",
      },
      {
        title: "Twitter / X",
        description: "Acompanhe novidades e anúncios da Superteam Brasil.",
        url: "https://x.com/SuperteamBR",
      },
      {
        title: "Instagram",
        description: "Conteúdo visual e bastidores.",
        url: "https://instagram.com/superteam.brasil",
      },
      {
        title: "YouTube",
        description: "Lives, workshops e aulas gravadas.",
        url: "https://youtube.com/@superteambrasil",
      },
      {
        title: "Eventos (Luma)",
        description: "Todos os eventos presenciais e online da Superteam Brasil.",
        url: "https://lu.ma/superteambrasil",
      },
    ],
  },
];

// --- Lessons ---

export interface Lesson {
  title: string;
  description: string;
  videoUrl: string;
  resources?: { label: string; url: string }[];
}

export interface LessonGroup {
  title: string;
  lessons: Lesson[];
}

export const LESSON_GROUPS: LessonGroup[] = [
  {
    title: "Comece por aqui",
    lessons: [
      {
        title: "Kickoff do Hackathon",
        description: "A live de abertura do Frontier. Visão geral do que tá em jogo e como participar.",
        videoUrl: "https://www.youtube.com/watch?v=jtDaBF9n9DE",
      },
      {
        title: "Temas em alta na Solana",
        description: "O que tá quente no ecossistema agora. Use pra pegar ideia do que construir.",
        videoUrl: "https://www.youtube.com/watch?v=cLJXzk0O-I4",
      },
    ],
  },
  {
    title: "Ideação e Negócios",
    lessons: [
      {
        title: "Design Thinking — com Miro Leite",
        description: "Como sair do 'tenho uma ideia' pra 'tenho um problema validado'.",
        videoUrl: "https://www.youtube.com/watch?v=qUooCBvhPeg",
        resources: [
          { label: "Board do Miro", url: "https://miro.com/app/board/uXjVGsYQ3KE=/?share_link_id=375809757541" },
        ],
      },
      {
        title: "Pitch Deck — com Estêvão Rizzo",
        description: "Como montar o deck que vai te colocar na peneira do acelerador.",
        videoUrl: "https://www.youtube.com/watch?v=b2U2xJ39PcA",
        resources: [
          { label: "Slides da aula", url: "https://drive.google.com/file/d/1H7Tge03k_Xhr70nr8Ny-A8KE0DXxYvIH/view?usp=sharing" },
          { label: "Template Pitch Deck", url: "https://docs.google.com/presentation/d/1E0zR4oUtIwRYbpg6-rLQmMWokY0lgD2bMtim9duPxHc/edit?usp=drivesdk" },
          { label: "Checklist do Pitch", url: "https://docs.google.com/document/d/1o9aovrdWyQ0JG0miG01-FLOtCGa8ilFxi4d7082IaW4/edit?usp=drivesdk" },
          { label: "Business Model Canvas", url: "https://drive.google.com/file/d/1MokRgWOP6JtU9idF8NpnyVD9FM8Wz00h/view?usp=sharing" },
        ],
      },
    ],
  },
  {
    title: "Vibe Coding",
    lessons: [
      {
        title: "Construindo na Solana com NoahAI",
        description: "Como acelerar seu desenvolvimento usando AI.",
        videoUrl: "https://www.youtube.com/watch?v=mhRcS_lPt1U",
      },
    ],
  },
  {
    title: "Bootcamp Técnico — Do Zero a Dev na Solana",
    lessons: [
      {
        title: "Aula 1 — Fundamentos",
        description: "Introdução à Solana, conceitos básicos e primeiro contato com o ecossistema.",
        videoUrl: "https://www.youtube.com/watch?v=GMPZjY3fYH8",
      },
      {
        title: "Aula 2 — Aprofundando",
        description: "Programas, contas, transações e como tudo se conecta.",
        videoUrl: "https://www.youtube.com/watch?v=4fZnrHoITgY",
      },
      {
        title: "Aula 3 — Construindo",
        description: "Colocando a mão no código e construindo seu primeiro programa.",
        videoUrl: "https://www.youtube.com/watch?v=G-eNbaPXgE0",
      },
    ],
  },
];

// --- Brazilian Success Stories ---

export interface SuccessStory {
  name: string;
  achievement: string;
  description: string;
  url: string;
}

export const SUCCESS_STORIES: SuccessStory[] = [
  {
    name: "Frames",
    achievement: "1º lugar Stablecoins — Acelerada pelo Colosseum",
    description: "Equipe brasileira que ganhou o primeiro lugar na track de Stablecoins e recebeu $250K em aceleração.",
    url: "https://x.com/frames_xyz",
  },
  {
    name: "Cloak",
    achievement: "3º lugar geral — Acelerada pelo Colosseum",
    description: "Privacidade onchain. Chegou no top 3 global e recebeu aceleração com $250K pré-seed.",
    url: "https://www.cloaklabz.xyz",
  },
  {
    name: "BlindPay",
    achievement: "Y Combinator — +$1Bi em volume",
    description: "Infraestrutura de pagamentos cripto. Brasileiros que passaram pela YC e ultrapassaram $1 bilhão em volume.",
    url: "https://blindpay.com",
  },
  {
    name: "Credit Markets",
    achievement: "Menção honrosa RWA — Infra de crédito DeFi",
    description: "Ex-VitalFi. Construindo infraestrutura de crédito descentralizado pra mercados emergentes.",
    url: "https://vitalfi.lat",
  },
  {
    name: "Triad Markets",
    achievement: "Menção honrosa — Levantou rounds em USD",
    description: "Mercado de derivativos. Recebeu menção honrosa e levantou capital institucional.",
    url: "https://triadfi.co",
  },
];
