import type { CuratedIdea } from "./types";

export const PAYMENTS_IDEAS: CuratedIdea[] = [
  {
    "id": "idea-001",
    "category": "Pagamentos",
    "title": "Checkout em USDC para criadores brasileiros",
    "description": "Um checkout simples para creators venderem produtos digitais em USDC com preço em reais e prova instantânea de pagamento.",
    "details": "O MVP pode ter cadastro de produto, link público de compra, cotação em BRL, confirmação onchain e recibo compartilhável no WhatsApp. Se quiser ir além, libere um download ou badge assim que o pagamento cair.",
    "tags": [
      "Pagamentos",
      "Brasil",
      "Stablecoins"
    ],
    "targetUser": "Creators brasileiros vendendo templates, cursos curtos, comunidades pagas, mentorias ou drops digitais.",
    "painPoint": "Hoje muitos criadores misturam PIX, link de pagamento, DM e planilha para descobrir quem pagou, em qual moeda e o que precisa ser entregue.",
    "cryptoAngle": "USDC resolve cobrança global e o recibo onchain vira prova verificável de compra, acesso ou apoio sem exigir uma stack financeira complexa.",
    "mvpScope": "Cadastro de produto, link público de checkout, valor exibido em BRL e USDC, confirmação de pagamento e recibo compartilhável. Um extra forte é liberar um download ou badge depois da compra.",
    "judgeHook": "Na demo, o jurado vê um criador publicar um produto, um comprador pagar em USDC com preço em reais e o sistema liberar recibo e acesso em segundos.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Muito forte para hackathon porque mistura dor real de monetização, UX simples e um momento cripto visível que fecha bem ao vivo.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-002",
    "category": "Pagamentos",
    "title": "Link de pagamento para freelancers globais",
    "description": "Um link de cobrança para freelancers brasileiros receberem clientes internacionais em stablecoin sem precisar educar o cliente sobre web3.",
    "details": "O MVP pode ter criação de cobrança, valor em USD e BRL, prazo, status e recibo automático. A parte onchain pode começar com um endereço de recebimento e verificação da transação na Solana.",
    "tags": [
      "Pagamentos",
      "Freelancers",
      "Stablecoins"
    ],
    "targetUser": "Freelancers brasileiros, consultores independentes e microagências atendendo clientes fora do país.",
    "painPoint": "Receber de fora ainda significa combinar moeda, correr atrás de comprovante e provar que o pagamento caiu antes de começar ou entregar o trabalho.",
    "cryptoAngle": "Stablecoin encurta o caminho de cobrança internacional e o comprovante onchain reduz discussão sobre quando foi pago, quanto entrou e quem recebeu.",
    "mvpScope": "Criação de cobrança com descrição do serviço, valor em USD e BRL, vencimento, status do pagamento e recibo automático. O suficiente para mostrar um fluxo internacional sem backoffice pesado.",
    "judgeHook": "Fica muito claro em demo: o freelancer gera um link, o cliente paga em stablecoin e o produto devolve recibo e status de cobrança sem nenhuma aula de carteira.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta porque a dor é conhecida até fora do cripto e o MVP entrega valor antes de qualquer integração mais pesada.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-003",
    "category": "Pagamentos",
    "title": "Divisor de conta com stablecoin para viagens em grupo",
    "description": "Um app para dividir custos de viagem, acompanhar quem pagou e fechar o saldo usando stablecoins.",
    "details": "Comece com um grupo, despesas em reais, saldo por pessoa e botão para quitar em USDC. A parte cripto pode ser só o pagamento final, mantendo o resto da experiência parecida com um Splitwise brasileiro.",
    "tags": [
      "Pagamentos",
      "Consumo",
      "Brasil"
    ],
    "targetUser": "Founders, creators e pequenos operadores que precisam cobrar, receber ou repassar dinheiro com clareza.",
    "painPoint": "Cobrança, comprovação e conciliação ainda quebram o fluxo com links soltos, mensagens manuais e pouca transparência.",
    "cryptoAngle": "Stablecoins e recibos onchain deixam pagamento, prova e repasse mais visíveis sem exigir um backoffice pesado.",
    "mvpScope": "Comece com um grupo, despesas em reais, saldo por pessoa e botão para quitar em USDC. A parte cripto pode ser só o pagamento final, mantendo o resto da experiência parecida com um Splitwise brasileiro.",
    "judgeHook": "E facil mostrar um app para dividir custos de viagem, acompanhar quem pagou e fechar o saldo usando stablecoins. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta para times iniciantes porque a história de produto é muito clara e a demo aparece rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-004",
    "category": "Pagamentos",
    "title": "Mesada digital para intercambistas",
    "description": "Uma carteira simples para famílias enviarem stablecoins para estudantes fora do Brasil com controle de gastos.",
    "details": "O MVP pode ter cadastro do estudante, limite semanal, histórico e alertas de uso. A demo pode simular conversão para moeda local e focar em confiança, comprovantes e controle familiar.",
    "tags": [
      "Stablecoins",
      "Família",
      "Consumo"
    ],
    "targetUser": "Famílias brasileiras com filhos estudando fora e intercambistas que precisam receber dinheiro com menos fricção e mais controle.",
    "painPoint": "Mandar dinheiro para quem está fora costuma misturar câmbio, comprovante e pouca visibilidade sobre quando o valor chegou ou como está sendo usado.",
    "cryptoAngle": "Stablecoin funciona como trilho rápido de remessa e o histórico onchain vira prova de envio, recebimento e saldo disponível.",
    "mvpScope": "O MVP pode ter cadastro do estudante, limite semanal, histórico e alertas de uso. A demo pode simular conversão para moeda local e focar em confiança, comprovantes e controle familiar.",
    "judgeHook": "E facil mostrar uma carteira simples para famílias enviarem stablecoins para estudantes fora do Brasil com controle de gastos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-005",
    "category": "Pagamentos",
    "title": "Caixinha onchain para vaquinhas transparentes",
    "description": "Uma vaquinha em que qualquer pessoa vê quanto entrou, quanto saiu e qual objetivo falta alcançar.",
    "details": "Construa uma página pública com meta, progresso, lista de doações, saídas aprovadas e comprovantes. Para começar, foque em uma causa pequena como formatura, evento de bairro ou campanha local.",
    "tags": [
      "Pagamentos",
      "Comunidade",
      "Transparência"
    ],
    "targetUser": "Comunidades locais, coletivos, turmas, ONGs pequenas e grupos organizando formatura, evento ou campanha.",
    "painPoint": "Vaquinhas quebram confiança quando ninguém sabe direito quanto entrou, quem sacou, o que já foi pago e o quanto falta para bater a meta.",
    "cryptoAngle": "A trilha onchain funciona como livro-caixa público: doação, saque e comprovante ficam verificáveis sem depender de confiança cega no organizador.",
    "mvpScope": "Página pública com meta, progresso, lista de doações, saídas aprovadas e comprovantes. Para o hackathon, basta um caso concreto como formatura, evento comunitário ou mutirão local.",
    "judgeHook": "Em poucos cliques dá para mostrar uma meta sendo financiada, o saldo subindo e cada saída ficando registrada de forma transparente para todo mundo.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Brilha quando a narrativa é específica, porque o jurado entende na hora por que transparência muda o comportamento dos apoiadores.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-006",
    "category": "Pagamentos",
    "title": "Assinatura em stablecoin para comunidades",
    "description": "Um sistema simples para comunidades cobrarem mensalidade e liberarem acesso a links, eventos ou conteúdos.",
    "details": "O MVP pode ter plano mensal, lista de membros ativos e badge de assinatura. Não precisa resolver cobrança recorrente perfeita no começo, basta detectar pagamentos e mostrar quem está em dia.",
    "tags": [
      "Comunidade",
      "Stablecoins",
      "Assinaturas"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode ter plano mensal, lista de membros ativos e badge de assinatura. Não precisa resolver cobrança recorrente perfeita no começo, basta detectar pagamentos e mostrar quem está em dia.",
    "judgeHook": "E facil mostrar um sistema simples para comunidades cobrarem mensalidade e liberarem acesso a links, eventos ou conteúdos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools",
      "community-growth"
    ]
  },
  {
    "id": "idea-007",
    "category": "Pagamentos",
    "title": "Recibo onchain para prestadores de serviço",
    "description": "Uma ferramenta simples para autônomos gerarem recibo com prova de pagamento e histórico organizado.",
    "details": "O time pode criar um fluxo com cliente, serviço, valor, status e recibo em PDF ou página pública. A camada onchain entra como prova do pagamento, sem exigir que o usuário entenda detalhes técnicos.",
    "tags": [
      "Pagamentos",
      "Serviços",
      "Brasil"
    ],
    "targetUser": "Diaristas, designers, devs, consultores e outros prestadores que vivem de serviços fechados por WhatsApp.",
    "painPoint": "Em serviços pequenos, tudo fica espalhado entre conversa, comprovante solto e anotação manual, o que vira atraso, dúvida e retrabalho na hora de cobrar.",
    "cryptoAngle": "O pagamento onchain vira uma âncora verificável para recibo, histórico e prova de quitação sem exigir ERP nem contabilidade sofisticada.",
    "mvpScope": "Cadastro de cliente, serviço e valor, geração de cobrança, status do pagamento e recibo em PDF ou página pública. O diferencial é ligar cada recibo a uma prova de pagamento.",
    "judgeHook": "A demo funciona bem porque o fluxo é familiar: criar serviço, receber, gerar recibo e mostrar a prova onchain por trás sem complicar a experiência.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima ideia para times que querem resolver um problema cotidiano com uma camada cripto discreta, mas impossível de ignorar na apresentação.",
    "featured": true,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-008",
    "category": "Pagamentos",
    "title": "Carteira de gorjetas para artistas de rua",
    "description": "Um QR code para artistas receberem gorjetas digitais e mostrarem uma meta do dia em tempo real.",
    "details": "O MVP pode gerar uma página com bio, meta, QR code e mural de apoiadores. A experiência deve parecer uma caixinha digital simples, usando stablecoin por trás e escondendo a complexidade da rede.",
    "tags": [
      "Creators",
      "Pagamentos",
      "Brasil"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "O MVP pode gerar uma página com bio, meta, QR code e mural de apoiadores. A experiência deve parecer uma caixinha digital simples, usando stablecoin por trás e escondendo a complexidade da rede.",
    "judgeHook": "E facil mostrar um QR code para artistas receberem gorjetas digitais e mostrarem uma meta do dia em tempo real. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-009",
    "category": "Pagamentos",
    "title": "Pagamento por tarefa para squads de hackathon",
    "description": "Um painel para dividir tarefas, marcar entregas e liberar pequenas recompensas para colaboradores.",
    "details": "Comece com tarefas, responsáveis, status e um botão de pagamento simbólico em USDC quando a tarefa for aprovada. É útil para comunidades que querem distribuir bounties pequenos sem uma operação pesada.",
    "tags": [
      "Bounties",
      "Comunidade",
      "Pagamentos"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com tarefas, responsáveis, status e um botão de pagamento simbólico em USDC quando a tarefa for aprovada. É útil para comunidades que querem distribuir bounties pequenos sem uma operação pesada.",
    "judgeHook": "E facil mostrar um painel para dividir tarefas, marcar entregas e liberar pequenas recompensas para colaboradores. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-010",
    "category": "Pagamentos",
    "title": "Carteira para vendedores de evento",
    "description": "Um app leve para vendedores receberem pagamentos digitais em feiras, meetups e hackathons.",
    "details": "O MVP pode ter catálogo de produtos, QR code por pedido e relatório de vendas. Para o hackathon, foque em uma experiência mobile simples e em comprovantes claros para comprador e vendedor.",
    "tags": [
      "Eventos",
      "Pagamentos",
      "Mobile"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode ter catálogo de produtos, QR code por pedido e relatório de vendas. Para o hackathon, foque em uma experiência mobile simples e em comprovantes claros para comprador e vendedor.",
    "judgeHook": "E facil mostrar um app leve para vendedores receberem pagamentos digitais em feiras, meetups e hackathons. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-051",
    "category": "Pagamentos",
    "title": "Conta conjunta para pequenos projetos",
    "description": "Uma carteira compartilhada para times acompanharem entradas, gastos e saldo de um projeto sem depender de uma pessoa só.",
    "details": "O MVP pode ter membros, permissões simples, lançamentos e histórico público. Para começar, simule aprovações por maioria e mostre o saldo em USDC e reais, com foco em transparência para squads pequenos.",
    "tags": [
      "Pagamentos",
      "Times",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode ter membros, permissões simples, lançamentos e histórico público. Para começar, simule aprovações por maioria e mostre o saldo em USDC e reais, com foco em transparência para squads pequenos.",
    "judgeHook": "E facil mostrar uma carteira compartilhada para times acompanharem entradas, gastos e saldo de um projeto sem depender de uma pessoa só. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-052",
    "category": "Pagamentos",
    "title": "Cobrança recorrente para aulas particulares",
    "description": "Um painel para professores cobrarem mensalidades, acompanharem alunos em dia e enviarem lembretes.",
    "details": "A primeira versão pode ter cadastro de alunos, planos, status de pagamento e mensagens prontas para WhatsApp. Use stablecoin como opção de pagamento para alunos internacionais ou famílias fora do Brasil.",
    "tags": [
      "Educação",
      "Pagamentos",
      "Brasil"
    ],
    "targetUser": "Estudantes, atléticas, centros acadêmicos e comunidades educacionais.",
    "painPoint": "Presença, arrecadação, benefícios e provas de participação em contextos estudantis ainda ficam espalhados em planilhas, grupos e formulários.",
    "cryptoAngle": "Registros verificáveis, pagamentos simples e badges ajudam a organizar participação e benefício sem transformar a experiência em algo técnico demais.",
    "mvpScope": "A primeira versão pode ter cadastro de alunos, planos, status de pagamento e mensagens prontas para WhatsApp. Use stablecoin como opção de pagamento para alunos internacionais ou famílias fora do Brasil.",
    "judgeHook": "E facil mostrar um painel para professores cobrarem mensalidades, acompanharem alunos em dia e enviarem lembretes. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-053",
    "category": "Pagamentos",
    "title": "Pagamento por conteúdo liberado aos poucos",
    "description": "Um fluxo onde o comprador paga e recebe acesso gradual a módulos, arquivos ou mentorias.",
    "details": "O MVP pode ter produto, módulos bloqueados, comprovante de pagamento e liberação manual ou automática. Serve para cursos, comunidades e consultorias, sem precisar criar uma plataforma de ensino completa.",
    "tags": [
      "Creators",
      "Pagamentos",
      "Educação"
    ],
    "targetUser": "Estudantes, atléticas, centros acadêmicos e comunidades educacionais.",
    "painPoint": "Presença, arrecadação, benefícios e provas de participação em contextos estudantis ainda ficam espalhados em planilhas, grupos e formulários.",
    "cryptoAngle": "Registros verificáveis, pagamentos simples e badges ajudam a organizar participação e benefício sem transformar a experiência em algo técnico demais.",
    "mvpScope": "O MVP pode ter produto, módulos bloqueados, comprovante de pagamento e liberação manual ou automática. Serve para cursos, comunidades e consultorias, sem precisar criar uma plataforma de ensino completa.",
    "judgeHook": "E facil mostrar um fluxo onde o comprador paga e recebe acesso gradual a módulos, arquivos ou mentorias. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-054",
    "category": "Pagamentos",
    "title": "Caixa de campanha para atléticas e centros acadêmicos",
    "description": "Uma página para arrecadar, registrar gastos e mostrar metas de campanhas estudantis.",
    "details": "Comece com meta, doações, despesas e prestação de contas. O produto pode ser útil para festas, viagens, eventos e materiais, deixando claro para todo mundo quanto entrou e para onde foi.",
    "tags": [
      "Estudantes",
      "Brasil",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com meta, doações, despesas e prestação de contas. O produto pode ser útil para festas, viagens, eventos e materiais, deixando claro para todo mundo quanto entrou e para onde foi.",
    "judgeHook": "E facil mostrar uma página para arrecadar, registrar gastos e mostrar metas de campanhas estudantis. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-055",
    "category": "Pagamentos",
    "title": "Escrow simples para serviços entre desconhecidos",
    "description": "Um intermediador de pagamento para freelas pequenos, onde o dinheiro fica bloqueado até a entrega ser aprovada.",
    "details": "O MVP pode criar acordos com descrição, valor, prazo, status e botão de liberar pagamento. Para evitar complexidade jurídica, apresente como uma ferramenta de confiança para projetos pequenos e entregas objetivas.",
    "tags": [
      "Pagamentos",
      "Freelancers",
      "Escrow"
    ],
    "targetUser": "Freelancers brasileiros e prestadores de serviço que precisam cobrar, receber e comprovar entrega.",
    "painPoint": "Cobrar clientes, registrar o combinado e provar pagamento ou entrega ainda gera atrito demais em operações pequenas.",
    "cryptoAngle": "Stablecoin e comprovantes onchain criam um fluxo mais claro de cobrança, quitação e prova sem exigir uma operação financeira pesada.",
    "mvpScope": "O MVP pode criar acordos com descrição, valor, prazo, status e botão de liberar pagamento. Para evitar complexidade jurídica, apresente como uma ferramenta de confiança para projetos pequenos e entregas objetivas.",
    "judgeHook": "E facil mostrar um intermediador de pagamento para freelas pequenos, onde o dinheiro fica bloqueado até a entrega ser aprovada. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tem uma história forte de problema real e cabe bem em um MVP enxuto com foco em UX.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-056",
    "category": "Pagamentos",
    "title": "Carteira de doações para streamers",
    "description": "Um painel para streamers receberem apoios, mostrar metas ao vivo e agradecer automaticamente.",
    "details": "Construa página de doação, feed de apoiadores e overlay simples para transmissão. O pagamento pode ser em stablecoin e a demo pode focar em como isso aparece para o público durante a live.",
    "tags": [
      "Criadores",
      "Pagamentos",
      "Social"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "Construa página de doação, feed de apoiadores e overlay simples para transmissão. O pagamento pode ser em stablecoin e a demo pode focar em como isso aparece para o público durante a live.",
    "judgeHook": "E facil mostrar um painel para streamers receberem apoios, mostrar metas ao vivo e agradecer automaticamente. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-057",
    "category": "Pagamentos",
    "title": "Nota de entrega para motoboys e entregadores",
    "description": "Um recibo digital simples que registra entrega, valor, gorjeta e confirmação do cliente.",
    "details": "O MVP pode ter cadastro da corrida, confirmação por link e histórico. A camada onchain pode funcionar como comprovante, mas o produto deve parecer uma ferramenta de trabalho rápida para celular.",
    "tags": [
      "Brasil",
      "Serviços",
      "Mobile"
    ],
    "targetUser": "Freelancers brasileiros e prestadores de serviço que precisam cobrar, receber e comprovar entrega.",
    "painPoint": "Cobrar clientes, registrar o combinado e provar pagamento ou entrega ainda gera atrito demais em operações pequenas.",
    "cryptoAngle": "Stablecoin e comprovantes onchain criam um fluxo mais claro de cobrança, quitação e prova sem exigir uma operação financeira pesada.",
    "mvpScope": "O MVP pode ter cadastro da corrida, confirmação por link e histórico. A camada onchain pode funcionar como comprovante, mas o produto deve parecer uma ferramenta de trabalho rápida para celular.",
    "judgeHook": "E facil mostrar um recibo digital simples que registra entrega, valor, gorjeta e confirmação do cliente. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Tem uma história forte de problema real e cabe bem em um MVP enxuto com foco em UX.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-058",
    "category": "Pagamentos",
    "title": "Pagamento em lote para comunidades",
    "description": "Um app para organizadores pagarem várias pessoas de uma vez depois de eventos, bounties ou tarefas.",
    "details": "Comece com upload de lista, revisão de valores e execução simulada ou real em stablecoin. O diferencial é reduzir erro operacional e criar um recibo claro para cada pessoa paga.",
    "tags": [
      "Pagamentos",
      "Comunidade",
      "Bounties"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com upload de lista, revisão de valores e execução simulada ou real em stablecoin. O diferencial é reduzir erro operacional e criar um recibo claro para cada pessoa paga.",
    "judgeHook": "E facil mostrar um app para organizadores pagarem várias pessoas de uma vez depois de eventos, bounties ou tarefas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-059",
    "category": "Pagamentos",
    "title": "Prêmios para torneios amadores",
    "description": "Uma ferramenta para organizar premiação de campeonatos pequenos com ranking e pagamento transparente.",
    "details": "O MVP pode ter cadastro do torneio, regras de premiação, placar manual e distribuição final. Funciona para games, futebol, xadrez, fantasy ou competições de comunidade.",
    "tags": [
      "Gaming",
      "Pagamentos",
      "Comunidade"
    ],
    "targetUser": "Comunidades, organizadores e grupos de amigos que querem experiências mais engajantes e recompensas mais visíveis.",
    "painPoint": "Experiências comunitárias perdem força quando participação, pontuação e recompensa ficam manuais ou se perdem depois do evento.",
    "cryptoAngle": "Badges, prêmios e histórico portável ajudam a dar persistência e identidade para a experiência sem matar a diversão.",
    "mvpScope": "O MVP pode ter cadastro do torneio, regras de premiação, placar manual e distribuição final. Funciona para games, futebol, xadrez, fantasy ou competições de comunidade.",
    "judgeHook": "E facil mostrar uma ferramenta para organizar premiação de campeonatos pequenos com ranking e pagamento transparente. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona no hackathon quando a camada lúdica já é divertida sozinha e o cripto entra como reforço visível.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-060",
    "category": "Pagamentos",
    "title": "Controle de caixa para eventos pop-up",
    "description": "Um painel para eventos de um dia acompanharem vendas, custos, repasses e lucro estimado.",
    "details": "Construa uma experiência mobile para registrar entradas e saídas em tempo real. A parte cripto pode entrar nos repasses finais entre organizadores, expositores e fornecedores.",
    "tags": [
      "Eventos",
      "Brasil",
      "Pagamentos"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Construa uma experiência mobile para registrar entradas e saídas em tempo real. A parte cripto pode entrar nos repasses finais entre organizadores, expositores e fornecedores.",
    "judgeHook": "E facil mostrar um painel para eventos de um dia acompanharem vendas, custos, repasses e lucro estimado. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-101",
    "category": "Pagamentos",
    "title": "Repasse automático para fornecedores de evento",
    "description": "Um painel para dividir a receita de um evento entre bar, produção, DJs, fotógrafos e organizadores.",
    "details": "O MVP pode receber uma receita total, cadastrar percentuais e gerar uma tela de repasses. A parte onchain pode registrar pagamentos em stablecoin, mas a primeira entrega deve resolver a confusão de planilhas e comprovantes.",
    "tags": [
      "Eventos",
      "Pagamentos",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode receber uma receita total, cadastrar percentuais e gerar uma tela de repasses. A parte onchain pode registrar pagamentos em stablecoin, mas a primeira entrega deve resolver a confusão de planilhas e comprovantes.",
    "judgeHook": "E facil mostrar um painel para dividir a receita de um evento entre bar, produção, DJs, fotógrafos e organizadores. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-102",
    "category": "Pagamentos",
    "title": "Carnê digital para compras parceladas pequenas",
    "description": "Uma ferramenta para lojistas acompanharem parcelas simples, vencimentos e comprovantes de pagamento.",
    "details": "Comece com cadastro de cliente, plano de parcelas, status e lembretes por WhatsApp. Use stablecoin apenas como uma opção de liquidação, mantendo o produto familiar para pequenos comércios.",
    "tags": [
      "Comércio local",
      "Brasil",
      "Pagamentos"
    ],
    "targetUser": "Usuários iniciantes e semi-iniciantes que já tocaram em cripto, mas ainda não entendem risco, custo ou estado da carteira.",
    "painPoint": "Mesmo quando o usuário quer avançar, ele esbarra em termos técnicos, risco pouco explicado e interfaces difíceis de comparar.",
    "cryptoAngle": "Dados onchain e sinais de protocolo deixam a explicação mais concreta e ajudam a transformar complexidade em orientação prática.",
    "mvpScope": "Comece com cadastro de cliente, plano de parcelas, status e lembretes por WhatsApp. Use stablecoin apenas como uma opção de liquidação, mantendo o produto familiar para pequenos comércios.",
    "judgeHook": "E facil mostrar uma ferramenta para lojistas acompanharem parcelas simples, vencimentos e comprovantes de pagamento. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Funciona melhor quando o produto explica, compara ou alerta sem prometer automação financeira pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-103",
    "category": "Pagamentos",
    "title": "Divisão de receita para colabs de criadores",
    "description": "Um app para criadores dividirem receita de um produto digital com designers, editores e parceiros.",
    "details": "O MVP pode cadastrar um produto, participantes e porcentagens. Depois de cada venda, o painel mostra quanto cada pessoa deve receber e gera repasses em stablecoin ou comprovantes manuais.",
    "tags": [
      "Criadores",
      "Pagamentos",
      "Colaboração"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "O MVP pode cadastrar um produto, participantes e porcentagens. Depois de cada venda, o painel mostra quanto cada pessoa deve receber e gera repasses em stablecoin ou comprovantes manuais.",
    "judgeHook": "E facil mostrar um app para criadores dividirem receita de um produto digital com designers, editores e parceiros. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-104",
    "category": "Pagamentos",
    "title": "Conta de viagem para nômades brasileiros",
    "description": "Um controle simples para quem trabalha remoto e viaja, com gastos em várias moedas e saldo em stablecoin.",
    "details": "Comece com registro de despesas, conversão aproximada para reais e dólares, e metas mensais. A camada cripto pode ajudar a simular reserva internacional sem depender de banco local.",
    "tags": [
      "Stablecoins",
      "Viagem",
      "Brasil"
    ],
    "targetUser": "Founders, creators e pequenos operadores que precisam cobrar, receber ou repassar dinheiro com clareza.",
    "painPoint": "Cobrança, comprovação e conciliação ainda quebram o fluxo com links soltos, mensagens manuais e pouca transparência.",
    "cryptoAngle": "Stablecoins e recibos onchain deixam pagamento, prova e repasse mais visíveis sem exigir um backoffice pesado.",
    "mvpScope": "Comece com registro de despesas, conversão aproximada para reais e dólares, e metas mensais. A camada cripto pode ajudar a simular reserva internacional sem depender de banco local.",
    "judgeHook": "E facil mostrar um controle simples para quem trabalha remoto e viaja, com gastos em várias moedas e saldo em stablecoin. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta para times iniciantes porque a história de produto é muito clara e a demo aparece rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-105",
    "category": "Pagamentos",
    "title": "Pagamento com QR para barracas de feira",
    "description": "Um fluxo mobile para vendedores de feira cobrarem por QR code e acompanharem pedidos do dia.",
    "details": "O MVP pode ter catálogo simples, carrinho, QR de pagamento e resumo de vendas. A interface precisa funcionar rápido no celular e falar a linguagem de quem vende presencialmente.",
    "tags": [
      "Comércio local",
      "Mobile",
      "Brasil"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode ter catálogo simples, carrinho, QR de pagamento e resumo de vendas. A interface precisa funcionar rápido no celular e falar a linguagem de quem vende presencialmente.",
    "judgeHook": "E facil mostrar um fluxo mobile para vendedores de feira cobrarem por QR code e acompanharem pedidos do dia. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-106",
    "category": "Pagamentos",
    "title": "Doação recorrente para ONGs pequenas",
    "description": "Uma página de doação com metas mensais, histórico público e mensagens para apoiadores.",
    "details": "Comece com planos de apoio, painel de doadores e prestação de contas. A recorrência pode ser simulada no MVP com lembretes mensais e confirmação manual de pagamento.",
    "tags": [
      "Impacto",
      "Pagamentos",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com planos de apoio, painel de doadores e prestação de contas. A recorrência pode ser simulada no MVP com lembretes mensais e confirmação manual de pagamento.",
    "judgeHook": "E facil mostrar uma página de doação com metas mensais, histórico público e mensagens para apoiadores. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-107",
    "category": "Pagamentos",
    "title": "Comprovante compartilhável para pagamentos em cripto",
    "description": "Uma página bonita que transforma uma transação em um comprovante simples para enviar a clientes ou amigos.",
    "details": "O MVP pode receber assinatura da transação, buscar dados básicos e gerar um recibo com valor, data, remetente e destinatário. Foque em confiança e legibilidade.",
    "tags": [
      "Pagamentos",
      "UX",
      "Brasil"
    ],
    "targetUser": "Founders, creators e pequenos operadores que precisam cobrar, receber ou repassar dinheiro com clareza.",
    "painPoint": "Cobrança, comprovação e conciliação ainda quebram o fluxo com links soltos, mensagens manuais e pouca transparência.",
    "cryptoAngle": "Stablecoins e recibos onchain deixam pagamento, prova e repasse mais visíveis sem exigir um backoffice pesado.",
    "mvpScope": "O MVP pode receber assinatura da transação, buscar dados básicos e gerar um recibo com valor, data, remetente e destinatário. Foque em confiança e legibilidade.",
    "judgeHook": "E facil mostrar uma página bonita que transforma uma transação em um comprovante simples para enviar a clientes ou amigos. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta para times iniciantes porque a história de produto é muito clara e a demo aparece rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-108",
    "category": "Pagamentos",
    "title": "Gestão de caixa para comunidades de bairro",
    "description": "Um caixa transparente para grupos locais cuidarem de vaquinhas, eventos e compras coletivas.",
    "details": "Comece com entradas, saídas, responsáveis e anexos. A parte onchain pode registrar saldos e doações importantes, mas a UX deve lembrar um extrato simples.",
    "tags": [
      "Comunidade",
      "Brasil",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com entradas, saídas, responsáveis e anexos. A parte onchain pode registrar saldos e doações importantes, mas a UX deve lembrar um extrato simples.",
    "judgeHook": "E facil mostrar um caixa transparente para grupos locais cuidarem de vaquinhas, eventos e compras coletivas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-109",
    "category": "Pagamentos",
    "title": "Pagamento por presença em pesquisa de campo",
    "description": "Um app para pesquisadores pagarem participantes de entrevistas, testes ou coletas de dados.",
    "details": "O MVP pode ter cadastro de sessão, check-in, consentimento básico e pagamento final. Serve para universidades, startups e comunidades que fazem pesquisa com incentivos pequenos.",
    "tags": [
      "Pesquisa",
      "Pagamentos",
      "Educação"
    ],
    "targetUser": "Comunidades locais, cooperativas, condomínios e operadores que precisam provar dados ou impacto no território.",
    "painPoint": "Quando o dado nasce no mundo físico, ainda é difícil provar origem, frequência e confiança sem processos manuais.",
    "cryptoAngle": "Registros verificáveis e recompensas simples ajudam a mostrar contribuição e histórico com mais transparência.",
    "mvpScope": "O MVP pode ter cadastro de sessão, check-in, consentimento básico e pagamento final. Serve para universidades, startups e comunidades que fazem pesquisa com incentivos pequenos.",
    "judgeHook": "E facil mostrar um app para pesquisadores pagarem participantes de entrevistas, testes ou coletas de dados. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "stretch",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Só é uma boa aposta se o time recortar bem o caso de uso e focar na prova de valor, não em infraestrutura pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-110",
    "category": "Pagamentos",
    "title": "Vale-presente em stablecoin para amigos",
    "description": "Uma experiência simples para mandar um valor de presente com mensagem, tema e resgate guiado.",
    "details": "Comece com criação do vale, link de resgate e tela explicando como usar. O foco é tornar o primeiro contato com stablecoin mais emocional e menos técnico.",
    "tags": [
      "Stablecoins",
      "Consumo",
      "Onboarding"
    ],
    "targetUser": "Founders, creators e pequenos operadores que precisam cobrar, receber ou repassar dinheiro com clareza.",
    "painPoint": "Cobrança, comprovação e conciliação ainda quebram o fluxo com links soltos, mensagens manuais e pouca transparência.",
    "cryptoAngle": "Stablecoins e recibos onchain deixam pagamento, prova e repasse mais visíveis sem exigir um backoffice pesado.",
    "mvpScope": "Comece com criação do vale, link de resgate e tela explicando como usar. O foco é tornar o primeiro contato com stablecoin mais emocional e menos técnico.",
    "judgeHook": "E facil mostrar uma experiência simples para mandar um valor de presente com mensagem, tema e resgate guiado. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta para times iniciantes porque a história de produto é muito clara e a demo aparece rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-151",
    "category": "Pagamentos",
    "title": "Cofre para metas de viagem em grupo",
    "description": "Uma caixinha transparente onde amigos guardam dinheiro para uma viagem e acompanham o progresso de cada pessoa.",
    "details": "O MVP pode ter grupo, meta, contribuições e gastos previstos. Use stablecoin como saldo digital e mostre tudo em reais para a experiência ficar familiar.",
    "tags": [
      "Pagamentos",
      "Viagem",
      "Brasil"
    ],
    "targetUser": "Founders, creators e pequenos operadores que precisam cobrar, receber ou repassar dinheiro com clareza.",
    "painPoint": "Cobrança, comprovação e conciliação ainda quebram o fluxo com links soltos, mensagens manuais e pouca transparência.",
    "cryptoAngle": "Stablecoins e recibos onchain deixam pagamento, prova e repasse mais visíveis sem exigir um backoffice pesado.",
    "mvpScope": "O MVP pode ter grupo, meta, contribuições e gastos previstos. Use stablecoin como saldo digital e mostre tudo em reais para a experiência ficar familiar.",
    "judgeHook": "E facil mostrar uma caixinha transparente onde amigos guardam dinheiro para uma viagem e acompanham o progresso de cada pessoa. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Boa aposta para times iniciantes porque a história de produto é muito clara e a demo aparece rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly"
    ]
  },
  {
    "id": "idea-152",
    "category": "Pagamentos",
    "title": "Repasse para artistas em eventos colaborativos",
    "description": "Um painel para dividir a bilheteria entre artistas, produtores e fornecedores depois de um evento.",
    "details": "Comece com receita total, custos, percentuais e recibos. O diferencial é transparência para eventos pequenos, onde confiança costuma depender de prints e planilhas soltas.",
    "tags": [
      "Eventos",
      "Cultura",
      "Pagamentos"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com receita total, custos, percentuais e recibos. O diferencial é transparência para eventos pequenos, onde confiança costuma depender de prints e planilhas soltas.",
    "judgeHook": "E facil mostrar um painel para dividir a bilheteria entre artistas, produtores e fornecedores depois de um evento. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-153",
    "category": "Pagamentos",
    "title": "Pagamento para aulas avulsas online",
    "description": "Um link de pagamento para professores venderem aulas avulsas com confirmação automática para o aluno.",
    "details": "O MVP pode criar aula, horário, valor e link de pagamento. Depois do pagamento, gere confirmação, link de reunião e recibo simples para WhatsApp ou email.",
    "tags": [
      "Educação",
      "Pagamentos",
      "Serviços"
    ],
    "targetUser": "Estudantes, atléticas, centros acadêmicos e comunidades educacionais.",
    "painPoint": "Presença, arrecadação, benefícios e provas de participação em contextos estudantis ainda ficam espalhados em planilhas, grupos e formulários.",
    "cryptoAngle": "Registros verificáveis, pagamentos simples e badges ajudam a organizar participação e benefício sem transformar a experiência em algo técnico demais.",
    "mvpScope": "O MVP pode criar aula, horário, valor e link de pagamento. Depois do pagamento, gere confirmação, link de reunião e recibo simples para WhatsApp ou email.",
    "judgeHook": "E facil mostrar um link de pagamento para professores venderem aulas avulsas com confirmação automática para o aluno. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Muito bom para times iniciantes porque a dor é familiar e o recorte pode ficar bem pequeno.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-154",
    "category": "Pagamentos",
    "title": "Conta de patrocínio para newsletters",
    "description": "Uma ferramenta para newsletters receberem patrocínios pequenos e mostrarem entregas combinadas.",
    "details": "Comece com proposta de patrocínio, status de pagamento e checklist de entregas. A stablecoin pode simplificar patrocínios internacionais para criadores brasileiros.",
    "tags": [
      "Criadores",
      "Pagamentos",
      "B2B"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "Comece com proposta de patrocínio, status de pagamento e checklist de entregas. A stablecoin pode simplificar patrocínios internacionais para criadores brasileiros.",
    "judgeHook": "E facil mostrar uma ferramenta para newsletters receberem patrocínios pequenos e mostrarem entregas combinadas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-155",
    "category": "Pagamentos",
    "title": "Adiantamento simples para recebíveis de criadores",
    "description": "Um simulador para criadores entenderem quanto poderiam adiantar de receitas futuras sem se perder em planilhas.",
    "details": "O MVP pode ser educativo: receita esperada, taxa, prazo e cenário de pagamento. Não precisa liberar crédito real; a entrega pode ser uma simulação clara e responsável.",
    "tags": [
      "Criadores",
      "Finanças",
      "Brasil"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "O MVP pode ser educativo: receita esperada, taxa, prazo e cenário de pagamento. Não precisa liberar crédito real; a entrega pode ser uma simulação clara e responsável.",
    "judgeHook": "E facil mostrar um simulador para criadores entenderem quanto poderiam adiantar de receitas futuras sem se perder em planilhas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-156",
    "category": "Pagamentos",
    "title": "Controle de repasses para afiliados",
    "description": "Um painel para produtos digitais acompanharem vendas por afiliado e repasses pendentes.",
    "details": "Comece com links de afiliado, vendas simuladas, comissão e status de pagamento. A camada onchain pode registrar repasses finais em stablecoin.",
    "tags": [
      "Criadores",
      "Pagamentos",
      "Crescimento"
    ],
    "targetUser": "Creators brasileiros, comunidades de fãs e pequenos produtores digitais.",
    "painPoint": "Monetizar, testar demanda e provar apoio do público ainda depende de ferramentas espalhadas e pouca visibilidade sobre quem pagou ou participou.",
    "cryptoAngle": "Pagamentos em stablecoin, badges ou registros verificáveis deixam o apoio mais visível e mais fácil de transformar em experiência ou acesso.",
    "mvpScope": "Comece com links de afiliado, vendas simuladas, comissão e status de pagamento. A camada onchain pode registrar repasses finais em stablecoin.",
    "judgeHook": "E facil mostrar um painel para produtos digitais acompanharem vendas por afiliado e repasses pendentes. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Ótima linha para hackathon porque conecta dor real, demo curta e um toque cripto que jurados entendem rápido.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "creator-tools"
    ]
  },
  {
    "id": "idea-157",
    "category": "Pagamentos",
    "title": "Conta para grupos de compra coletiva",
    "description": "Um app para grupos comprarem juntos, acompanharem quem pagou e fecharem pedido quando a meta bater.",
    "details": "O MVP pode ter produto, preço por pessoa, quantidade mínima e status de pagamento. Funciona para compras de bairro, comunidades universitárias e grupos de amigos.",
    "tags": [
      "Consumo",
      "Brasil",
      "Pagamentos"
    ],
    "targetUser": "Comunidades locais, cooperativas, condomínios e operadores que precisam provar dados ou impacto no território.",
    "painPoint": "Quando o dado nasce no mundo físico, ainda é difícil provar origem, frequência e confiança sem processos manuais.",
    "cryptoAngle": "Registros verificáveis e recompensas simples ajudam a mostrar contribuição e histórico com mais transparência.",
    "mvpScope": "O MVP pode ter produto, preço por pessoa, quantidade mínima e status de pagamento. Funciona para compras de bairro, comunidades universitárias e grupos de amigos.",
    "judgeHook": "E facil mostrar um app para grupos comprarem juntos, acompanharem quem pagou e fecharem pedido quando a meta bater. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "stretch",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Só é uma boa aposta se o time recortar bem o caso de uso e focar na prova de valor, não em infraestrutura pesada.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-158",
    "category": "Pagamentos",
    "title": "Vale-alimentação comunitário",
    "description": "Um sistema simples para distribuir créditos de alimentação em eventos, mutirões ou ações sociais.",
    "details": "Comece com emissão de créditos, QR code de resgate e painel do organizador. A demo pode simular estabelecimentos parceiros e comprovantes de uso.",
    "tags": [
      "Impacto",
      "Pagamentos",
      "Comunidade"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "Comece com emissão de créditos, QR code de resgate e painel do organizador. A demo pode simular estabelecimentos parceiros e comprovantes de uso.",
    "judgeHook": "E facil mostrar um sistema simples para distribuir créditos de alimentação em eventos, mutirões ou ações sociais. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-159",
    "category": "Pagamentos",
    "title": "Rifa transparente para causas locais",
    "description": "Uma rifa digital com números, comprovantes, sorteio transparente e prestação de contas.",
    "details": "O MVP pode cadastrar causa, números disponíveis, pagamentos e sorteio. Foque em clareza, regras e transparência, evitando parecer uma aposta sem contexto.",
    "tags": [
      "Comunidade",
      "Brasil",
      "Transparência"
    ],
    "targetUser": "Coletivos, comunidades e pequenos times que precisam decidir, organizar verba e prestar contas com clareza.",
    "painPoint": "Sem um fluxo claro, decisões e orçamento ficam espalhados e enfraquecem a confiança entre participantes, apoiadores e parceiros.",
    "cryptoAngle": "Registros verificáveis e comprovantes públicos ajudam a mostrar governança e transparência com um nível de confiança maior.",
    "mvpScope": "O MVP pode cadastrar causa, números disponíveis, pagamentos e sorteio. Foque em clareza, regras e transparência, evitando parecer uma aposta sem contexto.",
    "judgeHook": "E facil mostrar uma rifa digital com números, comprovantes, sorteio transparente e prestação de contas. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 2,
    "confidenceNote": "Fica especialmente forte quando a demo mostra entradas, saídas, decisão e prova em uma única história.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-160",
    "category": "Pagamentos",
    "title": "Carteira de repasses para coletivos culturais",
    "description": "Uma ferramenta para coletivos culturais dividirem cachês, custos e apoios de forma transparente.",
    "details": "O MVP pode ter projeto, participantes, entradas, custos e repasses finais. É uma ideia boa para música, audiovisual, eventos independentes e produção cultural.",
    "tags": [
      "Cultura",
      "Pagamentos",
      "Brasil"
    ],
    "targetUser": "Organizadores de eventos, comunidades e squads de hackathon.",
    "painPoint": "Entrada, presença, coordenação e recompensas de evento ainda costumam depender de processos manuais e pouca rastreabilidade.",
    "cryptoAngle": "QR codes, badges, pagamentos ou provas onchain tornam presença e recompensa mais visíveis sem complicar a jornada principal.",
    "mvpScope": "O MVP pode ter projeto, participantes, entradas, custos e repasses finais. É uma ideia boa para música, audiovisual, eventos independentes e produção cultural.",
    "judgeHook": "E facil mostrar uma ferramenta para coletivos culturais dividirem cachês, custos e apoios de forma transparente. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 3,
    "cryptoScore": 3,
    "confidenceNote": "Costuma render uma demo forte porque o fluxo de evento é fácil de entender em poucos segundos.",
    "featured": false,
    "editorialTracks": [
      "beginner-friendly",
      "real-world-payments",
      "demo-friendly",
      "community-growth"
    ]
  }
];
