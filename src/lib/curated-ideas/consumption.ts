import type { CuratedIdea } from "./types";

export const CONSUMPTION_IDEAS: CuratedIdea[] = [
  {
    "id": "idea-011",
    "category": "Consumo",
    "title": "Passaporte de eventos para comunidades brasileiras",
    "description": "Um perfil público que registra presença em eventos, workshops e meetups de uma comunidade.",
    "details": "O time pode criar check-in por QR code, página de perfil e badges por participação. A versão inicial pode usar NFTs ou registros simples para provar presença sem parecer um produto cripto complicado.",
    "tags": [
      "Eventos",
      "Comunidade",
      "Reputação"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O time pode criar check-in por QR code, página de perfil e badges por participação. A versão inicial pode usar NFTs ou registros simples para provar presença sem parecer um produto cripto complicado.",
    "judgeHook": "E facil mostrar um perfil público que registra presença em eventos, workshops e meetups de uma comunidade. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-012",
    "category": "Consumo",
    "title": "Cartão de reputação para contribuidores",
    "description": "Um perfil verificável que reúne entregas, skills e contribuições reais feitas em comunidades, freelas e hackathons.",
    "details": "O MVP pode permitir adicionar projetos, links, provas da entrega e recomendações de colegas. A parte onchain entra para registrar badges ou credenciais das contribuições mais importantes, enquanto a interface continua parecendo um portfólio simples.",
    "tags": [
      "Reputação",
      "Comunidade",
      "Portfólio"
    ],
    "targetUser": "Pessoas em início de carreira, builders independentes e creators que já fizeram trabalho real, mas não conseguem provar isso num currículo tradicional.",
    "painPoint": "Muito trabalho bom fica perdido em PR, Figma, Discord, Notion e demo day, então a pessoa parece júnior demais no papel mesmo quando já entregou de verdade.",
    "cryptoAngle": "Badges e registros verificáveis transformam contribuição em prova portátil, sem depender só de texto autodeclarado no LinkedIn.",
    "mvpScope": "Formulário para adicionar projeto, papel da pessoa, links, prova da entrega e recomendação de colegas. A camada onchain pode emitir badges só para as contribuições mais importantes.",
    "judgeHook": "O jurado vê um participante colando links soltos e saindo com um cartão de reputação bonito, verificável e pronto para compartilhar depois do hackathon.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Fica forte quando a demo usa uma pessoa real com histórico espalhado e mostra como o produto organiza prova de trabalho em minutos.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-013",
    "category": "Consumo",
    "title": "Clube de benefícios para holders de comunidade",
    "description": "Uma página onde membros com um token ou NFT acessam descontos, eventos e conteúdos exclusivos.",
    "details": "Comece com verificação de carteira, lista de benefícios e painel simples para o organizador cadastrar parceiros. Pode funcionar para comunidades locais, criadores, atléticas ou coletivos de tecnologia.",
    "tags": [
      "Comunidade",
      "Token-gating",
      "Brasil"
    ],
    "targetUser": "Comunidades, creators e clubes que querem oferecer benefícios exclusivos sem depender de planilha manual de membros.",
    "painPoint": "Quem organiza vantagens para membros vive conciliando lista, desconto, evento e acesso manualmente, o que escala mal e gera discussão sobre quem tem direito ao quê.",
    "cryptoAngle": "Token-gating vira a camada de prova e acesso, permitindo benefícios portáteis e verificáveis sem reinventar um sistema inteiro de membership.",
    "mvpScope": "Comece com verificação de carteira, lista de benefícios e painel simples para o organizador cadastrar parceiros. Pode funcionar para comunidades locais, criadores, atléticas ou coletivos de tecnologia.",
    "judgeHook": "E facil mostrar uma página onde membros com um token ou NFT acessam descontos, eventos e conteúdos exclusivos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-014",
    "category": "Consumo",
    "title": "Mural de pedidos para criadores",
    "description": "Um mural onde fãs sugerem conteúdos, votam com pequenas contribuições e acompanham o que foi aceito.",
    "details": "O MVP pode ter sugestões, ranking por apoio e status de produção. A camada cripto entra como contribuição transparente para priorizar ideias, mas a experiência deve parecer um mural de pedidos simples.",
    "tags": [
      "Creators",
      "Social",
      "Pagamentos"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "O MVP pode ter sugestões, ranking por apoio e status de produção. A camada cripto entra como contribuição transparente para priorizar ideias, mas a experiência deve parecer um mural de pedidos simples.",
    "judgeHook": "E facil mostrar um mural onde fãs sugerem conteúdos, votam com pequenas contribuições e acompanham o que foi aceito. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-015",
    "category": "Consumo",
    "title": "Carteira social para grupos de estudo",
    "description": "Um app para grupos registrarem encontros, materiais e pequenas recompensas por participação.",
    "details": "A primeira versão pode ter check-in, biblioteca de links, pontos e ranking amigável. É uma ideia boa para times que querem construir algo útil para comunidades sem precisar criar um protocolo complexo.",
    "tags": [
      "Educação",
      "Comunidade",
      "Consumo"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "A primeira versão pode ter check-in, biblioteca de links, pontos e ranking amigável. É uma ideia boa para times que querem construir algo útil para comunidades sem precisar criar um protocolo complexo.",
    "judgeHook": "E facil mostrar um app para grupos registrarem encontros, materiais e pequenas recompensas por participação. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-016",
    "category": "Consumo",
    "title": "Programa de fidelidade para pequenos cafés",
    "description": "Um cartão de fidelidade digital para cafés, hamburguerias e lojas locais premiarem recorrência sem depender de app pesado.",
    "details": "O MVP pode ter QR code por compra, contador de visitas, regra de recompensa e tela de resgate. Use Solana só para tornar o selo verificável ou portável, mantendo a experiência parecida com um cartão de carimbo.",
    "tags": [
      "Loyalty",
      "Comércio local",
      "Brasil"
    ],
    "targetUser": "Donos de pequenos comércios e marcas locais que querem trazer o cliente de volta sem montar um CRM inteiro.",
    "painPoint": "Negócios pequenos sabem que fidelidade importa, mas quase nunca têm tempo ou ferramenta para registrar visita, dar benefício e medir quem voltou.",
    "cryptoAngle": "Selos verificáveis ou pontos portáveis criam um programa simples, moderno e mais compartilhável do que um cartão de papel.",
    "mvpScope": "QR code por compra, contador de visitas, regra de recompensa e tela de resgate. Se quiser um toque extra, emita um selo onchain quando o cliente bater a meta.",
    "judgeHook": "A demo é muito visual: compra simulada, selo entrando na conta do cliente e benefício sendo liberado na hora como um cartão de carimbo repaginado.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Boa para times iniciantes porque dá para mostrar valor sem explicar DeFi, wallet ou protocolo antes do produto fazer sentido.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "real-world-payments"
    ]
  },
  {
    "id": "idea-017",
    "category": "Consumo",
    "title": "Galeria de colecionáveis para eventos culturais",
    "description": "Uma galeria onde participantes guardam lembranças digitais de shows, festas, exposições e eventos locais.",
    "details": "Comece com emissão de um colecionável por evento, página pública e compartilhamento social. O diferencial é usar a lembrança como prova de presença e porta para benefícios futuros.",
    "tags": [
      "Eventos",
      "NFT",
      "Cultura"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com emissão de um colecionável por evento, página pública e compartilhamento social. O diferencial é usar a lembrança como prova de presença e porta para benefícios futuros.",
    "judgeHook": "E facil mostrar uma galeria onde participantes guardam lembranças digitais de shows, festas, exposições e eventos locais. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-018",
    "category": "Consumo",
    "title": "Carteira de benefícios para estudantes",
    "description": "Um perfil estudantil que agrega descontos, presença em eventos e conquistas acadêmicas ou extracurriculares.",
    "details": "O MVP pode focar em uma universidade ou comunidade. Crie verificação simples, lista de benefícios e badges por participação, usando registros onchain só para conquistas que precisam ser compartilhadas.",
    "tags": [
      "Educação",
      "Estudantes",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode focar em uma universidade ou comunidade. Crie verificação simples, lista de benefícios e badges por participação, usando registros onchain só para conquistas que precisam ser compartilhadas.",
    "judgeHook": "E facil mostrar um perfil estudantil que agrega descontos, presença em eventos e conquistas acadêmicas ou extracurriculares. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-019",
    "category": "Consumo",
    "title": "Feed de oportunidades para quem constrói",
    "description": "Um feed simples de bounties, hackathons, bolsas e chamadas para projetos, com perfil de interesse do usuário.",
    "details": "O MVP pode buscar oportunidades em uma lista curada, permitir salvar favoritas e recomendar por categoria. A parte web3 pode entrar em badges de candidatura ou histórico de participação.",
    "tags": [
      "Builders",
      "Comunidade",
      "Oportunidades"
    ],
    "targetUser": "Hackers iniciantes, builders independentes e pessoas em transição de carreira procurando onde aplicar suas skills.",
    "painPoint": "Oportunidades de bounty, bolsa e hackathon ficam espalhadas demais, então muita gente perde prazo ou nem descobre vagas que combinam com seu momento.",
    "cryptoAngle": "Badges de candidatura e histórico onchain de participação ajudam a montar contexto e reputação ao longo do tempo.",
    "mvpScope": "O MVP pode buscar oportunidades em uma lista curada, permitir salvar favoritas e recomendar por categoria. A parte web3 pode entrar em badges de candidatura ou histórico de participação.",
    "judgeHook": "E facil mostrar um feed simples de bounties, hackathons, bolsas e chamadas para projetos, com perfil de interesse do usuário. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-020",
    "category": "Consumo",
    "title": "Lista de espera com recompensa para lançamentos",
    "description": "Uma ferramenta para projetos criarem listas de espera com ranking, convites e recompensas simples.",
    "details": "Construa landing page, link de convite e ranking. A camada onchain pode emitir pontos ou badges para usuários que trouxerem pessoas reais, ajudando projetos de hackathon a validar demanda rapidamente.",
    "tags": [
      "Crescimento",
      "Lançamento",
      "Consumo"
    ],
    "targetUser": "Founders, creators e projetos em estágio inicial que precisam provar interesse antes de gastar semanas construindo.",
    "painPoint": "Lançar cedo é difícil porque lista de espera, indicação e recompensa costumam ficar em ferramentas separadas, sem clareza sobre quem trouxe usuários reais.",
    "cryptoAngle": "Pontos ou badges onchain transformam referral e early access em ativos verificáveis, abrindo espaço para perks futuros sem complicar o MVP.",
    "mvpScope": "Construa landing page, link de convite e ranking. A camada onchain pode emitir pontos ou badges para usuários que trouxerem pessoas reais, ajudando projetos de hackathon a validar demanda rapidamente.",
    "judgeHook": "E facil mostrar uma ferramenta para projetos criarem listas de espera com ranking, convites e recompensas simples. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-061",
    "category": "Consumo",
    "title": "Agenda de eventos com check-in verificável",
    "description": "Uma agenda de eventos da comunidade onde presença gera histórico e benefícios futuros.",
    "details": "O MVP pode listar eventos, permitir check-in por QR code e mostrar perfil de participação. Depois, organizadores podem usar esse histórico para liberar vagas, brindes ou convites.",
    "tags": [
      "Eventos",
      "Comunidade",
      "Reputação"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode listar eventos, permitir check-in por QR code e mostrar perfil de participação. Depois, organizadores podem usar esse histórico para liberar vagas, brindes ou convites.",
    "judgeHook": "E facil mostrar uma agenda de eventos da comunidade onde presença gera histórico e benefícios futuros. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-062",
    "category": "Consumo",
    "title": "Clube de leitura com badges de participação",
    "description": "Um app para grupos de leitura registrarem encontros, livros e participação de membros.",
    "details": "Comece com clubes, encontros, presença e pequenos badges por leitura concluída. É simples de construir e mostra como registros verificáveis podem servir para comunidades não técnicas.",
    "tags": [
      "Educação",
      "Comunidade",
      "NFT"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com clubes, encontros, presença e pequenos badges por leitura concluída. É simples de construir e mostra como registros verificáveis podem servir para comunidades não técnicas.",
    "judgeHook": "E facil mostrar um app para grupos de leitura registrarem encontros, livros e participação de membros. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-063",
    "category": "Consumo",
    "title": "Portfólio automático para hackathons",
    "description": "Uma página que transforma cada projeto de hackathon em prova pública de entrega para todos os participantes do time.",
    "details": "O MVP pode pedir nome do projeto, função da pessoa, links, screenshots, stack e entregas principais. Gere uma página bonita com histórico de participação, útil para recrutamento e para mostrar trabalho depois do evento.",
    "tags": [
      "Hackathon",
      "Portfólio",
      "Reputação"
    ],
    "targetUser": "Hackers iniciantes, freelancers e founders em começo de jornada que terminam projetos legais mas saem do evento sem nenhum ativo de reputação.",
    "painPoint": "Depois do hackathon, links quebrados, demos perdidas e funções mal explicadas fazem o trabalho sumir exatamente quando a pessoa mais precisa mostrar tração.",
    "cryptoAngle": "Badges, timestamps e registros verificáveis dão uma camada de prova ao portfólio sem transformar a experiência em um produto só para nativos de cripto.",
    "mvpScope": "Nome do projeto, papel de cada pessoa, links, screenshots, stack e entregas principais. O sistema gera uma página pública com selo de participação e prova simples de autoria.",
    "judgeHook": "O antes e depois da demo é muito claro: de um monte de links soltos para um portfólio compartilhável que prova quem construiu o quê.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona muito bem para este público porque resolve uma dor imediata do hacker iniciante e ainda deixa um resultado bonito para mostrar no palco e depois dele.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-064",
    "category": "Consumo",
    "title": "Ranking de contribuições em comunidades",
    "description": "Um painel que reconhece quem ajudou em eventos, conteúdos, suporte e organização.",
    "details": "A primeira versão pode permitir que admins registrem contribuições e membros recebam pontos ou badges. O foco é reconhecimento público, não competição agressiva.",
    "tags": [
      "Comunidade",
      "Reputação",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "A primeira versão pode permitir que admins registrem contribuições e membros recebam pontos ou badges. O foco é reconhecimento público, não competição agressiva.",
    "judgeHook": "E facil mostrar um painel que reconhece quem ajudou em eventos, conteúdos, suporte e organização. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-065",
    "category": "Consumo",
    "title": "Carteira de certificados para cursos livres",
    "description": "Um lugar simples para guardar certificados de workshops, mentorias e cursos curtos.",
    "details": "O MVP pode emitir certificados por turma, verificar autenticidade e criar perfil público. É útil para comunidades educacionais que querem provar participação sem depender de PDFs soltos.",
    "tags": [
      "Educação",
      "Certificados",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode emitir certificados por turma, verificar autenticidade e criar perfil público. É útil para comunidades educacionais que querem provar participação sem depender de PDFs soltos.",
    "judgeHook": "E facil mostrar um lugar simples para guardar certificados de workshops, mentorias e cursos curtos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-066",
    "category": "Consumo",
    "title": "Mapa de lugares cripto-amigáveis",
    "description": "Um mapa colaborativo de lojas, cafés e eventos que aceitam pagamentos digitais ou participam de comunidades web3.",
    "details": "Comece com cadastro manual, avaliações e filtros por cidade. O produto pode ser útil em São Paulo, Rio, Floripa ou eventos, com verificação por foto ou comunidade.",
    "tags": [
      "Brasil",
      "Mapa",
      "Pagamentos"
    ],
    "targetUser": "Pequenos negócios, lojistas locais e vendedores de evento.",
    "painPoint": "Vender, acompanhar fidelidade ou organizar caixa ainda exige ferramentas que não conversam bem com pagamentos e comprovação.",
    "cryptoAngle": "A camada cripto entra como pagamento, recibo ou selo portável, adicionando diferencial sem exigir uma operação complexa.",
    "mvpScope": "Comece com cadastro manual, avaliações e filtros por cidade. O produto pode ser útil em São Paulo, Rio, Floripa ou eventos, com verificação por foto ou comunidade.",
    "judgeHook": "E facil mostrar um mapa colaborativo de lojas, cafés e eventos que aceitam pagamentos digitais ou participam de comunidades web3. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Boa direção quando o time escolher um recorte bem real de comércio local e mostrar um fluxo completo.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "real-world-payments"
    ]
  },
  {
    "id": "idea-067",
    "category": "Consumo",
    "title": "Convites com acesso por carteira",
    "description": "Uma ferramenta para criar convites de eventos que liberam entrada com carteira, QR code ou nome na lista.",
    "details": "O MVP pode gerar evento, lista de convidados e check-in. A carteira entra como identidade opcional, sem impedir que pessoas não técnicas usem o produto.",
    "tags": [
      "Eventos",
      "Identidade",
      "Comunidade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode gerar evento, lista de convidados e check-in. A carteira entra como identidade opcional, sem impedir que pessoas não técnicas usem o produto.",
    "judgeHook": "E facil mostrar uma ferramenta para criar convites de eventos que liberam entrada com carteira, QR code ou nome na lista. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-068",
    "category": "Consumo",
    "title": "Mural de agradecimentos para apoiadores",
    "description": "Uma página pública para projetos agradecerem apoiadores, voluntários e primeiros usuários.",
    "details": "Comece com lista de apoiadores, mensagem, contribuição e selo opcional. É simples, emocional e pode virar uma camada de reputação para projetos nascentes.",
    "tags": [
      "Social",
      "Comunidade",
      "Reputação"
    ],
    "targetUser": "Comunidades, creators e usuários finais que querem benefícios, reputação ou acesso sem fricção.",
    "painPoint": "Participação, benefícios e histórico de contribuição ainda ficam espalhados em formulários, prints e listas manuais.",
    "cryptoAngle": "A carteira ou o registro verificável vira uma camada leve de identidade, prova de participação ou acesso.",
    "mvpScope": "Comece com lista de apoiadores, mensagem, contribuição e selo opcional. É simples, emocional e pode virar uma camada de reputação para projetos nascentes.",
    "judgeHook": "E facil mostrar uma página pública para projetos agradecerem apoiadores, voluntários e primeiros usuários. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona melhor quando o time recorta uma comunidade ou jornada muito específica.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-069",
    "category": "Consumo",
    "title": "Desafios semanais para aprender Solana",
    "description": "Uma trilha de desafios curtos para iniciantes aprenderem conceitos de Solana com recompensas simbólicas.",
    "details": "O MVP pode ter desafios, respostas, progresso e ranking. Não precisa compilar código real no começo; pode ser uma experiência guiada para reduzir barreira de entrada.",
    "tags": [
      "Educação",
      "Solana",
      "Comunidade"
    ],
    "targetUser": "Comunidades, creators e usuários finais que querem benefícios, reputação ou acesso sem fricção.",
    "painPoint": "Participação, benefícios e histórico de contribuição ainda ficam espalhados em formulários, prints e listas manuais.",
    "cryptoAngle": "A carteira ou o registro verificável vira uma camada leve de identidade, prova de participação ou acesso.",
    "mvpScope": "O MVP pode ter desafios, respostas, progresso e ranking. Não precisa compilar código real no começo; pode ser uma experiência guiada para reduzir barreira de entrada.",
    "judgeHook": "E facil mostrar uma trilha de desafios curtos para iniciantes aprenderem conceitos de Solana com recompensas simbólicas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona melhor quando o time recorta uma comunidade ou jornada muito específica.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-070",
    "category": "Consumo",
    "title": "Lista de presentes com pagamento digital",
    "description": "Uma lista de presentes para aniversários, casamentos ou chá de casa nova, com contribuições transparentes.",
    "details": "O MVP pode ter itens, cotas, mensagens e comprovantes. A stablecoin pode ser opcional, mas a transparência da meta e dos apoiadores é o centro da experiência.",
    "tags": [
      "Pagamentos",
      "Eventos",
      "Brasil"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode ter itens, cotas, mensagens e comprovantes. A stablecoin pode ser opcional, mas a transparência da meta e dos apoiadores é o centro da experiência.",
    "judgeHook": "E facil mostrar uma lista de presentes para aniversários, casamentos ou chá de casa nova, com contribuições transparentes. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-111",
    "category": "Consumo",
    "title": "Diário de aprendizado com provas públicas",
    "description": "Um diário onde estudantes registram aprendizados, projetos e evidências de progresso.",
    "details": "O MVP pode ter posts curtos, links, badges e uma página pública. Use registros verificáveis apenas para marcos importantes, como conclusão de desafio ou entrega de projeto.",
    "tags": [
      "Educação",
      "Reputação",
      "Portfólio"
    ],
    "targetUser": "Estudantes, atléticas, centros acadêmicos e comunidades educacionais.",
    "painPoint": "Presença, arrecadação, benefícios e provas de participação em contextos estudantis ainda ficam espalhados em planilhas, grupos e formulários.",
    "cryptoAngle": "Registros verificáveis, pagamentos simples e badges ajudam a organizar participação e benefício sem transformar a experiência em algo técnico demais.",
    "mvpScope": "O MVP pode ter posts curtos, links, badges e uma página pública. Use registros verificáveis apenas para marcos importantes, como conclusão de desafio ou entrega de projeto.",
    "judgeHook": "E facil mostrar um diário onde estudantes registram aprendizados, projetos e evidências de progresso. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-112",
    "category": "Consumo",
    "title": "Carteira de ingressos para eventos de comunidade",
    "description": "Um lugar para guardar ingressos, presença e benefícios de eventos pequenos.",
    "details": "Comece com ingresso por QR code, check-in e histórico de eventos. Para organizadores, adicione uma lista simples de participantes e exportação.",
    "tags": [
      "Eventos",
      "Mobile",
      "Comunidade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com ingresso por QR code, check-in e histórico de eventos. Para organizadores, adicione uma lista simples de participantes e exportação.",
    "judgeHook": "E facil mostrar um lugar para guardar ingressos, presença e benefícios de eventos pequenos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-113",
    "category": "Consumo",
    "title": "Rede de indicações para freelas",
    "description": "Um app onde freelancers registram indicações recebidas e agradecem quem trouxe clientes.",
    "details": "O MVP pode ter link de indicação, status do lead e recompensa simbólica. É útil para designers, devs e consultores que dependem de rede de confiança.",
    "tags": [
      "Freelancers",
      "Reputação",
      "Brasil"
    ],
    "targetUser": "Freelancers brasileiros e prestadores de serviço que precisam cobrar, receber e comprovar entrega.",
    "painPoint": "Cobrar clientes, registrar o combinado e provar pagamento ou entrega ainda gera atrito demais em operações pequenas.",
    "cryptoAngle": "Stablecoin e comprovantes onchain criam um fluxo mais claro de cobrança, quitação e prova sem exigir uma operação financeira pesada.",
    "mvpScope": "O MVP pode ter link de indicação, status do lead e recompensa simbólica. É útil para designers, devs e consultores que dependem de rede de confiança.",
    "judgeHook": "E facil mostrar um app onde freelancers registram indicações recebidas e agradecem quem trouxe clientes. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tem uma história forte de problema real e cabe bem em um MVP enxuto com foco em UX.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "real-world-payments"
    ]
  },
  {
    "id": "idea-114",
    "category": "Consumo",
    "title": "Coleção de conquistas para voluntários",
    "description": "Um perfil para voluntários registrarem horas, ações e impacto em projetos sociais.",
    "details": "Comece com organizações, eventos, check-ins e badges. A proposta é ajudar voluntários a mostrar trabalho real e ONGs a reconhecerem participação.",
    "tags": [
      "Impacto",
      "Reputação",
      "Comunidade"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com organizações, eventos, check-ins e badges. A proposta é ajudar voluntários a mostrar trabalho real e ONGs a reconhecerem participação.",
    "judgeHook": "E facil mostrar um perfil para voluntários registrarem horas, ações e impacto em projetos sociais. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-115",
    "category": "Consumo",
    "title": "Agenda de mentorias com reputação",
    "description": "Uma plataforma simples para marcar mentorias e registrar feedback entre mentores e mentorados.",
    "details": "O MVP pode ter disponibilidade, agendamento, avaliação e histórico público opcional. Serve para comunidades tech que organizam mentoria informal pelo WhatsApp.",
    "tags": [
      "Educação",
      "Comunidade",
      "Reputação"
    ],
    "targetUser": "Comunidades, creators e usuários finais que querem benefícios, reputação ou acesso sem fricção.",
    "painPoint": "Participação, benefícios e histórico de contribuição ainda ficam espalhados em formulários, prints e listas manuais.",
    "cryptoAngle": "A carteira ou o registro verificável vira uma camada leve de identidade, prova de participação ou acesso.",
    "mvpScope": "O MVP pode ter disponibilidade, agendamento, avaliação e histórico público opcional. Serve para comunidades tech que organizam mentoria informal pelo WhatsApp.",
    "judgeHook": "E facil mostrar uma plataforma simples para marcar mentorias e registrar feedback entre mentores e mentorados. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona melhor quando o time recorta uma comunidade ou jornada muito específica.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-116",
    "category": "Consumo",
    "title": "Cartão de membro para comunidades locais",
    "description": "Um cartão digital que mostra pertencimento, função, eventos frequentados e benefícios de uma comunidade.",
    "details": "Comece com perfil, QR code e benefícios disponíveis. Pode funcionar para hubs de tecnologia, coletivos culturais, comunidades universitárias ou grupos de pessoas que constroem projetos.",
    "tags": [
      "Comunidade",
      "Identidade",
      "Brasil"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com perfil, QR code e benefícios disponíveis. Pode funcionar para hubs de tecnologia, coletivos culturais, comunidades universitárias ou grupos de pessoas que constroem projetos.",
    "judgeHook": "E facil mostrar um cartão digital que mostra pertencimento, função, eventos frequentados e benefícios de uma comunidade. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-117",
    "category": "Consumo",
    "title": "Feed de missões para embaixadores",
    "description": "Um painel onde comunidades publicam missões simples e embaixadores registram entregas.",
    "details": "O MVP pode ter missão, prazo, prova de entrega e pontuação. Use badges ou pontos para reconhecimento, sem precisar automatizar pagamento no começo.",
    "tags": [
      "Comunidade",
      "Growth",
      "Reputação"
    ],
    "targetUser": "Comunidades, organizadores e grupos de amigos que querem experiências mais engajantes e recompensas mais visíveis.",
    "painPoint": "Experiências comunitárias perdem força quando participação, pontuação e recompensa ficam manuais ou se perdem depois do evento.",
    "cryptoAngle": "Badges, prêmios e histórico portável ajudam a dar persistência e identidade para a experiência sem matar a diversão.",
    "mvpScope": "O MVP pode ter missão, prazo, prova de entrega e pontuação. Use badges ou pontos para reconhecimento, sem precisar automatizar pagamento no começo.",
    "judgeHook": "E facil mostrar um painel onde comunidades publicam missões simples e embaixadores registram entregas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona no hackathon quando a camada lúdica já é divertida sozinha e o cripto entra como reforço visível.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-118",
    "category": "Consumo",
    "title": "Currículo de projetos para estudantes",
    "description": "Uma página que organiza projetos, eventos, cursos e contribuições de estudantes em um currículo vivo.",
    "details": "Comece com blocos editáveis e badges de validação por comunidade ou professor. O produto ajuda estudantes a mostrar prática, não só diploma.",
    "tags": [
      "Educação",
      "Portfólio",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com blocos editáveis e badges de validação por comunidade ou professor. O produto ajuda estudantes a mostrar prática, não só diploma.",
    "judgeHook": "E facil mostrar uma página que organiza projetos, eventos, cursos e contribuições de estudantes em um currículo vivo. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-119",
    "category": "Consumo",
    "title": "Clube de desafios para hábitos saudáveis",
    "description": "Um app de desafios em grupo para caminhada, treino, leitura ou estudo, com progresso e selos.",
    "details": "O MVP pode ter desafio, check-in diário e ranking leve. Use colecionáveis como recompensa simbólica, mas mantenha a experiência parecida com um grupo de compromisso.",
    "tags": [
      "Saúde",
      "Social",
      "Gamificação"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode ter desafio, check-in diário e ranking leve. Use colecionáveis como recompensa simbólica, mas mantenha a experiência parecida com um grupo de compromisso.",
    "judgeHook": "E facil mostrar um app de desafios em grupo para caminhada, treino, leitura ou estudo, com progresso e selos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-120",
    "category": "Consumo",
    "title": "Mural de provas para projetos open source",
    "description": "Um mural onde contribuidores mostram issues resolvidas, PRs e impacto em projetos abertos.",
    "details": "Comece com integração manual de links do GitHub, categorias de contribuição e perfil público. Depois, badges verificáveis podem destacar quem realmente entregou.",
    "tags": [
      "Open source",
      "Reputação",
      "Dev tools"
    ],
    "targetUser": "Comunidades, creators e usuários finais que querem benefícios, reputação ou acesso sem fricção.",
    "painPoint": "Participação, benefícios e histórico de contribuição ainda ficam espalhados em formulários, prints e listas manuais.",
    "cryptoAngle": "A carteira ou o registro verificável vira uma camada leve de identidade, prova de participação ou acesso.",
    "mvpScope": "Comece com integração manual de links do GitHub, categorias de contribuição e perfil público. Depois, badges verificáveis podem destacar quem realmente entregou.",
    "judgeHook": "E facil mostrar um mural onde contribuidores mostram issues resolvidas, PRs e impacto em projetos abertos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona melhor quando o time recorta uma comunidade ou jornada muito específica.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-161",
    "category": "Consumo",
    "title": "Identidade simples para comunidades de bairro",
    "description": "Um cartão digital de membro para grupos locais, com presença, função e histórico de participação.",
    "details": "Comece com perfil, QR code e validação por organizador. Pode ser usado por coletivos, redes de voluntários, grupos de estudo e associações locais.",
    "tags": [
      "Identidade",
      "Comunidade",
      "Brasil"
    ],
    "targetUser": "Comunidades locais, cooperativas, condomínios e operadores que precisam provar dados ou impacto no território.",
    "painPoint": "Quando o dado nasce no mundo físico, ainda é difícil provar origem, frequência e confiança sem processos manuais.",
    "cryptoAngle": "Registros verificáveis e recompensas simples ajudam a mostrar contribuição e histórico com mais transparência.",
    "mvpScope": "Comece com perfil, QR code e validação por organizador. Pode ser usado por coletivos, redes de voluntários, grupos de estudo e associações locais.",
    "judgeHook": "E facil mostrar um cartão digital de membro para grupos locais, com presença, função e histórico de participação. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "stretch",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Só é uma boa aposta se o time recortar bem o caso de uso e focar na prova de valor, não em infraestrutura pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-162",
    "category": "Consumo",
    "title": "Diário de impacto para projetos sociais",
    "description": "Uma página onde projetos sociais registram ações, fotos, números e apoiadores ao longo do tempo.",
    "details": "O MVP pode ter linha do tempo, métricas simples e recibos de doação. A ideia ajuda ONGs pequenas a comunicar impacto sem depender de relatórios longos.",
    "tags": [
      "Impacto",
      "Comunidade",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode ter linha do tempo, métricas simples e recibos de doação. A ideia ajuda ONGs pequenas a comunicar impacto sem depender de relatórios longos.",
    "judgeHook": "E facil mostrar uma página onde projetos sociais registram ações, fotos, números e apoiadores ao longo do tempo. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-163",
    "category": "Consumo",
    "title": "Clube de descontos entre comunidades",
    "description": "Uma rede onde membros de comunidades parceiras acessam descontos e benefícios locais.",
    "details": "Comece com verificação de membro, lista de parceiros e resgate por QR code. O MVP pode focar em uma cidade ou evento para ficar simples.",
    "tags": [
      "Loyalty",
      "Comunidade",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com verificação de membro, lista de parceiros e resgate por QR code. O MVP pode focar em uma cidade ou evento para ficar simples.",
    "judgeHook": "E facil mostrar uma rede onde membros de comunidades parceiras acessam descontos e benefícios locais. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-164",
    "category": "Consumo",
    "title": "Perfil de speaker para eventos",
    "description": "Uma página para palestrantes mostrarem temas, eventos passados, avaliações e materiais.",
    "details": "O MVP pode registrar participações, links de slides e feedback. Comunidades podem usar isso para convidar pessoas com histórico real.",
    "tags": [
      "Eventos",
      "Reputação",
      "Comunidade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode registrar participações, links de slides e feedback. Comunidades podem usar isso para convidar pessoas com histórico real.",
    "judgeHook": "E facil mostrar uma página para palestrantes mostrarem temas, eventos passados, avaliações e materiais. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-165",
    "category": "Consumo",
    "title": "Lista de espera com prioridade por contribuição",
    "description": "Uma lista de espera onde pessoas sobem de posição ao contribuir com feedback, indicação ou teste.",
    "details": "Comece com cadastro, tarefas simples e ranking. A parte verificável pode entrar nos pontos de contribuição, ajudando projetos a encontrar usuários engajados.",
    "tags": [
      "Crescimento",
      "Comunidade",
      "Reputação"
    ],
    "targetUser": "Comunidades, creators e usuários finais que querem benefícios, reputação ou acesso sem fricção.",
    "painPoint": "Participação, benefícios e histórico de contribuição ainda ficam espalhados em formulários, prints e listas manuais.",
    "cryptoAngle": "A carteira ou o registro verificável vira uma camada leve de identidade, prova de participação ou acesso.",
    "mvpScope": "Comece com cadastro, tarefas simples e ranking. A parte verificável pode entrar nos pontos de contribuição, ajudando projetos a encontrar usuários engajados.",
    "judgeHook": "E facil mostrar uma lista de espera onde pessoas sobem de posição ao contribuir com feedback, indicação ou teste. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona melhor quando o time recorta uma comunidade ou jornada muito específica.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-166",
    "category": "Consumo",
    "title": "Coleção de memórias para turmas",
    "description": "Um álbum digital para turmas guardarem eventos, conquistas, fotos e mensagens de uma fase.",
    "details": "O MVP pode ter turma, momentos, participantes e colecionáveis opcionais. É uma forma leve de usar web3 como memória compartilhada, não como finanças.",
    "tags": [
      "Educação",
      "Social",
      "NFT"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode ter turma, momentos, participantes e colecionáveis opcionais. É uma forma leve de usar web3 como memória compartilhada, não como finanças.",
    "judgeHook": "E facil mostrar um álbum digital para turmas guardarem eventos, conquistas, fotos e mensagens de uma fase. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-167",
    "category": "Consumo",
    "title": "Passaporte de voluntariado corporativo",
    "description": "Um registro para empresas acompanharem ações voluntárias de funcionários e impacto gerado.",
    "details": "Comece com ações, presença, horas e certificado. O produto pode ajudar RH e impacto social sem exigir que usuários entendam blockchain.",
    "tags": [
      "Impacto",
      "B2B",
      "Reputação"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com ações, presença, horas e certificado. O produto pode ajudar RH e impacto social sem exigir que usuários entendam blockchain.",
    "judgeHook": "E facil mostrar um registro para empresas acompanharem ações voluntárias de funcionários e impacto gerado. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-168",
    "category": "Consumo",
    "title": "Rede de trocas para comunidades universitárias",
    "description": "Um marketplace leve para estudantes trocarem livros, materiais, móveis e equipamentos usados.",
    "details": "O MVP pode ter anúncios, reputação, reserva e confirmação de entrega. A camada onchain pode registrar reputação e histórico de trocas confiáveis.",
    "tags": [
      "Estudantes",
      "Brasil",
      "Marketplace"
    ],
    "targetUser": "Estudantes, atléticas, centros acadêmicos e comunidades educacionais.",
    "painPoint": "Presença, arrecadação, benefícios e provas de participação em contextos estudantis ainda ficam espalhados em planilhas, grupos e formulários.",
    "cryptoAngle": "Registros verificáveis, pagamentos simples e badges ajudam a organizar participação e benefício sem transformar a experiência em algo técnico demais.",
    "mvpScope": "O MVP pode ter anúncios, reputação, reserva e confirmação de entrega. A camada onchain pode registrar reputação e histórico de trocas confiáveis.",
    "judgeHook": "E facil mostrar um marketplace leve para estudantes trocarem livros, materiais, móveis e equipamentos usados. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-169",
    "category": "Consumo",
    "title": "Agenda de benefícios para participantes de hackathon",
    "description": "Uma tela que reúne benefícios, créditos, mentorias e links importantes para participantes de um evento.",
    "details": "Comece com lista de benefícios, status de resgate e lembretes. Pode virar um companion app de evento, com QR code para validar presença em atividades.",
    "tags": [
      "Hackathon",
      "Eventos",
      "Comunidade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com lista de benefícios, status de resgate e lembretes. Pode virar um companion app de evento, com QR code para validar presença em atividades.",
    "judgeHook": "E facil mostrar uma tela que reúne benefícios, créditos, mentorias e links importantes para participantes de um evento. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-170",
    "category": "Consumo",
    "title": "Perfil de confiança para vendedores informais",
    "description": "Um cartão público com histórico, avaliações e comprovantes de vendas para pequenos vendedores.",
    "details": "O MVP pode ter perfil, avaliações, links de pagamento e histórico de pedidos. Ajuda quem vende por WhatsApp ou Instagram a passar mais confiança.",
    "tags": [
      "Comércio local",
      "Reputação",
      "Brasil"
    ],
    "targetUser": "Pequenos negócios, lojistas locais e vendedores de evento.",
    "painPoint": "Vender, acompanhar fidelidade ou organizar caixa ainda exige ferramentas que não conversam bem com pagamentos e comprovação.",
    "cryptoAngle": "A camada cripto entra como pagamento, recibo ou selo portável, adicionando diferencial sem exigir uma operação complexa.",
    "mvpScope": "O MVP pode ter perfil, avaliações, links de pagamento e histórico de pedidos. Ajuda quem vende por WhatsApp ou Instagram a passar mais confiança.",
    "judgeHook": "E facil mostrar um cartão público com histórico, avaliações e comprovantes de vendas para pequenos vendedores. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Boa direção quando o time escolher um recorte bem real de comércio local e mostrar um fluxo completo.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "community-growth",
      "demo-friendly",
      "real-world-payments",
      "trust-and-proof"
    ]
  }
];
