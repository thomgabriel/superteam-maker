import type { CuratedIdea } from "./types";

export const AI_IDEAS: CuratedIdea[] = [
  {
    "id": "idea-036",
    "category": "AI",
    "title": "Agente que explica transações em português",
    "description": "Um assistente que traduz uma transação Solana para linguagem simples antes do usuário assinar.",
    "details": "O MVP pode receber dados de uma transação e gerar um resumo como: você está enviando X para Y, este contrato pode fazer Z. Foque em reduzir medo e erro para usuários não técnicos.",
    "tags": [
      "AI",
      "Wallet",
      "Segurança"
    ],
    "targetUser": "Usuários iniciantes e semi-iniciantes que já tocaram em cripto, mas ainda não entendem risco, custo ou estado da carteira.",
    "painPoint": "Mesmo quando o usuário quer avançar, ele esbarra em termos técnicos, risco pouco explicado e interfaces difíceis de comparar.",
    "cryptoAngle": "Dados onchain e sinais de protocolo deixam a explicação mais concreta e ajudam a transformar complexidade em orientação prática.",
    "mvpScope": "O MVP pode receber dados de uma transação e gerar um resumo como: você está enviando X para Y, este contrato pode fazer Z. Foque em reduzir medo e erro para usuários não técnicos.",
    "judgeHook": "E facil mostrar um assistente que traduz uma transação Solana para linguagem simples antes do usuário assinar. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Funciona melhor quando o produto explica, compara ou alerta sem prometer automação financeira pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-037",
    "category": "AI",
    "title": "Copiloto para escolher uma ideia de hackathon",
    "description": "Um assistente que conversa com o time, entende skills e sugere ideias possíveis para construir.",
    "details": "Comece com perguntas sobre time, tempo, stack, conforto com cripto e tipo de usuário. A resposta pode ranquear ideias do próprio feed, sugerir um MVP de 24 a 36 horas e quebrar as primeiras tarefas por papel.",
    "tags": [
      "AI",
      "Hackathon",
      "Times"
    ],
    "targetUser": "Times iniciantes de hackathon que têm vontade de construir, mas travam nas primeiras horas escolhendo algo ambicioso demais ou desconectado da própria skill.",
    "painPoint": "Muitos times perdem metade do primeiro dia debatendo ideia, tentando parecer mais cripto do que precisam e saindo com um escopo impossível.",
    "cryptoAngle": "O copiloto pode puxar trilhas como pagamentos, prova, identidade ou UX onchain e sugerir o menor recorte cripto que ainda impressiona os jurados.",
    "mvpScope": "Perguntas sobre skills, tempo, stack, tipo de dor e conforto com cripto. A saída ideal é uma shortlist de ideias, um MVP recomendado e a primeira tarefa de cada pessoa.",
    "judgeHook": "É uma demo que conversa com o próprio hackathon: o jurado vê um time confuso virar um plano claro, com ideia, escopo e narrativa cripto em menos de dois minutos.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Meta, mas muito útil. Quando a recomendação parece realmente prática e não genérica, a proposta vira uma das mais memoráveis da categoria.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-038",
    "category": "AI",
    "title": "Assistente de proposta para DAOs",
    "description": "Um bot que transforma uma ideia solta em uma proposta clara para DAO ou comunidade.",
    "details": "O MVP pode gerar título, problema, solução, orçamento, riscos e próximos passos. Dá para conectar com fóruns depois, mas no hackathon o valor já aparece como editor inteligente.",
    "tags": [
      "AI",
      "Governança",
      "Comunidade"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode gerar título, problema, solução, orçamento, riscos e próximos passos. Dá para conectar com fóruns depois, mas no hackathon o valor já aparece como editor inteligente.",
    "judgeHook": "E facil mostrar um bot que transforma uma ideia solta em uma proposta clara para DAO ou comunidade. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-039",
    "category": "AI",
    "title": "Agente de cobranças para pequenos negócios",
    "description": "Um assistente que organiza cobranças pendentes e escreve mensagens educadas para WhatsApp sem parecer robô.",
    "details": "O MVP pode ter lista de cobranças, status, link de pagamento, mensagens sugeridas e histórico de follow-up. Use stablecoin ou PIX simulado como saída, com foco em negócio pequeno que vende pelo WhatsApp.",
    "tags": [
      "AI",
      "Pagamentos",
      "Brasil"
    ],
    "targetUser": "Pequenos negócios, autônomos e lojistas que vendem pelo WhatsApp e vivem lembrando cliente de pagar.",
    "painPoint": "Cobrança manual consome tempo, desgasta a relação com o cliente e ainda deixa o caixa bagunçado porque ninguém sabe o que está vencido, prometido ou quitado.",
    "cryptoAngle": "Stablecoin ou recibo onchain entram como camada de pagamento e prova, enquanto a IA cuida da comunicação e do acompanhamento.",
    "mvpScope": "Lista de cobranças, data de vencimento, valor, link de pagamento e mensagens sugeridas para WhatsApp em tons diferentes. A prova do valor aparece quando o pagamento é confirmado.",
    "judgeHook": "Na apresentação, basta mostrar uma cobrança atrasada, o agente montando a mensagem certa e o pagamento mudando o status em tempo real.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica muito bom quando o caso é específico, como lojista de evento ou serviço local, porque a dor financeira e operacional aparece sem esforço.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "real-world-payments"
    ]
  },
  {
    "id": "idea-040",
    "category": "AI",
    "title": "Resumo de carteira para iniciantes",
    "description": "Um painel que explica a carteira do usuário em português claro, com alertas e próximos passos.",
    "details": "A primeira versão pode mostrar saldo, tokens desconhecidos, NFTs e risco básico. Use IA para traduzir o estado da carteira em frases acionáveis, sem fingir que é consultoria financeira.",
    "tags": [
      "AI",
      "Wallet",
      "Educação"
    ],
    "targetUser": "Usuários iniciantes e semi-iniciantes que já tocaram em cripto, mas ainda não entendem risco, custo ou estado da carteira.",
    "painPoint": "Mesmo quando o usuário quer avançar, ele esbarra em termos técnicos, risco pouco explicado e interfaces difíceis de comparar.",
    "cryptoAngle": "Dados onchain e sinais de protocolo deixam a explicação mais concreta e ajudam a transformar complexidade em orientação prática.",
    "mvpScope": "A primeira versão pode mostrar saldo, tokens desconhecidos, NFTs e risco básico. Use IA para traduzir o estado da carteira em frases acionáveis, sem fingir que é consultoria financeira.",
    "judgeHook": "E facil mostrar um painel que explica a carteira do usuário em português claro, com alertas e próximos passos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Funciona melhor quando o produto explica, compara ou alerta sem prometer automação financeira pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "real-world-payments",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-086",
    "category": "AI",
    "title": "Agente de onboarding para carteiras",
    "description": "Um assistente que guia o usuário nos primeiros passos de uma wallet sem usar jargão técnico.",
    "details": "O MVP pode simular uma carteira, explicar seed phrase, transação, taxa e assinatura com exemplos. O foco é reduzir medo e erros de iniciantes brasileiros.",
    "tags": [
      "AI",
      "Wallet",
      "Educação"
    ],
    "targetUser": "Usuários iniciantes e semi-iniciantes que já tocaram em cripto, mas ainda não entendem risco, custo ou estado da carteira.",
    "painPoint": "Mesmo quando o usuário quer avançar, ele esbarra em termos técnicos, risco pouco explicado e interfaces difíceis de comparar.",
    "cryptoAngle": "Dados onchain e sinais de protocolo deixam a explicação mais concreta e ajudam a transformar complexidade em orientação prática.",
    "mvpScope": "O MVP pode simular uma carteira, explicar seed phrase, transação, taxa e assinatura com exemplos. O foco é reduzir medo e erros de iniciantes brasileiros.",
    "judgeHook": "E facil mostrar um assistente que guia o usuário nos primeiros passos de uma wallet sem usar jargão técnico. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Funciona melhor quando o produto explica, compara ou alerta sem prometer automação financeira pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-087",
    "category": "AI",
    "title": "Leitor de propostas de investimento cripto",
    "description": "Um assistente que resume uma oportunidade, lista riscos e separa promessa de evidência.",
    "details": "O MVP pode receber texto ou link, gerar resumo, perguntas críticas e alerta de termos perigosos. Não deve dizer onde investir, só ajudar a ler melhor.",
    "tags": [
      "AI",
      "Segurança",
      "Educação"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode receber texto ou link, gerar resumo, perguntas críticas e alerta de termos perigosos. Não deve dizer onde investir, só ajudar a ler melhor.",
    "judgeHook": "E facil mostrar um assistente que resume uma oportunidade, lista riscos e separa promessa de evidência. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-088",
    "category": "AI",
    "title": "Gerador de roteiro para demo de hackathon",
    "description": "Um app que ajuda times a transformar produto em uma demo clara, com narrativa e checklist.",
    "details": "Comece com formulário sobre problema, usuário e solução. Gere roteiro de apresentação, falas por pessoa e lista do que precisa funcionar antes da entrega.",
    "tags": [
      "AI",
      "Hackathon",
      "Produtividade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com formulário sobre problema, usuário e solução. Gere roteiro de apresentação, falas por pessoa e lista do que precisa funcionar antes da entrega.",
    "judgeHook": "E facil mostrar um app que ajuda times a transformar produto em uma demo clara, com narrativa e checklist. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-089",
    "category": "AI",
    "title": "Agente de suporte para comunidades",
    "description": "Um bot que responde dúvidas frequentes de uma comunidade usando documentos, links e regras internas.",
    "details": "O MVP pode carregar um conjunto de perguntas e respostas, buscar em documentos e responder em português. É útil para comunidades que repetem as mesmas explicações no Discord ou WhatsApp.",
    "tags": [
      "AI",
      "Comunidade",
      "Suporte"
    ],
    "targetUser": "Creators, founders e usuários menos técnicos que precisam entender ou operar melhor fluxos cripto.",
    "painPoint": "O usuário até tem interesse, mas trava quando precisa interpretar carteira, transação, proposta ou operação com linguagem técnica.",
    "cryptoAngle": "A IA traduz dados onchain e fluxos cripto para linguagem humana sem esconder completamente o que está acontecendo.",
    "mvpScope": "O MVP pode carregar um conjunto de perguntas e respostas, buscar em documentos e responder em português. É útil para comunidades que repetem as mesmas explicações no Discord ou WhatsApp.",
    "judgeHook": "E facil mostrar um bot que responde dúvidas frequentes de uma comunidade usando documentos, links e regras internas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tende a vender bem para jurados quando a entrada e a resposta ficam muito concretas.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-090",
    "category": "AI",
    "title": "Classificador de ideias por dificuldade",
    "description": "Uma ferramenta que lê uma ideia de hackathon e estima dificuldade, riscos e primeiro escopo possível.",
    "details": "O MVP pode retornar nível técnico, tipo de time recomendado, partes mockáveis e plano de construção. Ajuda equipes iniciantes a escolher algo que caiba no tempo.",
    "tags": [
      "AI",
      "Hackathon",
      "Planejamento"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode retornar nível técnico, tipo de time recomendado, partes mockáveis e plano de construção. Ajuda equipes iniciantes a escolher algo que caiba no tempo.",
    "judgeHook": "E facil mostrar uma ferramenta que lê uma ideia de hackathon e estima dificuldade, riscos e primeiro escopo possível. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-136",
    "category": "AI",
    "title": "Tradutor de termos cripto para português simples",
    "description": "Uma ferramenta que explica termos como staking, slippage, pool, oracle e bridge com exemplos do dia a dia.",
    "details": "O MVP pode ser uma busca com explicação, analogia e alerta do que observar. É útil para onboarding e pode alimentar tooltips dentro de outros produtos.",
    "tags": [
      "AI",
      "Educação",
      "Onboarding"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode ser uma busca com explicação, analogia e alerta do que observar. É útil para onboarding e pode alimentar tooltips dentro de outros produtos.",
    "judgeHook": "E facil mostrar uma ferramenta que explica termos como staking, slippage, pool, oracle e bridge com exemplos do dia a dia. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-137",
    "category": "AI",
    "title": "Revisor de pitch para hackathon",
    "description": "Um assistente que lê o pitch do time e sugere cortes, clareza e uma demo mais objetiva.",
    "details": "Comece com campo de texto, análise de problema, usuário, diferencial e pedido final. Gere uma versão curta e uma versão de apresentação de dois minutos.",
    "tags": [
      "AI",
      "Hackathon",
      "Apresentação"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com campo de texto, análise de problema, usuário, diferencial e pedido final. Gere uma versão curta e uma versão de apresentação de dois minutos.",
    "judgeHook": "E facil mostrar um assistente que lê o pitch do time e sugere cortes, clareza e uma demo mais objetiva. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-138",
    "category": "AI",
    "title": "Agente de pesquisa de concorrentes",
    "description": "Um assistente que organiza concorrentes, diferenciais e riscos para uma ideia de hackathon.",
    "details": "O MVP pode pedir uma descrição da ideia e devolver uma tabela manualmente editável. Não precisa ser perfeito; precisa ajudar o time a fazer perguntas melhores.",
    "tags": [
      "AI",
      "Pesquisa",
      "Planejamento"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode pedir uma descrição da ideia e devolver uma tabela manualmente editável. Não precisa ser perfeito; precisa ajudar o time a fazer perguntas melhores.",
    "judgeHook": "E facil mostrar um assistente que organiza concorrentes, diferenciais e riscos para uma ideia de hackathon. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-139",
    "category": "AI",
    "title": "Assistente de documentação para comunidade",
    "description": "Um app que transforma mensagens soltas, links e notas em uma página de documentação simples.",
    "details": "O MVP pode receber texto bruto e gerar seções como começo rápido, perguntas frequentes e links importantes. Serve para comunidades que crescem mais rápido do que conseguem documentar.",
    "tags": [
      "AI",
      "Comunidade",
      "Docs"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode receber texto bruto e gerar seções como começo rápido, perguntas frequentes e links importantes. Serve para comunidades que crescem mais rápido do que conseguem documentar.",
    "judgeHook": "E facil mostrar um app que transforma mensagens soltas, links e notas em uma página de documentação simples. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-140",
    "category": "AI",
    "title": "Copiloto de tarefas para squads",
    "description": "Um assistente que quebra uma ideia em tarefas pequenas e sugere quem do time deveria pegar cada uma.",
    "details": "Comece com input de ideia, skills do time e prazo. Gere uma lista de tarefas por área: produto, front, back, contrato, design e apresentação.",
    "tags": [
      "AI",
      "Times",
      "Hackathon"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com input de ideia, skills do time e prazo. Gere uma lista de tarefas por área: produto, front, back, contrato, design e apresentação.",
    "judgeHook": "E facil mostrar um assistente que quebra uma ideia em tarefas pequenas e sugere quem do time deveria pegar cada uma. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-186",
    "category": "AI",
    "title": "Assistente de moderação para comunidades brasileiras",
    "description": "Um bot que ajuda moderadores a resumir discussões, detectar dúvidas repetidas e sugerir respostas.",
    "details": "O MVP pode receber mensagens exportadas ou coladas, gerar resumo e listar tópicos quentes. Foque em apoiar moderadores, não substituir julgamento humano.",
    "tags": [
      "AI",
      "Comunidade",
      "Suporte"
    ],
    "targetUser": "Creators, founders e usuários menos técnicos que precisam entender ou operar melhor fluxos cripto.",
    "painPoint": "O usuário até tem interesse, mas trava quando precisa interpretar carteira, transação, proposta ou operação com linguagem técnica.",
    "cryptoAngle": "A IA traduz dados onchain e fluxos cripto para linguagem humana sem esconder completamente o que está acontecendo.",
    "mvpScope": "O MVP pode receber mensagens exportadas ou coladas, gerar resumo e listar tópicos quentes. Foque em apoiar moderadores, não substituir julgamento humano.",
    "judgeHook": "E facil mostrar um bot que ajuda moderadores a resumir discussões, detectar dúvidas repetidas e sugerir respostas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tende a vender bem para jurados quando a entrada e a resposta ficam muito concretas.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-187",
    "category": "AI",
    "title": "Leitor de contrato em linguagem simples",
    "description": "Uma ferramenta que explica cláusulas de um contrato simples e destaca pontos de atenção.",
    "details": "O MVP pode receber PDF ou texto, gerar resumo e perguntas para fazer a um advogado. Não deve dar aconselhamento jurídico, apenas organizar leitura.",
    "tags": [
      "AI",
      "Legal",
      "Brasil"
    ],
    "targetUser": "Creators, founders e usuários menos técnicos que precisam entender ou operar melhor fluxos cripto.",
    "painPoint": "O usuário até tem interesse, mas trava quando precisa interpretar carteira, transação, proposta ou operação com linguagem técnica.",
    "cryptoAngle": "A IA traduz dados onchain e fluxos cripto para linguagem humana sem esconder completamente o que está acontecendo.",
    "mvpScope": "O MVP pode receber PDF ou texto, gerar resumo e perguntas para fazer a um advogado. Não deve dar aconselhamento jurídico, apenas organizar leitura.",
    "judgeHook": "E facil mostrar uma ferramenta que explica cláusulas de um contrato simples e destaca pontos de atenção. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tende a vender bem para jurados quando a entrada e a resposta ficam muito concretas.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-188",
    "category": "AI",
    "title": "Agente de pesquisa para pequenos negócios",
    "description": "Um assistente que ajuda pequenos negócios a entender concorrentes, preços e canais antes de lançar uma oferta.",
    "details": "Comece com um formulário sobre produto, cidade e público. Gere hipóteses, perguntas de validação e uma lista de próximos experimentos.",
    "tags": [
      "AI",
      "Pesquisa",
      "Brasil"
    ],
    "targetUser": "Pequenos negócios, lojistas locais e vendedores de evento.",
    "painPoint": "Vender, acompanhar fidelidade ou organizar caixa ainda exige ferramentas que não conversam bem com pagamentos e comprovação.",
    "cryptoAngle": "A camada cripto entra como pagamento, recibo ou selo portável, adicionando diferencial sem exigir uma operação complexa.",
    "mvpScope": "Comece com um formulário sobre produto, cidade e público. Gere hipóteses, perguntas de validação e uma lista de próximos experimentos.",
    "judgeHook": "E facil mostrar um assistente que ajuda pequenos negócios a entender concorrentes, preços e canais antes de lançar uma oferta. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Boa direção quando o time escolher um recorte bem real de comércio local e mostrar um fluxo completo.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "real-world-payments"
    ]
  },
  {
    "id": "idea-189",
    "category": "AI",
    "title": "Resumo de calls para squads de hackathon",
    "description": "Um app que transforma uma reunião do time em tarefas, decisões e riscos para acompanhar depois.",
    "details": "O MVP pode receber transcrição ou notas coladas e gerar ata curta, responsáveis e próximos passos. É útil porque times iniciantes se perdem rápido em conversa.",
    "tags": [
      "AI",
      "Times",
      "Produtividade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode receber transcrição ou notas coladas e gerar ata curta, responsáveis e próximos passos. É útil porque times iniciantes se perdem rápido em conversa.",
    "judgeHook": "E facil mostrar um app que transforma uma reunião do time em tarefas, decisões e riscos para acompanhar depois. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-190",
    "category": "AI",
    "title": "Assistente de validação de problema",
    "description": "Um app que ajuda o time a separar problema real, público-alvo, evidências e suposições.",
    "details": "Comece com perguntas guiadas e um canvas simples. A saída pode ser uma página compartilhável com hipótese, usuário, dor e experimento de validação.",
    "tags": [
      "AI",
      "Produto",
      "Hackathon"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com perguntas guiadas e um canvas simples. A saída pode ser uma página compartilhável com hipótese, usuário, dor e experimento de validação.",
    "judgeHook": "E facil mostrar um app que ajuda o time a separar problema real, público-alvo, evidências e suposições. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "demo-friendly",
      "community-growth"
    ]
  }
];
