import type { CuratedIdea } from "./types";

export const INFRA_IDEAS: CuratedIdea[] = [
  {
    "id": "idea-041",
    "category": "Infra",
    "title": "Postman para programas Solana",
    "description": "Uma interface visual para testar instruções de programas Solana sem escrever scripts do zero.",
    "details": "O MVP pode carregar um IDL, listar métodos, preencher parâmetros e simular uma chamada. É inspirado em ferramentas vencedoras de developer tooling, mas com escopo bem direto para hackathon.",
    "tags": [
      "Dev tools",
      "Solana",
      "Infra"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode carregar um IDL, listar métodos, preencher parâmetros e simular uma chamada. É inspirado em ferramentas vencedoras de developer tooling, mas com escopo bem direto para hackathon.",
    "judgeHook": "E facil mostrar uma interface visual para testar instruções de programas Solana sem escrever scripts do zero. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-042",
    "category": "Infra",
    "title": "Explorador de erros de transação",
    "description": "Um app que cola uma assinatura de transação e explica por que ela falhou.",
    "details": "Comece com input de assinatura, busca em RPC ou dados mockados e explicação em português. O valor está em traduzir logs técnicos para uma causa provável e uma sugestão de correção.",
    "tags": [
      "Dev tools",
      "Debug",
      "Solana"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com input de assinatura, busca em RPC ou dados mockados e explicação em português. O valor está em traduzir logs técnicos para uma causa provável e uma sugestão de correção.",
    "judgeHook": "E facil mostrar um app que cola uma assinatura de transação e explica por que ela falhou. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-043",
    "category": "Infra",
    "title": "Painel de saúde para dApps pequenos",
    "description": "Um monitor simples de transações, erros e atividade para times que acabaram de lançar um app.",
    "details": "O MVP pode receber um endereço de programa, mostrar eventos recentes e alertar quando algo falha. Não precisa virar Datadog, basta responder: está funcionando ou não?",
    "tags": [
      "Infra",
      "Monitoring",
      "Dev tools"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode receber um endereço de programa, mostrar eventos recentes e alertar quando algo falha. Não precisa virar Datadog, basta responder: está funcionando ou não?",
    "judgeHook": "E facil mostrar um monitor simples de transações, erros e atividade para times que acabaram de lançar um app. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-044",
    "category": "Infra",
    "title": "Gerador de documentação para contratos",
    "description": "Uma ferramenta que transforma IDL, README ou código em uma documentação simples para integradores.",
    "details": "O time pode subir um arquivo, extrair métodos e gerar exemplos em TypeScript. É uma boa ideia para vibecoding porque boa parte do valor está em interface e geração assistida.",
    "tags": [
      "Dev tools",
      "AI",
      "Docs"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O time pode subir um arquivo, extrair métodos e gerar exemplos em TypeScript. É uma boa ideia para vibecoding porque boa parte do valor está em interface e geração assistida.",
    "judgeHook": "E facil mostrar uma ferramenta que transforma IDL, README ou código em uma documentação simples para integradores. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-045",
    "category": "Infra",
    "title": "Carteira de teste para desenvolvedores",
    "description": "Uma wallet focada em devnet/localnet com logs, troca rápida de rede e visualização de transações.",
    "details": "O MVP pode simular ou implementar funções básicas: trocar cluster, pedir airdrop, assinar transação e mostrar logs. O público são devs que querem debugar sem abrir cinco ferramentas.",
    "tags": [
      "Wallet",
      "Dev tools",
      "Solana"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode simular ou implementar funções básicas: trocar cluster, pedir airdrop, assinar transação e mostrar logs. O público são devs que querem debugar sem abrir cinco ferramentas.",
    "judgeHook": "E facil mostrar uma wallet focada em devnet/localnet com logs, troca rápida de rede e visualização de transações. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-091",
    "category": "Infra",
    "title": "Gerador de playground para contratos",
    "description": "Uma ferramenta que cria uma interface simples para testar funções de um contrato a partir de um arquivo de descrição.",
    "details": "O MVP pode aceitar um IDL, gerar campos de formulário e mostrar resultado da chamada. Isso ajuda projetos a criarem demos sem gastar tempo em interface do zero.",
    "tags": [
      "Dev tools",
      "Solana",
      "Infra"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode aceitar um IDL, gerar campos de formulário e mostrar resultado da chamada. Isso ajuda projetos a criarem demos sem gastar tempo em interface do zero.",
    "judgeHook": "E facil mostrar uma ferramenta que cria uma interface simples para testar funções de um contrato a partir de um arquivo de descrição. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-092",
    "category": "Infra",
    "title": "Monitor de RPC para times pequenos",
    "description": "Um painel que compara latência, erro e estabilidade de endpoints usados por um dApp.",
    "details": "Comece com poucos endpoints, testes periódicos e alertas visuais. A demo pode mostrar como uma falha de RPC impacta o usuário final.",
    "tags": [
      "Infra",
      "Monitoring",
      "Solana"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com poucos endpoints, testes periódicos e alertas visuais. A demo pode mostrar como uma falha de RPC impacta o usuário final.",
    "judgeHook": "E facil mostrar um painel que compara latência, erro e estabilidade de endpoints usados por um dApp. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "trust-and-proof"
    ]
  },
  {
    "id": "idea-093",
    "category": "Infra",
    "title": "Visualizador de contas de programa",
    "description": "Uma interface para explorar contas de um programa Solana e entender seus dados sem escrever script.",
    "details": "O MVP pode aceitar program id, listar contas e mostrar campos decodificados quando houver IDL. Mesmo uma versão parcial já ajuda devs a depurar mais rápido.",
    "tags": [
      "Dev tools",
      "Debug",
      "Solana"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode aceitar program id, listar contas e mostrar campos decodificados quando houver IDL. Mesmo uma versão parcial já ajuda devs a depurar mais rápido.",
    "judgeHook": "E facil mostrar uma interface para explorar contas de um programa Solana e entender seus dados sem escrever script. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-094",
    "category": "Infra",
    "title": "Checklist de segurança antes do deploy",
    "description": "Uma ferramenta que guia times por checagens básicas antes de publicar um programa ou app.",
    "details": "Comece com checklist interativo, explicações e geração de relatório. Pode incluir permissões, chaves, variáveis, upgrade authority, links públicos e plano de rollback.",
    "tags": [
      "Segurança",
      "Dev tools",
      "Hackathon"
    ],
    "targetUser": "Comunidades, organizadores e grupos de amigos que querem experiências mais engajantes e recompensas mais visíveis.",
    "painPoint": "Experiências comunitárias perdem força quando participação, pontuação e recompensa ficam manuais ou se perdem depois do evento.",
    "cryptoAngle": "Badges, prêmios e histórico portável ajudam a dar persistência e identidade para a experiência sem matar a diversão.",
    "mvpScope": "Comece com checklist interativo, explicações e geração de relatório. Pode incluir permissões, chaves, variáveis, upgrade authority, links públicos e plano de rollback.",
    "judgeHook": "E facil mostrar uma ferramenta que guia times por checagens básicas antes de publicar um programa ou app. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona no hackathon quando a camada lúdica já é divertida sozinha e o cripto entra como reforço visível.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth",
      "trust-and-proof",
      "beginner-friendly"
    ]
  },
  {
    "id": "idea-095",
    "category": "Infra",
    "title": "Página de status para projetos de hackathon",
    "description": "Uma status page simples para mostrar se app, API, RPC e contrato estão funcionando durante a demo.",
    "details": "O MVP pode ter checks manuais ou automáticos, histórico curto e mensagem pública. É útil para times evitarem surpresa na apresentação e mostrarem maturidade.",
    "tags": [
      "Infra",
      "Monitoring",
      "Demo"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode ter checks manuais ou automáticos, histórico curto e mensagem pública. É útil para times evitarem surpresa na apresentação e mostrarem maturidade.",
    "judgeHook": "E facil mostrar uma status page simples para mostrar se app, API, RPC e contrato estão funcionando durante a demo. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-141",
    "category": "Infra",
    "title": "Gerador de dados fictícios para demos",
    "description": "Uma ferramenta que cria dados realistas para dashboards, carteiras, transações e usuários de um projeto.",
    "details": "O MVP pode ter templates por tipo de app e exportar JSON. Isso ajuda times a construir demos bonitas antes de integrarem dados reais.",
    "tags": [
      "Dev tools",
      "Demo",
      "Produtividade"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode ter templates por tipo de app e exportar JSON. Isso ajuda times a construir demos bonitas antes de integrarem dados reais.",
    "judgeHook": "E facil mostrar uma ferramenta que cria dados realistas para dashboards, carteiras, transações e usuários de um projeto. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-142",
    "category": "Infra",
    "title": "Validador de links de projeto",
    "description": "Um checklist automático que verifica se demo, repositório, apresentação e redes sociais estão funcionando.",
    "details": "Comece com uma URL do projeto e rode checks simples de status, metadados e screenshots. Muito útil antes de submissão em hackathon.",
    "tags": [
      "Hackathon",
      "Dev tools",
      "QA"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com uma URL do projeto e rode checks simples de status, metadados e screenshots. Muito útil antes de submissão em hackathon.",
    "judgeHook": "E facil mostrar um checklist automático que verifica se demo, repositório, apresentação e redes sociais estão funcionando. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-143",
    "category": "Infra",
    "title": "Explorador de eventos de programa",
    "description": "Uma tela para acompanhar eventos emitidos por um programa e filtrar por tipo ou usuário.",
    "details": "O MVP pode receber program id, mostrar eventos recentes e permitir busca. Se dados reais forem difíceis, comece com mock e estrutura pronta para conectar depois.",
    "tags": [
      "Solana",
      "Monitoring",
      "Dev tools"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode receber program id, mostrar eventos recentes e permitir busca. Se dados reais forem difíceis, comece com mock e estrutura pronta para conectar depois.",
    "judgeHook": "E facil mostrar uma tela para acompanhar eventos emitidos por um programa e filtrar por tipo ou usuário. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-144",
    "category": "Infra",
    "title": "Gerador de SDK mínimo",
    "description": "Uma ferramenta que cria funções TypeScript básicas para interagir com um programa a partir de uma descrição.",
    "details": "O MVP pode gerar arquivos de cliente, exemplos e instruções de uso. O valor está em acelerar integrações durante hackathons e reduzir código repetitivo.",
    "tags": [
      "Dev tools",
      "Solana",
      "TypeScript"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode gerar arquivos de cliente, exemplos e instruções de uso. O valor está em acelerar integrações durante hackathons e reduzir código repetitivo.",
    "judgeHook": "E facil mostrar uma ferramenta que cria funções TypeScript básicas para interagir com um programa a partir de uma descrição. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-145",
    "category": "Infra",
    "title": "Painel de logs para demos ao vivo",
    "description": "Uma tela bonita que mostra ações do usuário, chamadas de API e transações durante uma apresentação.",
    "details": "Comece com uma biblioteca pequena de eventos e um painel em tempo real. Ajuda jurados a entenderem o que está acontecendo sem abrir console ou explorer.",
    "tags": [
      "Demo",
      "Monitoring",
      "Hackathon"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com uma biblioteca pequena de eventos e um painel em tempo real. Ajuda jurados a entenderem o que está acontecendo sem abrir console ou explorer.",
    "judgeHook": "E facil mostrar uma tela bonita que mostra ações do usuário, chamadas de API e transações durante uma apresentação. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-191",
    "category": "Infra",
    "title": "Gerador de ambiente de demo",
    "description": "Uma ferramenta que cria variáveis, dados simulados e instruções para rodar uma demo sem depender de produção.",
    "details": "O MVP pode gerar um checklist e arquivos de exemplo. O valor é ajudar times a apresentarem algo estável, mesmo quando a integração final ainda está frágil.",
    "tags": [
      "Demo",
      "Dev tools",
      "Hackathon"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode gerar um checklist e arquivos de exemplo. O valor é ajudar times a apresentarem algo estável, mesmo quando a integração final ainda está frágil.",
    "judgeHook": "E facil mostrar uma ferramenta que cria variáveis, dados simulados e instruções para rodar uma demo sem depender de produção. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  },
  {
    "id": "idea-192",
    "category": "Infra",
    "title": "Comparador de exploradores Solana",
    "description": "Uma página que abre a mesma transação ou endereço em diferentes exploradores e destaca diferenças de leitura.",
    "details": "Comece com input de assinatura ou endereço e links para exploradores. Adicione resumo próprio em português para ajudar iniciantes e jurados.",
    "tags": [
      "Solana",
      "Dev tools",
      "UX"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com input de assinatura ou endereço e links para exploradores. Adicione resumo próprio em português para ajudar iniciantes e jurados.",
    "judgeHook": "E facil mostrar uma página que abre a mesma transação ou endereço em diferentes exploradores e destaca diferenças de leitura. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-193",
    "category": "Infra",
    "title": "Validador de metadados de projeto",
    "description": "Um checklist que confere nome, descrição, links, imagens e redes antes da submissão de um projeto.",
    "details": "O MVP pode validar URLs, tamanhos de imagem e presença de campos obrigatórios. É simples, mas evita submissões quebradas em hackathons.",
    "tags": [
      "Hackathon",
      "QA",
      "Dev tools"
    ],
    "targetUser": "Comunidades, organizadores e grupos de amigos que querem experiências mais engajantes e recompensas mais visíveis.",
    "painPoint": "Experiências comunitárias perdem força quando participação, pontuação e recompensa ficam manuais ou se perdem depois do evento.",
    "cryptoAngle": "Badges, prêmios e histórico portável ajudam a dar persistência e identidade para a experiência sem matar a diversão.",
    "mvpScope": "O MVP pode validar URLs, tamanhos de imagem e presença de campos obrigatórios. É simples, mas evita submissões quebradas em hackathons.",
    "judgeHook": "E facil mostrar um checklist que confere nome, descrição, links, imagens e redes antes da submissão de um projeto. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "easy",
    "painScore": 2,
    "cryptoScore": 2,
    "confidenceNote": "Funciona no hackathon quando a camada lúdica já é divertida sozinha e o cripto entra como reforço visível.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth",
      "beginner-friendly"
    ]
  },
  {
    "id": "idea-194",
    "category": "Infra",
    "title": "Painel de erros comuns em Anchor",
    "description": "Uma biblioteca pesquisável de erros comuns em Anchor e Solana com explicações curtas em português.",
    "details": "Comece com erros manuais, busca e exemplos de correção. Depois, o usuário pode colar logs e receber uma sugestão provável.",
    "tags": [
      "Solana",
      "Educação",
      "Dev tools"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "Comece com erros manuais, busca e exemplos de correção. Depois, o usuário pode colar logs e receber uma sugestão provável.",
    "judgeHook": "E facil mostrar uma biblioteca pesquisável de erros comuns em Anchor e Solana com explicações curtas em português. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly"
    ]
  },
  {
    "id": "idea-195",
    "category": "Infra",
    "title": "Gerador de página pública para APIs",
    "description": "Uma ferramenta que transforma endpoints de uma API em documentação visual e testável.",
    "details": "O MVP pode aceitar JSON ou OpenAPI, gerar lista de endpoints e exemplos. Times de hackathon ganham uma página de integração sem escrever documentação manualmente.",
    "tags": [
      "Docs",
      "Dev tools",
      "API"
    ],
    "targetUser": "Builders e times técnicos que querem ganhar tempo de integração, debug ou documentação.",
    "painPoint": "Mesmo equipes boas desperdiçam horas com logs obscuros, integrações manuais e documentação fraca durante hackathons.",
    "cryptoAngle": "Ferramentas específicas para Solana tornam a camada técnica mais legível e mais fácil de demonstrar como ganho real de produtividade.",
    "mvpScope": "O MVP pode aceitar JSON ou OpenAPI, gerar lista de endpoints e exemplos. Times de hackathon ganham uma página de integração sem escrever documentação manualmente.",
    "judgeHook": "E facil mostrar uma ferramenta que transforma endpoints de uma API em documentação visual e testável. em uma demo curta, com uma camada cripto visivel que reforca o valor do produto.",
    "buildScore": "medium",
    "painScore": 2,
    "cryptoScore": 3,
    "confidenceNote": "Vale manter quando a entrega economiza tempo real e o antes/depois da demo fica muito nítido.",
    "featured": false,
    "editorialTracks": [
      "demo-friendly",
      "community-growth"
    ]
  }
];
