export interface CuratedIdea {
  id: string;
  category: string;
  title: string;
  description: string;
  details: string;
  tags: string[];
}

export const CURATED_IDEAS: CuratedIdea[] = [
  {
    id: "idea-001",
    category: "Pagamentos",
    title: "Checkout em USDC para criadores brasileiros",
    description:
      "Uma página simples para vender produtos digitais aceitando stablecoins, com valor em reais e comprovante fácil de entender.",
    details:
      "O time pode criar um checkout hospedado onde o criador cadastra um produto, gera um link e recebe pagamentos em USDC. Para o MVP, simule a conciliação com PIX, mostre histórico de pedidos e gere um comprovante compartilhável no WhatsApp.",
    tags: ["Pagamentos", "Brasil", "Stablecoins"],
  },
  {
    id: "idea-002",
    category: "Pagamentos",
    title: "Link de pagamento para freelancers globais",
    description:
      "Um link para freelancers brasileiros cobrarem clientes internacionais em stablecoin sem explicar carteira, rede ou token.",
    details:
      "O MVP pode ter criação de cobrança, valor em USD e BRL, status do pagamento e recibo automático. A parte onchain pode começar simples, com um endereço de recebimento e verificação da transação na Solana.",
    tags: ["Pagamentos", "Freelancers", "Stablecoins"],
  },
  {
    id: "idea-003",
    category: "Pagamentos",
    title: "Divisor de conta com stablecoin para viagens em grupo",
    description:
      "Um app para dividir custos de viagem, acompanhar quem pagou e fechar o saldo usando stablecoins.",
    details:
      "Comece com um grupo, despesas em reais, saldo por pessoa e botão para quitar em USDC. A parte cripto pode ser só o pagamento final, mantendo o resto da experiência parecida com um Splitwise brasileiro.",
    tags: ["Pagamentos", "Consumo", "Brasil"],
  },
  {
    id: "idea-004",
    category: "Pagamentos",
    title: "Mesada digital para intercambistas",
    description:
      "Uma carteira simples para famílias enviarem stablecoins para estudantes fora do Brasil com controle de gastos.",
    details:
      "O MVP pode ter cadastro do estudante, limite semanal, histórico e alertas de uso. A demo pode simular conversão para moeda local e focar em confiança, comprovantes e controle familiar.",
    tags: ["Stablecoins", "Família", "Consumo"],
  },
  {
    id: "idea-005",
    category: "Pagamentos",
    title: "Caixinha onchain para vaquinhas transparentes",
    description:
      "Uma vaquinha em que qualquer pessoa vê quanto entrou, quanto saiu e qual objetivo falta alcançar.",
    details:
      "Construa uma página pública com meta, doações, progresso e comprovantes. Para começar, foque em causas pequenas como formatura, evento de comunidade ou campanha local, usando transações onchain como trilha de transparência.",
    tags: ["Pagamentos", "Comunidade", "Transparência"],
  },
  {
    id: "idea-006",
    category: "Pagamentos",
    title: "Assinatura em stablecoin para comunidades",
    description:
      "Um sistema simples para comunidades cobrarem mensalidade e liberarem acesso a links, eventos ou conteúdos.",
    details:
      "O MVP pode ter plano mensal, lista de membros ativos e badge de assinatura. Não precisa resolver cobrança recorrente perfeita no começo, basta detectar pagamentos e mostrar quem está em dia.",
    tags: ["Comunidade", "Stablecoins", "Assinaturas"],
  },
  {
    id: "idea-007",
    category: "Pagamentos",
    title: "Recibo onchain para prestadores de serviço",
    description:
      "Uma ferramenta para diaristas, designers, devs e consultores gerarem recibos simples vinculados a um pagamento.",
    details:
      "O time pode criar um fluxo com cliente, serviço, valor, status e recibo em PDF ou página pública. A camada onchain entra como prova do pagamento, sem exigir que o usuário entenda detalhes técnicos.",
    tags: ["Pagamentos", "Serviços", "Brasil"],
  },
  {
    id: "idea-008",
    category: "Pagamentos",
    title: "Carteira de gorjetas para artistas de rua",
    description:
      "Um QR code para artistas receberem gorjetas digitais e mostrarem uma meta do dia em tempo real.",
    details:
      "O MVP pode gerar uma página com bio, meta, QR code e mural de apoiadores. A experiência deve parecer uma caixinha digital simples, usando stablecoin por trás e escondendo a complexidade da rede.",
    tags: ["Creators", "Pagamentos", "Brasil"],
  },
  {
    id: "idea-009",
    category: "Pagamentos",
    title: "Pagamento por tarefa para squads de hackathon",
    description:
      "Um painel para dividir tarefas, marcar entregas e liberar pequenas recompensas para colaboradores.",
    details:
      "Comece com tarefas, responsáveis, status e um botão de pagamento simbólico em USDC quando a tarefa for aprovada. É útil para comunidades que querem distribuir bounties pequenos sem uma operação pesada.",
    tags: ["Bounties", "Comunidade", "Pagamentos"],
  },
  {
    id: "idea-010",
    category: "Pagamentos",
    title: "Carteira para vendedores de evento",
    description:
      "Um app leve para vendedores receberem pagamentos digitais em feiras, meetups e hackathons.",
    details:
      "O MVP pode ter catálogo de produtos, QR code por pedido e relatório de vendas. Para o hackathon, foque em uma experiência mobile simples e em comprovantes claros para comprador e vendedor.",
    tags: ["Eventos", "Pagamentos", "Mobile"],
  },
  {
    id: "idea-011",
    category: "Consumo",
    title: "Passaporte de eventos para comunidades brasileiras",
    description:
      "Um perfil público que registra presença em eventos, workshops e meetups de uma comunidade.",
    details:
      "O time pode criar check-in por QR code, página de perfil e badges por participação. A versão inicial pode usar NFTs ou registros simples para provar presença sem parecer um produto cripto complicado.",
    tags: ["Eventos", "Comunidade", "Reputação"],
  },
  {
    id: "idea-012",
    category: "Consumo",
    title: "Cartão de reputação para contribuidores",
    description:
      "Um perfil que mostra entregas, skills e contribuições reais de uma pessoa em comunidades e hackathons.",
    details:
      "O MVP pode permitir adicionar projetos, links, badges e recomendações de colegas. A parte onchain pode guardar ou verificar conquistas importantes, enquanto a interface parece um portfólio simples.",
    tags: ["Reputação", "Comunidade", "Portfólio"],
  },
  {
    id: "idea-013",
    category: "Consumo",
    title: "Clube de benefícios para holders de comunidade",
    description:
      "Uma página onde membros com um token ou NFT acessam descontos, eventos e conteúdos exclusivos.",
    details:
      "Comece com verificação de carteira, lista de benefícios e painel simples para o organizador cadastrar parceiros. Pode funcionar para comunidades locais, criadores, atléticas ou coletivos de tecnologia.",
    tags: ["Comunidade", "Token-gating", "Brasil"],
  },
  {
    id: "idea-014",
    category: "Consumo",
    title: "Mural de pedidos para criadores",
    description:
      "Um mural onde fãs sugerem conteúdos, votam com pequenas contribuições e acompanham o que foi aceito.",
    details:
      "O MVP pode ter sugestões, ranking por apoio e status de produção. A camada cripto entra como contribuição transparente para priorizar ideias, mas a experiência deve parecer um mural de pedidos simples.",
    tags: ["Creators", "Social", "Pagamentos"],
  },
  {
    id: "idea-015",
    category: "Consumo",
    title: "Carteira social para grupos de estudo",
    description:
      "Um app para grupos registrarem encontros, materiais e pequenas recompensas por participação.",
    details:
      "A primeira versão pode ter check-in, biblioteca de links, pontos e ranking amigável. É uma ideia boa para times que querem construir algo útil para comunidades sem precisar criar um protocolo complexo.",
    tags: ["Educação", "Comunidade", "Consumo"],
  },
  {
    id: "idea-016",
    category: "Consumo",
    title: "Programa de fidelidade para pequenos cafés",
    description:
      "Um cartão de fidelidade digital com recompensas simples para cafés, hamburguerias e lojas locais.",
    details:
      "O MVP pode ter QR code por compra, contador de visitas e resgate de benefício. Use Solana só para tornar o selo transferível ou verificável, mantendo a experiência parecida com um cartão de carimbo.",
    tags: ["Loyalty", "Comércio local", "Brasil"],
  },
  {
    id: "idea-017",
    category: "Consumo",
    title: "Galeria de colecionáveis para eventos culturais",
    description:
      "Uma galeria onde participantes guardam lembranças digitais de shows, festas, exposições e eventos locais.",
    details:
      "Comece com emissão de um colecionável por evento, página pública e compartilhamento social. O diferencial é usar a lembrança como prova de presença e porta para benefícios futuros.",
    tags: ["Eventos", "NFT", "Cultura"],
  },
  {
    id: "idea-018",
    category: "Consumo",
    title: "Carteira de benefícios para estudantes",
    description:
      "Um perfil estudantil que agrega descontos, presença em eventos e conquistas acadêmicas ou extracurriculares.",
    details:
      "O MVP pode focar em uma universidade ou comunidade. Crie verificação simples, lista de benefícios e badges por participação, usando registros onchain só para conquistas que precisam ser compartilhadas.",
    tags: ["Educação", "Estudantes", "Brasil"],
  },
  {
    id: "idea-019",
    category: "Consumo",
    title: "Feed de oportunidades para quem constrói",
    description:
      "Um feed simples de bounties, hackathons, bolsas e chamadas para projetos, com perfil de interesse do usuário.",
    details:
      "O MVP pode buscar oportunidades em uma lista curada, permitir salvar favoritas e recomendar por categoria. A parte web3 pode entrar em badges de candidatura ou histórico de participação.",
    tags: ["Builders", "Comunidade", "Oportunidades"],
  },
  {
    id: "idea-020",
    category: "Consumo",
    title: "Lista de espera com recompensa para lançamentos",
    description:
      "Uma ferramenta para projetos criarem listas de espera com ranking, convites e recompensas simples.",
    details:
      "Construa landing page, link de convite e ranking. A camada onchain pode emitir pontos ou badges para usuários que trouxerem pessoas reais, ajudando projetos de hackathon a validar demanda rapidamente.",
    tags: ["Crescimento", "Lançamento", "Consumo"],
  },
  {
    id: "idea-021",
    category: "DeFi",
    title: "Comparador de rendimentos para stablecoins",
    description:
      "Um painel que compara oportunidades de rendimento em stablecoins e explica risco em linguagem simples.",
    details:
      "O MVP pode listar 3 ou 4 protocolos, APY, liquidez e um score manual de risco. Não precisa automatizar investimento no começo, basta ajudar usuários a entender onde pesquisar antes de mover dinheiro.",
    tags: ["DeFi", "Stablecoins", "Educação"],
  },
  {
    id: "idea-022",
    category: "DeFi",
    title: "Simulador de empréstimo com cripto como garantia",
    description:
      "Uma calculadora que mostra quanto alguém poderia tomar emprestado sem vender seus ativos.",
    details:
      "O time pode criar uma interface com valor da garantia, taxa, risco de liquidação e cenários de queda. A demo pode usar dados mockados ou de um protocolo conhecido, focando em clareza para iniciantes.",
    tags: ["DeFi", "Lending", "Educação"],
  },
  {
    id: "idea-023",
    category: "DeFi",
    title: "Alerta de risco para posições DeFi",
    description:
      "Um monitor que avisa quando uma posição de lending ou liquidez está ficando perigosa.",
    details:
      "O MVP pode pedir uma carteira, mostrar posições mockadas ou reais e gerar alertas por nível de risco. O produto deve explicar o problema em português claro, como se fosse um painel de saúde financeira.",
    tags: ["DeFi", "Alertas", "Dashboard"],
  },
  {
    id: "idea-024",
    category: "DeFi",
    title: "Assistente para rebalancear carteira pequena",
    description:
      "Um app que sugere ajustes simples para uma carteira de iniciante com SOL, stablecoins e poucos tokens.",
    details:
      "Comece com metas de perfil, carteira atual e sugestões explicadas. Não precisa executar trades automaticamente, basta gerar um plano e links de ação para o usuário revisar.",
    tags: ["DeFi", "Carteira", "AI"],
  },
  {
    id: "idea-025",
    category: "DeFi",
    title: "Painel de taxas e custos antes do swap",
    description:
      "Uma tela que compara rotas de swap e explica preço, slippage e custo total antes da confirmação.",
    details:
      "O MVP pode usar dados simulados ou integração com agregadores para mostrar opções lado a lado. O foco é transformar termos técnicos em uma explicação visual para quem não sabe avaliar uma transação.",
    tags: ["DeFi", "Swap", "UX"],
  },
  {
    id: "idea-026",
    category: "DeFi",
    title: "Ranking de pools para iniciantes",
    description:
      "Um ranking simples de pools por retorno, liquidez e risco percebido, sem prometer rendimento.",
    details:
      "Construa filtros por token, protocolo e risco. A primeira versão pode ser educativa, com dados mockados ou uma fonte pública, ajudando usuários a aprender o que comparar antes de entrar em uma pool.",
    tags: ["DeFi", "Analytics", "Educação"],
  },
  {
    id: "idea-027",
    category: "DeFi",
    title: "Diário de trades para traders de memecoin",
    description:
      "Um diário simples para registrar entradas, saídas, motivos e aprendizados de cada trade.",
    details:
      "O MVP pode conectar uma carteira ou permitir input manual, gerando métricas como lucro, perdas e padrões de erro. É uma ideia boa porque ajuda o usuário sem precisar criar outro DEX.",
    tags: ["Trading", "Consumo", "Analytics"],
  },
  {
    id: "idea-028",
    category: "DeFi",
    title: "Cofrinho em stablecoin com metas",
    description:
      "Um app de metas de poupança em stablecoin, com progresso visual e lembretes simples.",
    details:
      "Comece com criação de meta, depósito, histórico e simulação de rendimento. Para brasileiros, use valores em reais e linguagem de cofrinho, deixando os detalhes onchain em segundo plano.",
    tags: ["Stablecoins", "Poupança", "Brasil"],
  },
  {
    id: "idea-029",
    category: "DeFi",
    title: "Gerador de plano DeFi para iniciantes",
    description:
      "Um assistente que faz perguntas simples e monta uma trilha educativa para começar em DeFi com cuidado.",
    details:
      "O MVP pode ser um formulário com perfil, objetivos e nível de risco, gerando uma lista de passos e avisos. A entrega não precisa executar nada, só orientar e reduzir confusão.",
    tags: ["DeFi", "AI", "Educação"],
  },
  {
    id: "idea-030",
    category: "DeFi",
    title: "Comparador de rampas para entrar e sair de cripto",
    description:
      "Um painel que compara opções para comprar, vender ou receber cripto no Brasil com custos e tempo estimado.",
    details:
      "A primeira versão pode ser um diretório curado com filtros por PIX, stablecoin, taxa e tempo. Ajuda usuários brasileiros a escolher o caminho sem ficar pulando entre vários sites.",
    tags: ["Brasil", "Stablecoins", "Onboarding"],
  },
  {
    id: "idea-031",
    category: "DePIN",
    title: "Mapa colaborativo de qualidade do ar",
    description:
      "Um mapa onde pessoas ou sensores registram qualidade do ar em bairros brasileiros.",
    details:
      "O MVP pode aceitar leituras manuais ou de sensores simples, mostrar um mapa e dar pontos por contribuição consistente. A parte onchain pode registrar contribuições e recompensar bons dados.",
    tags: ["DePIN", "Clima", "Brasil"],
  },
  {
    id: "idea-032",
    category: "DePIN",
    title: "Rede de pontos de Wi-Fi comunitário",
    description:
      "Um cadastro de pontos de Wi-Fi compartilhado com reputação, cobertura e pequenas recompensas.",
    details:
      "Comece com mapa, cadastro de ponto, avaliação e check-in. A demo pode simular recompensa por uptime e cobertura, inspirada em redes DePIN, mas com um caso local fácil de entender.",
    tags: ["DePIN", "Comunidade", "Brasil"],
  },
  {
    id: "idea-033",
    category: "DePIN",
    title: "Monitor de energia solar em condomínios",
    description:
      "Um painel para acompanhar geração solar, economia estimada e impacto ambiental em condomínios.",
    details:
      "O MVP pode usar dados simulados, gráficos por dia e um registro público das leituras. Se quiser adicionar cripto, use incentivos ou certificados simples por energia gerada e verificada.",
    tags: ["Energia", "DePIN", "Clima"],
  },
  {
    id: "idea-034",
    category: "DePIN",
    title: "Prova de coleta para reciclagem local",
    description:
      "Um app para registrar coletas de recicláveis com foto, localização e recompensa simbólica.",
    details:
      "Construa fluxo de coleta, validação por foto e ranking por bairro. A parte onchain pode guardar recibos ou pontos, ajudando cooperativas e comunidades a mostrar impacto real.",
    tags: ["Impacto", "Brasil", "DePIN"],
  },
  {
    id: "idea-035",
    category: "DePIN",
    title: "Mapa de enchentes reportadas pela comunidade",
    description:
      "Uma ferramenta para moradores reportarem alagamentos, nível de água e fotos em tempo real.",
    details:
      "O MVP pode ter mapa, formulário rápido e histórico por região. Use registros verificáveis para dar confiança aos dados e pense em integração futura com defesa civil ou grupos locais.",
    tags: ["Clima", "Brasil", "Dados"],
  },
  {
    id: "idea-036",
    category: "AI",
    title: "Agente que explica transações em português",
    description:
      "Um assistente que traduz uma transação Solana para linguagem simples antes do usuário assinar.",
    details:
      "O MVP pode receber dados de uma transação e gerar um resumo como: você está enviando X para Y, este contrato pode fazer Z. Foque em reduzir medo e erro para usuários não técnicos.",
    tags: ["AI", "Wallet", "Segurança"],
  },
  {
    id: "idea-037",
    category: "AI",
    title: "Copiloto para escolher uma ideia de hackathon",
    description:
      "Um assistente que conversa com o time, entende skills e sugere ideias possíveis para construir.",
    details:
      "Comece com perguntas sobre funções, tempo, interesses e nível técnico. A resposta pode recomendar ideias do próprio feed, escopo de MVP e primeira tarefa para cada pessoa.",
    tags: ["AI", "Hackathon", "Times"],
  },
  {
    id: "idea-038",
    category: "AI",
    title: "Assistente de proposta para DAOs",
    description:
      "Um bot que transforma uma ideia solta em uma proposta clara para DAO ou comunidade.",
    details:
      "O MVP pode gerar título, problema, solução, orçamento, riscos e próximos passos. Dá para conectar com fóruns depois, mas no hackathon o valor já aparece como editor inteligente.",
    tags: ["AI", "Governança", "Comunidade"],
  },
  {
    id: "idea-039",
    category: "AI",
    title: "Agente de cobranças para pequenos negócios",
    description:
      "Um assistente que acompanha pagamentos pendentes e gera mensagens educadas para WhatsApp.",
    details:
      "O MVP pode ter lista de cobranças, status, links de pagamento e mensagens sugeridas. Use stablecoin ou PIX simulado como saída, com foco em UX para pequenos negócios brasileiros.",
    tags: ["AI", "Pagamentos", "Brasil"],
  },
  {
    id: "idea-040",
    category: "AI",
    title: "Resumo de carteira para iniciantes",
    description:
      "Um painel que explica a carteira do usuário em português claro, com alertas e próximos passos.",
    details:
      "A primeira versão pode mostrar saldo, tokens desconhecidos, NFTs e risco básico. Use IA para traduzir o estado da carteira em frases acionáveis, sem fingir que é consultoria financeira.",
    tags: ["AI", "Wallet", "Educação"],
  },
  {
    id: "idea-041",
    category: "Infra",
    title: "Postman para programas Solana",
    description:
      "Uma interface visual para testar instruções de programas Solana sem escrever scripts do zero.",
    details:
      "O MVP pode carregar um IDL, listar métodos, preencher parâmetros e simular uma chamada. É inspirado em ferramentas vencedoras de developer tooling, mas com escopo bem direto para hackathon.",
    tags: ["Dev tools", "Solana", "Infra"],
  },
  {
    id: "idea-042",
    category: "Infra",
    title: "Explorador de erros de transação",
    description:
      "Um app que cola uma assinatura de transação e explica por que ela falhou.",
    details:
      "Comece com input de assinatura, busca em RPC ou dados mockados e explicação em português. O valor está em traduzir logs técnicos para uma causa provável e uma sugestão de correção.",
    tags: ["Dev tools", "Debug", "Solana"],
  },
  {
    id: "idea-043",
    category: "Infra",
    title: "Painel de saúde para dApps pequenos",
    description:
      "Um monitor simples de transações, erros e atividade para times que acabaram de lançar um app.",
    details:
      "O MVP pode receber um endereço de programa, mostrar eventos recentes e alertar quando algo falha. Não precisa virar Datadog, basta responder: está funcionando ou não?",
    tags: ["Infra", "Monitoring", "Dev tools"],
  },
  {
    id: "idea-044",
    category: "Infra",
    title: "Gerador de documentação para contratos",
    description:
      "Uma ferramenta que transforma IDL, README ou código em uma documentação simples para integradores.",
    details:
      "O time pode subir um arquivo, extrair métodos e gerar exemplos em TypeScript. É uma boa ideia para vibecoding porque boa parte do valor está em interface e geração assistida.",
    tags: ["Dev tools", "AI", "Docs"],
  },
  {
    id: "idea-045",
    category: "Infra",
    title: "Carteira de teste para desenvolvedores",
    description:
      "Uma wallet focada em devnet/localnet com logs, troca rápida de rede e visualização de transações.",
    details:
      "O MVP pode simular ou implementar funções básicas: trocar cluster, pedir airdrop, assinar transação e mostrar logs. O público são devs que querem debugar sem abrir cinco ferramentas.",
    tags: ["Wallet", "Dev tools", "Solana"],
  },
  {
    id: "idea-046",
    category: "Gaming",
    title: "Bolão de previsões para futebol brasileiro",
    description:
      "Um bolão simples onde amigos fazem previsões, acompanham ranking e podem usar apostas simbólicas.",
    details:
      "Comece com partidas, palpites, pontuação e ranking. Se o time quiser usar cripto, adicione um depósito simbólico ou prêmio em stablecoin, mantendo a experiência parecida com um bolão comum.",
    tags: ["Gaming", "Brasil", "Prediction"],
  },
  {
    id: "idea-047",
    category: "Gaming",
    title: "Fantasy de tokens sem dinheiro real",
    description:
      "Um jogo onde usuários montam uma carteira fictícia e competem por pontos com dados de mercado.",
    details:
      "O MVP pode usar preços públicos, ranking semanal e ligas entre amigos. É mais seguro para iniciantes porque ensina dinâmica de mercado sem exigir que alguém arrisque capital real.",
    tags: ["Gaming", "Trading", "Educação"],
  },
  {
    id: "idea-048",
    category: "Gaming",
    title: "Caça ao tesouro em eventos",
    description:
      "Um jogo de QR codes e pistas para eventos, onde participantes coletam badges e desbloqueiam recompensas.",
    details:
      "Construa um mapa simples, pistas, check-ins e ranking. A parte onchain pode emitir colecionáveis por missão concluída, mas a diversão precisa funcionar mesmo para quem nunca usou wallet.",
    tags: ["Eventos", "Gaming", "NFT"],
  },
  {
    id: "idea-049",
    category: "Governança",
    title: "Resumo de decisões para comunidades",
    description:
      "Um painel que resume propostas, votações e decisões importantes de uma comunidade em uma linguagem simples.",
    details:
      "O MVP pode permitir cadastrar propostas manualmente, gerar resumo com IA e marcar status. Depois dá para conectar fóruns ou DAOs, mas o primeiro valor é reduzir ruído para membros ocupados.",
    tags: ["Governança", "AI", "Comunidade"],
  },
  {
    id: "idea-050",
    category: "Governança",
    title: "Orçamento transparente para coletivos",
    description:
      "Uma página pública onde coletivos mostram entradas, gastos, responsáveis e próximos pedidos de verba.",
    details:
      "Comece com lançamentos manuais, categorias, anexos e resumo mensal. A camada onchain pode guardar pagamentos ou comprovantes importantes, ajudando comunidades brasileiras a prestar contas sem planilha confusa.",
    tags: ["Governança", "Transparência", "Brasil"],
  },
  {
    id: "idea-051",
    category: "Pagamentos",
    title: "Conta conjunta para pequenos projetos",
    description:
      "Uma carteira compartilhada para times acompanharem entradas, gastos e saldo de um projeto sem depender de uma pessoa só.",
    details:
      "O MVP pode ter membros, permissões simples, lançamentos e histórico público. Para começar, simule aprovações por maioria e mostre o saldo em USDC e reais, com foco em transparência para squads pequenos.",
    tags: ["Pagamentos", "Times", "Transparência"],
  },
  {
    id: "idea-052",
    category: "Pagamentos",
    title: "Cobrança recorrente para aulas particulares",
    description:
      "Um painel para professores cobrarem mensalidades, acompanharem alunos em dia e enviarem lembretes.",
    details:
      "A primeira versão pode ter cadastro de alunos, planos, status de pagamento e mensagens prontas para WhatsApp. Use stablecoin como opção de pagamento para alunos internacionais ou famílias fora do Brasil.",
    tags: ["Educação", "Pagamentos", "Brasil"],
  },
  {
    id: "idea-053",
    category: "Pagamentos",
    title: "Pagamento por conteúdo liberado aos poucos",
    description:
      "Um fluxo onde o comprador paga e recebe acesso gradual a módulos, arquivos ou mentorias.",
    details:
      "O MVP pode ter produto, módulos bloqueados, comprovante de pagamento e liberação manual ou automática. Serve para cursos, comunidades e consultorias, sem precisar criar uma plataforma de ensino completa.",
    tags: ["Creators", "Pagamentos", "Educação"],
  },
  {
    id: "idea-054",
    category: "Pagamentos",
    title: "Caixa de campanha para atléticas e centros acadêmicos",
    description:
      "Uma página para arrecadar, registrar gastos e mostrar metas de campanhas estudantis.",
    details:
      "Comece com meta, doações, despesas e prestação de contas. O produto pode ser útil para festas, viagens, eventos e materiais, deixando claro para todo mundo quanto entrou e para onde foi.",
    tags: ["Estudantes", "Brasil", "Transparência"],
  },
  {
    id: "idea-055",
    category: "Pagamentos",
    title: "Escrow simples para serviços entre desconhecidos",
    description:
      "Um intermediador de pagamento para freelas pequenos, onde o dinheiro fica bloqueado até a entrega ser aprovada.",
    details:
      "O MVP pode criar acordos com descrição, valor, prazo, status e botão de liberar pagamento. Para evitar complexidade jurídica, apresente como uma ferramenta de confiança para projetos pequenos e entregas objetivas.",
    tags: ["Pagamentos", "Freelancers", "Escrow"],
  },
  {
    id: "idea-056",
    category: "Pagamentos",
    title: "Carteira de doações para streamers",
    description:
      "Um painel para streamers receberem apoios, mostrar metas ao vivo e agradecer automaticamente.",
    details:
      "Construa página de doação, feed de apoiadores e overlay simples para transmissão. O pagamento pode ser em stablecoin e a demo pode focar em como isso aparece para o público durante a live.",
    tags: ["Criadores", "Pagamentos", "Social"],
  },
  {
    id: "idea-057",
    category: "Pagamentos",
    title: "Nota de entrega para motoboys e entregadores",
    description:
      "Um recibo digital simples que registra entrega, valor, gorjeta e confirmação do cliente.",
    details:
      "O MVP pode ter cadastro da corrida, confirmação por link e histórico. A camada onchain pode funcionar como comprovante, mas o produto deve parecer uma ferramenta de trabalho rápida para celular.",
    tags: ["Brasil", "Serviços", "Mobile"],
  },
  {
    id: "idea-058",
    category: "Pagamentos",
    title: "Pagamento em lote para comunidades",
    description:
      "Um app para organizadores pagarem várias pessoas de uma vez depois de eventos, bounties ou tarefas.",
    details:
      "Comece com upload de lista, revisão de valores e execução simulada ou real em stablecoin. O diferencial é reduzir erro operacional e criar um recibo claro para cada pessoa paga.",
    tags: ["Pagamentos", "Comunidade", "Bounties"],
  },
  {
    id: "idea-059",
    category: "Pagamentos",
    title: "Prêmios para torneios amadores",
    description:
      "Uma ferramenta para organizar premiação de campeonatos pequenos com ranking e pagamento transparente.",
    details:
      "O MVP pode ter cadastro do torneio, regras de premiação, placar manual e distribuição final. Funciona para games, futebol, xadrez, fantasy ou competições de comunidade.",
    tags: ["Gaming", "Pagamentos", "Comunidade"],
  },
  {
    id: "idea-060",
    category: "Pagamentos",
    title: "Controle de caixa para eventos pop-up",
    description:
      "Um painel para eventos de um dia acompanharem vendas, custos, repasses e lucro estimado.",
    details:
      "Construa uma experiência mobile para registrar entradas e saídas em tempo real. A parte cripto pode entrar nos repasses finais entre organizadores, expositores e fornecedores.",
    tags: ["Eventos", "Brasil", "Pagamentos"],
  },
  {
    id: "idea-061",
    category: "Consumo",
    title: "Agenda de eventos com check-in verificável",
    description:
      "Uma agenda de eventos da comunidade onde presença gera histórico e benefícios futuros.",
    details:
      "O MVP pode listar eventos, permitir check-in por QR code e mostrar perfil de participação. Depois, organizadores podem usar esse histórico para liberar vagas, brindes ou convites.",
    tags: ["Eventos", "Comunidade", "Reputação"],
  },
  {
    id: "idea-062",
    category: "Consumo",
    title: "Clube de leitura com badges de participação",
    description:
      "Um app para grupos de leitura registrarem encontros, livros e participação de membros.",
    details:
      "Comece com clubes, encontros, presença e pequenos badges por leitura concluída. É simples de construir e mostra como registros verificáveis podem servir para comunidades não técnicas.",
    tags: ["Educação", "Comunidade", "NFT"],
  },
  {
    id: "idea-063",
    category: "Consumo",
    title: "Portfólio automático para hackathons",
    description:
      "Uma página que transforma projetos de hackathon em um portfólio compartilhável para cada participante.",
    details:
      "O MVP pode pedir nome do projeto, função da pessoa, links e entregas. Gere uma página bonita com histórico de participação, útil para recrutamento e para mostrar trabalho depois do evento.",
    tags: ["Hackathon", "Portfólio", "Reputação"],
  },
  {
    id: "idea-064",
    category: "Consumo",
    title: "Ranking de contribuições em comunidades",
    description:
      "Um painel que reconhece quem ajudou em eventos, conteúdos, suporte e organização.",
    details:
      "A primeira versão pode permitir que admins registrem contribuições e membros recebam pontos ou badges. O foco é reconhecimento público, não competição agressiva.",
    tags: ["Comunidade", "Reputação", "Brasil"],
  },
  {
    id: "idea-065",
    category: "Consumo",
    title: "Carteira de certificados para cursos livres",
    description:
      "Um lugar simples para guardar certificados de workshops, mentorias e cursos curtos.",
    details:
      "O MVP pode emitir certificados por turma, verificar autenticidade e criar perfil público. É útil para comunidades educacionais que querem provar participação sem depender de PDFs soltos.",
    tags: ["Educação", "Certificados", "Brasil"],
  },
  {
    id: "idea-066",
    category: "Consumo",
    title: "Mapa de lugares cripto-amigáveis",
    description:
      "Um mapa colaborativo de lojas, cafés e eventos que aceitam pagamentos digitais ou participam de comunidades web3.",
    details:
      "Comece com cadastro manual, avaliações e filtros por cidade. O produto pode ser útil em São Paulo, Rio, Floripa ou eventos, com verificação por foto ou comunidade.",
    tags: ["Brasil", "Mapa", "Pagamentos"],
  },
  {
    id: "idea-067",
    category: "Consumo",
    title: "Convites com acesso por carteira",
    description:
      "Uma ferramenta para criar convites de eventos que liberam entrada com carteira, QR code ou nome na lista.",
    details:
      "O MVP pode gerar evento, lista de convidados e check-in. A carteira entra como identidade opcional, sem impedir que pessoas não técnicas usem o produto.",
    tags: ["Eventos", "Identidade", "Comunidade"],
  },
  {
    id: "idea-068",
    category: "Consumo",
    title: "Mural de agradecimentos para apoiadores",
    description:
      "Uma página pública para projetos agradecerem apoiadores, voluntários e primeiros usuários.",
    details:
      "Comece com lista de apoiadores, mensagem, contribuição e selo opcional. É simples, emocional e pode virar uma camada de reputação para projetos nascentes.",
    tags: ["Social", "Comunidade", "Reputação"],
  },
  {
    id: "idea-069",
    category: "Consumo",
    title: "Desafios semanais para aprender Solana",
    description:
      "Uma trilha de desafios curtos para iniciantes aprenderem conceitos de Solana com recompensas simbólicas.",
    details:
      "O MVP pode ter desafios, respostas, progresso e ranking. Não precisa compilar código real no começo; pode ser uma experiência guiada para reduzir barreira de entrada.",
    tags: ["Educação", "Solana", "Comunidade"],
  },
  {
    id: "idea-070",
    category: "Consumo",
    title: "Lista de presentes com pagamento digital",
    description:
      "Uma lista de presentes para aniversários, casamentos ou chá de casa nova, com contribuições transparentes.",
    details:
      "O MVP pode ter itens, cotas, mensagens e comprovantes. A stablecoin pode ser opcional, mas a transparência da meta e dos apoiadores é o centro da experiência.",
    tags: ["Pagamentos", "Eventos", "Brasil"],
  },
  {
    id: "idea-071",
    category: "DeFi",
    title: "Monitor de stablecoins para brasileiros",
    description:
      "Um painel que compara stablecoins por liquidez, uso, risco percebido e disponibilidade para entrada e saída no Brasil.",
    details:
      "Comece com um ranking curado, explicações simples e links para pesquisar mais. O objetivo é ajudar iniciantes a entender diferenças sem precisar ler documentação técnica.",
    tags: ["Stablecoins", "Brasil", "Educação"],
  },
  {
    id: "idea-072",
    category: "DeFi",
    title: "Calculadora de risco de liquidação",
    description:
      "Uma calculadora visual que mostra quando uma posição com garantia pode ser liquidada.",
    details:
      "O MVP pode aceitar valor da garantia, dívida e preço do ativo, gerando cenários de queda. A interface deve explicar risco de forma visual e em português claro.",
    tags: ["DeFi", "Lending", "Risco"],
  },
  {
    id: "idea-073",
    category: "DeFi",
    title: "Alerta de oportunidade entre DEXs",
    description:
      "Um painel que compara preço de um par em diferentes rotas e mostra quando há diferença relevante.",
    details:
      "A primeira versão pode usar poucos pares e dados atualizados periodicamente. Não precisa executar arbitragem, apenas detectar, explicar e registrar oportunidades.",
    tags: ["DeFi", "DEX", "Analytics"],
  },
  {
    id: "idea-074",
    category: "DeFi",
    title: "Resumo de posição em linguagem simples",
    description:
      "Uma página que pega uma carteira e explica onde o dinheiro está, quais riscos existem e o que mudou.",
    details:
      "O MVP pode mostrar tokens, pools, posições e alertas básicos. A ideia é ser um extrato inteligente, útil para quem entrou em DeFi mas se perdeu no caminho.",
    tags: ["DeFi", "Wallet", "AI"],
  },
  {
    id: "idea-075",
    category: "DeFi",
    title: "Simulador de carteira protegida",
    description:
      "Um app que mostra como separar uma carteira entre risco, stablecoin e reserva para reduzir sustos.",
    details:
      "O MVP pode ser educativo: usuário escolhe perfil, simula alocação e vê cenários. Não precisa executar trades, só criar clareza e disciplina.",
    tags: ["DeFi", "Educação", "Risco"],
  },
  {
    id: "idea-076",
    category: "DeFi",
    title: "Painel de custos invisíveis em DeFi",
    description:
      "Uma ferramenta que mostra custos como slippage, taxas, preço de entrada e variação depois da transação.",
    details:
      "Comece com uma tela de simulação de swap e histórico comparativo. O valor é mostrar ao usuário o que ele costuma ignorar antes de clicar em confirmar.",
    tags: ["DeFi", "UX", "Analytics"],
  },
  {
    id: "idea-077",
    category: "DeFi",
    title: "Cesta de estudo DeFi para iniciantes",
    description:
      "Uma carteira fictícia que ensina conceitos de DeFi sem usar dinheiro real.",
    details:
      "O MVP pode criar missões, simular depósitos em pools e mostrar evolução. É uma boa ponte entre educação e produto, especialmente para usuários não técnicos.",
    tags: ["Educação", "DeFi", "Simulação"],
  },
  {
    id: "idea-078",
    category: "DeFi",
    title: "Comparador de empréstimos entre protocolos",
    description:
      "Um painel que mostra onde pegar ou oferecer liquidez com melhor taxa e menor risco percebido.",
    details:
      "A primeira versão pode comparar poucos protocolos e tokens. Mostre taxa, liquidez, risco de liquidação e links para pesquisar, sem prometer retorno.",
    tags: ["DeFi", "Lending", "Analytics"],
  },
  {
    id: "idea-079",
    category: "DeFi",
    title: "Assistente de saída para posições antigas",
    description:
      "Um app que ajuda o usuário a entender posições esquecidas e planejar saída com menos erro.",
    details:
      "O MVP pode listar posições, valor aproximado, risco e próximos passos. A ideia é reduzir abandono e confusão, não tomar decisão pelo usuário.",
    tags: ["DeFi", "Wallet", "AI"],
  },
  {
    id: "idea-080",
    category: "DeFi",
    title: "Histórico de rendimento em reais",
    description:
      "Um extrato que mostra ganhos e perdas de posições DeFi em reais, não só em tokens.",
    details:
      "Comece com input manual ou carteira conectada, conversão aproximada e linha do tempo. Para brasileiros, ver desempenho em reais torna o produto muito mais fácil de entender.",
    tags: ["DeFi", "Brasil", "Analytics"],
  },
  {
    id: "idea-081",
    category: "DePIN",
    title: "Registro de calor por bairro",
    description:
      "Um mapa colaborativo de temperatura em bairros, útil para discutir ilhas de calor e conforto urbano.",
    details:
      "O MVP pode permitir leituras manuais, foto opcional e localização aproximada. Depois, sensores ou estações locais podem melhorar a qualidade dos dados.",
    tags: ["Clima", "Brasil", "Dados"],
  },
  {
    id: "idea-082",
    category: "DePIN",
    title: "Rede de carregadores para bicicletas elétricas",
    description:
      "Um mapa de pontos onde ciclistas podem carregar e registrar uso de baterias ou bicicletas elétricas.",
    details:
      "Comece com cadastro de pontos, check-in e avaliação. A camada de incentivo pode recompensar locais que mantêm pontos ativos e confiáveis.",
    tags: ["Mobilidade", "DePIN", "Brasil"],
  },
  {
    id: "idea-083",
    category: "DePIN",
    title: "Painel de sensores para hortas urbanas",
    description:
      "Um painel simples para hortas comunitárias registrarem umidade, temperatura e cuidados semanais.",
    details:
      "O MVP pode usar dados manuais ou sensor simulado, mostrando histórico e tarefas. Recompensas podem reconhecer voluntários que mantêm a horta saudável.",
    tags: ["Impacto", "Comunidade", "DePIN"],
  },
  {
    id: "idea-084",
    category: "DePIN",
    title: "Prova de entrega de água em eventos",
    description:
      "Um sistema para registrar pontos de distribuição de água e reposições durante eventos grandes.",
    details:
      "Comece com mapa, responsáveis, fotos e horário das reposições. É um caso simples de logística verificável, útil para festivais, corridas e eventos de comunidade.",
    tags: ["Eventos", "Dados", "Brasil"],
  },
  {
    id: "idea-085",
    category: "DePIN",
    title: "Monitor de ruído em regiões urbanas",
    description:
      "Um mapa onde pessoas registram níveis de ruído para entender incômodos e padrões por horário.",
    details:
      "O MVP pode usar medições do celular, localização aproximada e visualização por bairro. Foque em privacidade e dados agregados, não em expor endereços individuais.",
    tags: ["Dados", "Cidade", "Brasil"],
  },
  {
    id: "idea-086",
    category: "AI",
    title: "Agente de onboarding para carteiras",
    description:
      "Um assistente que guia o usuário nos primeiros passos de uma wallet sem usar jargão técnico.",
    details:
      "O MVP pode simular uma carteira, explicar seed phrase, transação, taxa e assinatura com exemplos. O foco é reduzir medo e erros de iniciantes brasileiros.",
    tags: ["AI", "Wallet", "Educação"],
  },
  {
    id: "idea-087",
    category: "AI",
    title: "Leitor de propostas de investimento cripto",
    description:
      "Um assistente que resume uma oportunidade, lista riscos e separa promessa de evidência.",
    details:
      "O MVP pode receber texto ou link, gerar resumo, perguntas críticas e alerta de termos perigosos. Não deve dizer onde investir, só ajudar a ler melhor.",
    tags: ["AI", "Segurança", "Educação"],
  },
  {
    id: "idea-088",
    category: "AI",
    title: "Gerador de roteiro para demo de hackathon",
    description:
      "Um app que ajuda times a transformar produto em uma demo clara, com narrativa e checklist.",
    details:
      "Comece com formulário sobre problema, usuário e solução. Gere roteiro de apresentação, falas por pessoa e lista do que precisa funcionar antes da entrega.",
    tags: ["AI", "Hackathon", "Produtividade"],
  },
  {
    id: "idea-089",
    category: "AI",
    title: "Agente de suporte para comunidades",
    description:
      "Um bot que responde dúvidas frequentes de uma comunidade usando documentos, links e regras internas.",
    details:
      "O MVP pode carregar um conjunto de perguntas e respostas, buscar em documentos e responder em português. É útil para comunidades que repetem as mesmas explicações no Discord ou WhatsApp.",
    tags: ["AI", "Comunidade", "Suporte"],
  },
  {
    id: "idea-090",
    category: "AI",
    title: "Classificador de ideias por dificuldade",
    description:
      "Uma ferramenta que lê uma ideia de hackathon e estima dificuldade, riscos e primeiro escopo possível.",
    details:
      "O MVP pode retornar nível técnico, tipo de time recomendado, partes mockáveis e plano de construção. Ajuda equipes iniciantes a escolher algo que caiba no tempo.",
    tags: ["AI", "Hackathon", "Planejamento"],
  },
  {
    id: "idea-091",
    category: "Infra",
    title: "Gerador de playground para contratos",
    description:
      "Uma ferramenta que cria uma interface simples para testar funções de um contrato a partir de um arquivo de descrição.",
    details:
      "O MVP pode aceitar um IDL, gerar campos de formulário e mostrar resultado da chamada. Isso ajuda projetos a criarem demos sem gastar tempo em interface do zero.",
    tags: ["Dev tools", "Solana", "Infra"],
  },
  {
    id: "idea-092",
    category: "Infra",
    title: "Monitor de RPC para times pequenos",
    description:
      "Um painel que compara latência, erro e estabilidade de endpoints usados por um dApp.",
    details:
      "Comece com poucos endpoints, testes periódicos e alertas visuais. A demo pode mostrar como uma falha de RPC impacta o usuário final.",
    tags: ["Infra", "Monitoring", "Solana"],
  },
  {
    id: "idea-093",
    category: "Infra",
    title: "Visualizador de contas de programa",
    description:
      "Uma interface para explorar contas de um programa Solana e entender seus dados sem escrever script.",
    details:
      "O MVP pode aceitar program id, listar contas e mostrar campos decodificados quando houver IDL. Mesmo uma versão parcial já ajuda devs a depurar mais rápido.",
    tags: ["Dev tools", "Debug", "Solana"],
  },
  {
    id: "idea-094",
    category: "Infra",
    title: "Checklist de segurança antes do deploy",
    description:
      "Uma ferramenta que guia times por checagens básicas antes de publicar um programa ou app.",
    details:
      "Comece com checklist interativo, explicações e geração de relatório. Pode incluir permissões, chaves, variáveis, upgrade authority, links públicos e plano de rollback.",
    tags: ["Segurança", "Dev tools", "Hackathon"],
  },
  {
    id: "idea-095",
    category: "Infra",
    title: "Página de status para projetos de hackathon",
    description:
      "Uma status page simples para mostrar se app, API, RPC e contrato estão funcionando durante a demo.",
    details:
      "O MVP pode ter checks manuais ou automáticos, histórico curto e mensagem pública. É útil para times evitarem surpresa na apresentação e mostrarem maturidade.",
    tags: ["Infra", "Monitoring", "Demo"],
  },
  {
    id: "idea-096",
    category: "Gaming",
    title: "Liga de palpites para reality shows",
    description:
      "Um jogo social onde amigos fazem previsões sobre eliminações, provas e ranking de participantes.",
    details:
      "O MVP pode ter liga privada, palpites, pontuação e ranking. Se usar cripto, mantenha como prêmio simbólico ou badge, evitando transformar tudo em aposta financeira.",
    tags: ["Gaming", "Social", "Brasil"],
  },
  {
    id: "idea-097",
    category: "Gaming",
    title: "Batalha de memes com votação transparente",
    description:
      "Uma competição onde pessoas enviam memes, votam em rodadas e acompanham vencedores de forma verificável.",
    details:
      "Comece com envio, votação, chaveamento e ranking. A camada onchain pode registrar votos finais ou distribuir badges para vencedores e jurados.",
    tags: ["Gaming", "Social", "Comunidade"],
  },
  {
    id: "idea-098",
    category: "Gaming",
    title: "Jogo de missões para onboarding em evento",
    description:
      "Um jogo leve para participantes conhecerem patrocinadores, palestras e pessoas durante um evento.",
    details:
      "O MVP pode ter missões, QR codes, ranking e recompensas simbólicas. É uma forma simples de transformar networking em algo mais guiado e divertido.",
    tags: ["Eventos", "Gaming", "Comunidade"],
  },
  {
    id: "idea-099",
    category: "Governança",
    title: "Votação simples para grupos de WhatsApp",
    description:
      "Uma ferramenta para grupos decidirem temas, datas ou gastos com votação rastreável e resultado claro.",
    details:
      "O MVP pode criar uma votação, compartilhar link e mostrar resultado. A camada onchain pode ser opcional para votações que precisam de transparência ou histórico público.",
    tags: ["Governança", "WhatsApp", "Brasil"],
  },
  {
    id: "idea-100",
    category: "Governança",
    title: "Registro de promessas de campanha comunitária",
    description:
      "Um painel para chapas, coletivos ou comunidades registrarem promessas e acompanharem execução.",
    details:
      "Comece com lista de promessas, responsáveis, status e evidências. Serve para centros acadêmicos, comunidades tech e grupos locais que querem cobrar progresso sem burocracia.",
    tags: ["Governança", "Comunidade", "Transparência"],
  },
  {
    id: "idea-101",
    category: "Pagamentos",
    title: "Repasse automático para fornecedores de evento",
    description:
      "Um painel para dividir a receita de um evento entre bar, produção, DJs, fotógrafos e organizadores.",
    details:
      "O MVP pode receber uma receita total, cadastrar percentuais e gerar uma tela de repasses. A parte onchain pode registrar pagamentos em stablecoin, mas a primeira entrega deve resolver a confusão de planilhas e comprovantes.",
    tags: ["Eventos", "Pagamentos", "Brasil"],
  },
  {
    id: "idea-102",
    category: "Pagamentos",
    title: "Carnê digital para compras parceladas pequenas",
    description:
      "Uma ferramenta para lojistas acompanharem parcelas simples, vencimentos e comprovantes de pagamento.",
    details:
      "Comece com cadastro de cliente, plano de parcelas, status e lembretes por WhatsApp. Use stablecoin apenas como uma opção de liquidação, mantendo o produto familiar para pequenos comércios.",
    tags: ["Comércio local", "Brasil", "Pagamentos"],
  },
  {
    id: "idea-103",
    category: "Pagamentos",
    title: "Divisão de receita para colabs de criadores",
    description:
      "Um app para criadores dividirem receita de um produto digital com designers, editores e parceiros.",
    details:
      "O MVP pode cadastrar um produto, participantes e porcentagens. Depois de cada venda, o painel mostra quanto cada pessoa deve receber e gera repasses em stablecoin ou comprovantes manuais.",
    tags: ["Criadores", "Pagamentos", "Colaboração"],
  },
  {
    id: "idea-104",
    category: "Pagamentos",
    title: "Conta de viagem para nômades brasileiros",
    description:
      "Um controle simples para quem trabalha remoto e viaja, com gastos em várias moedas e saldo em stablecoin.",
    details:
      "Comece com registro de despesas, conversão aproximada para reais e dólares, e metas mensais. A camada cripto pode ajudar a simular reserva internacional sem depender de banco local.",
    tags: ["Stablecoins", "Viagem", "Brasil"],
  },
  {
    id: "idea-105",
    category: "Pagamentos",
    title: "Pagamento com QR para barracas de feira",
    description:
      "Um fluxo mobile para vendedores de feira cobrarem por QR code e acompanharem pedidos do dia.",
    details:
      "O MVP pode ter catálogo simples, carrinho, QR de pagamento e resumo de vendas. A interface precisa funcionar rápido no celular e falar a linguagem de quem vende presencialmente.",
    tags: ["Comércio local", "Mobile", "Brasil"],
  },
  {
    id: "idea-106",
    category: "Pagamentos",
    title: "Doação recorrente para ONGs pequenas",
    description:
      "Uma página de doação com metas mensais, histórico público e mensagens para apoiadores.",
    details:
      "Comece com planos de apoio, painel de doadores e prestação de contas. A recorrência pode ser simulada no MVP com lembretes mensais e confirmação manual de pagamento.",
    tags: ["Impacto", "Pagamentos", "Transparência"],
  },
  {
    id: "idea-107",
    category: "Pagamentos",
    title: "Comprovante compartilhável para pagamentos em cripto",
    description:
      "Uma página bonita que transforma uma transação em um comprovante simples para enviar a clientes ou amigos.",
    details:
      "O MVP pode receber assinatura da transação, buscar dados básicos e gerar um recibo com valor, data, remetente e destinatário. Foque em confiança e legibilidade.",
    tags: ["Pagamentos", "UX", "Brasil"],
  },
  {
    id: "idea-108",
    category: "Pagamentos",
    title: "Gestão de caixa para comunidades de bairro",
    description:
      "Um caixa transparente para grupos locais cuidarem de vaquinhas, eventos e compras coletivas.",
    details:
      "Comece com entradas, saídas, responsáveis e anexos. A parte onchain pode registrar saldos e doações importantes, mas a UX deve lembrar um extrato simples.",
    tags: ["Comunidade", "Brasil", "Transparência"],
  },
  {
    id: "idea-109",
    category: "Pagamentos",
    title: "Pagamento por presença em pesquisa de campo",
    description:
      "Um app para pesquisadores pagarem participantes de entrevistas, testes ou coletas de dados.",
    details:
      "O MVP pode ter cadastro de sessão, check-in, consentimento básico e pagamento final. Serve para universidades, startups e comunidades que fazem pesquisa com incentivos pequenos.",
    tags: ["Pesquisa", "Pagamentos", "Educação"],
  },
  {
    id: "idea-110",
    category: "Pagamentos",
    title: "Vale-presente em stablecoin para amigos",
    description:
      "Uma experiência simples para mandar um valor de presente com mensagem, tema e resgate guiado.",
    details:
      "Comece com criação do vale, link de resgate e tela explicando como usar. O foco é tornar o primeiro contato com stablecoin mais emocional e menos técnico.",
    tags: ["Stablecoins", "Consumo", "Onboarding"],
  },
  {
    id: "idea-111",
    category: "Consumo",
    title: "Diário de aprendizado com provas públicas",
    description:
      "Um diário onde estudantes registram aprendizados, projetos e evidências de progresso.",
    details:
      "O MVP pode ter posts curtos, links, badges e uma página pública. Use registros verificáveis apenas para marcos importantes, como conclusão de desafio ou entrega de projeto.",
    tags: ["Educação", "Reputação", "Portfólio"],
  },
  {
    id: "idea-112",
    category: "Consumo",
    title: "Carteira de ingressos para eventos de comunidade",
    description:
      "Um lugar para guardar ingressos, presença e benefícios de eventos pequenos.",
    details:
      "Comece com ingresso por QR code, check-in e histórico de eventos. Para organizadores, adicione uma lista simples de participantes e exportação.",
    tags: ["Eventos", "Mobile", "Comunidade"],
  },
  {
    id: "idea-113",
    category: "Consumo",
    title: "Rede de indicações para freelas",
    description:
      "Um app onde freelancers registram indicações recebidas e agradecem quem trouxe clientes.",
    details:
      "O MVP pode ter link de indicação, status do lead e recompensa simbólica. É útil para designers, devs e consultores que dependem de rede de confiança.",
    tags: ["Freelancers", "Reputação", "Brasil"],
  },
  {
    id: "idea-114",
    category: "Consumo",
    title: "Coleção de conquistas para voluntários",
    description:
      "Um perfil para voluntários registrarem horas, ações e impacto em projetos sociais.",
    details:
      "Comece com organizações, eventos, check-ins e badges. A proposta é ajudar voluntários a mostrar trabalho real e ONGs a reconhecerem participação.",
    tags: ["Impacto", "Reputação", "Comunidade"],
  },
  {
    id: "idea-115",
    category: "Consumo",
    title: "Agenda de mentorias com reputação",
    description:
      "Uma plataforma simples para marcar mentorias e registrar feedback entre mentores e mentorados.",
    details:
      "O MVP pode ter disponibilidade, agendamento, avaliação e histórico público opcional. Serve para comunidades tech que organizam mentoria informal pelo WhatsApp.",
    tags: ["Educação", "Comunidade", "Reputação"],
  },
  {
    id: "idea-116",
    category: "Consumo",
    title: "Cartão de membro para comunidades locais",
    description:
      "Um cartão digital que mostra pertencimento, função, eventos frequentados e benefícios de uma comunidade.",
    details:
      "Comece com perfil, QR code e benefícios disponíveis. Pode funcionar para hubs de tecnologia, coletivos culturais, comunidades universitárias ou grupos de pessoas que constroem projetos.",
    tags: ["Comunidade", "Identidade", "Brasil"],
  },
  {
    id: "idea-117",
    category: "Consumo",
    title: "Feed de missões para embaixadores",
    description:
      "Um painel onde comunidades publicam missões simples e embaixadores registram entregas.",
    details:
      "O MVP pode ter missão, prazo, prova de entrega e pontuação. Use badges ou pontos para reconhecimento, sem precisar automatizar pagamento no começo.",
    tags: ["Comunidade", "Growth", "Reputação"],
  },
  {
    id: "idea-118",
    category: "Consumo",
    title: "Currículo de projetos para estudantes",
    description:
      "Uma página que organiza projetos, eventos, cursos e contribuições de estudantes em um currículo vivo.",
    details:
      "Comece com blocos editáveis e badges de validação por comunidade ou professor. O produto ajuda estudantes a mostrar prática, não só diploma.",
    tags: ["Educação", "Portfólio", "Brasil"],
  },
  {
    id: "idea-119",
    category: "Consumo",
    title: "Clube de desafios para hábitos saudáveis",
    description:
      "Um app de desafios em grupo para caminhada, treino, leitura ou estudo, com progresso e selos.",
    details:
      "O MVP pode ter desafio, check-in diário e ranking leve. Use colecionáveis como recompensa simbólica, mas mantenha a experiência parecida com um grupo de compromisso.",
    tags: ["Saúde", "Social", "Gamificação"],
  },
  {
    id: "idea-120",
    category: "Consumo",
    title: "Mural de provas para projetos open source",
    description:
      "Um mural onde contribuidores mostram issues resolvidas, PRs e impacto em projetos abertos.",
    details:
      "Comece com integração manual de links do GitHub, categorias de contribuição e perfil público. Depois, badges verificáveis podem destacar quem realmente entregou.",
    tags: ["Open source", "Reputação", "Dev tools"],
  },
  {
    id: "idea-121",
    category: "DeFi",
    title: "Painel de saúde de stablecoin",
    description:
      "Um painel educativo que mostra sinais básicos de saúde de uma stablecoin: liquidez, uso e volatilidade.",
    details:
      "O MVP pode comparar poucas stablecoins e explicar o que cada métrica significa. Não precisa dar recomendação, só transformar dados em uma leitura fácil.",
    tags: ["Stablecoins", "Analytics", "Educação"],
  },
  {
    id: "idea-122",
    category: "DeFi",
    title: "Simulador de proteção contra queda",
    description:
      "Uma ferramenta que mostra cenários de queda de mercado e formas simples de reduzir exposição.",
    details:
      "Comece com carteira fictícia, cenários de preço e opções como aumentar stablecoin ou reduzir alavancagem. O objetivo é educar, não executar estratégias sozinho.",
    tags: ["DeFi", "Risco", "Educação"],
  },
  {
    id: "idea-123",
    category: "DeFi",
    title: "Organizador de recibos DeFi",
    description:
      "Um app que transforma transações de swap, staking e lending em recibos agrupados por mês.",
    details:
      "O MVP pode receber carteira, listar transações e classificar por tipo. Para brasileiros, mostre valores aproximados em reais e exportação simples.",
    tags: ["DeFi", "Brasil", "Relatórios"],
  },
  {
    id: "idea-124",
    category: "DeFi",
    title: "Radar de pools novas com checklist de risco",
    description:
      "Um feed de pools novas acompanhado de perguntas básicas antes do usuário considerar entrar.",
    details:
      "A primeira versão pode ser curada ou usar dados mockados. Cada pool recebe checklist: liquidez, idade, protocolo, auditoria, volatilidade e sinais de alerta.",
    tags: ["DeFi", "Risco", "Analytics"],
  },
  {
    id: "idea-125",
    category: "DeFi",
    title: "Planejador de saída para memecoins",
    description:
      "Uma ferramenta para usuários definirem metas de saída antes de comprar tokens de alta volatilidade.",
    details:
      "O MVP pode ter preço de entrada, metas, stop manual e lembretes. O valor está em criar disciplina e registro, não em prever mercado.",
    tags: ["Trading", "Risco", "Consumo"],
  },
  {
    id: "idea-126",
    category: "DeFi",
    title: "Calculadora de preço médio",
    description:
      "Uma calculadora simples para quem comprou um token em várias entradas e quer entender o preço médio.",
    details:
      "Comece com input manual, importação opcional por carteira e gráfico simples. É uma ideia pequena, mas muito útil para iniciantes que se perdem em operações.",
    tags: ["Trading", "Educação", "Brasil"],
  },
  {
    id: "idea-127",
    category: "DeFi",
    title: "Comparador de staking líquido",
    description:
      "Um painel que explica opções de staking líquido, rendimento, liquidez e principais riscos.",
    details:
      "O MVP pode comparar 3 ou 4 opções e mostrar cenários simples. Foque em explicar termos como LST, liquidez e depeg de forma visual.",
    tags: ["Staking", "DeFi", "Educação"],
  },
  {
    id: "idea-128",
    category: "DeFi",
    title: "Alerta de concentração de carteira",
    description:
      "Um app que avisa quando a carteira está concentrada demais em um token, protocolo ou tipo de risco.",
    details:
      "Comece com análise por token e categorias simples. A entrega pode ser um score visual e sugestões educativas para pesquisar melhor.",
    tags: ["Wallet", "Risco", "Analytics"],
  },
  {
    id: "idea-129",
    category: "DeFi",
    title: "Mapa de protocolos para iniciantes",
    description:
      "Um mapa visual que mostra protocolos por função: swap, lending, staking, stablecoin e analytics.",
    details:
      "O MVP pode ser um diretório guiado com filtros e explicações. Não precisa integrar transações; o valor é ajudar o usuário a se localizar no ecossistema.",
    tags: ["Educação", "DeFi", "Onboarding"],
  },
  {
    id: "idea-130",
    category: "DeFi",
    title: "Assistente de declaração de operações",
    description:
      "Um organizador que ajuda usuários a classificar operações cripto para conversar com contador depois.",
    details:
      "O MVP pode agrupar transações por compra, venda, swap e rendimento, exportando um relatório simples. Evite prometer cálculo fiscal completo; foque em organização.",
    tags: ["Brasil", "Relatórios", "DeFi"],
  },
  {
    id: "idea-131",
    category: "DePIN",
    title: "Rede de dados de chuva por bairro",
    description:
      "Um mapa colaborativo para registrar chuva forte, alagamento e impacto em deslocamento.",
    details:
      "O MVP pode combinar relatos manuais, fotos e horário. A ideia é criar dados locais úteis para vizinhos, entregadores e organizadores de eventos.",
    tags: ["Clima", "Brasil", "Dados"],
  },
  {
    id: "idea-132",
    category: "DePIN",
    title: "Registro de coleta de óleo usado",
    description:
      "Um app para bares, restaurantes e condomínios registrarem coleta de óleo e impacto ambiental.",
    details:
      "Comece com cadastro de ponto, volume coletado, foto e histórico. Recompensas simbólicas podem incentivar consistência e visibilidade para parceiros locais.",
    tags: ["Impacto", "Brasil", "DePIN"],
  },
  {
    id: "idea-133",
    category: "DePIN",
    title: "Mapa de tomadas disponíveis em espaços públicos",
    description:
      "Um mapa comunitário de pontos para carregar celular ou notebook em cafés, bibliotecas e eventos.",
    details:
      "O MVP pode ter cadastro, foto, avaliação e horário de disponibilidade. É um caso leve de infraestrutura compartilhada com validação por usuários.",
    tags: ["Cidade", "Comunidade", "Brasil"],
  },
  {
    id: "idea-134",
    category: "DePIN",
    title: "Verificador de internet para coworkings",
    description:
      "Um painel colaborativo que registra velocidade e estabilidade de internet em cafés e coworkings.",
    details:
      "Comece com teste manual, nota do local e histórico. Pode ajudar trabalhadores remotos a escolherem onde trabalhar e criar dados úteis para os estabelecimentos.",
    tags: ["Trabalho remoto", "Dados", "Brasil"],
  },
  {
    id: "idea-135",
    category: "DePIN",
    title: "Prova de manutenção para equipamentos comunitários",
    description:
      "Um registro simples para confirmar manutenção de bicicletas, sensores, roteadores ou equipamentos compartilhados.",
    details:
      "O MVP pode ter item, responsável, checklist, foto e data. A camada onchain pode servir como histórico verificável para redes comunitárias ou projetos DePIN.",
    tags: ["DePIN", "Operações", "Comunidade"],
  },
  {
    id: "idea-136",
    category: "AI",
    title: "Tradutor de termos cripto para português simples",
    description:
      "Uma ferramenta que explica termos como staking, slippage, pool, oracle e bridge com exemplos do dia a dia.",
    details:
      "O MVP pode ser uma busca com explicação, analogia e alerta do que observar. É útil para onboarding e pode alimentar tooltips dentro de outros produtos.",
    tags: ["AI", "Educação", "Onboarding"],
  },
  {
    id: "idea-137",
    category: "AI",
    title: "Revisor de pitch para hackathon",
    description:
      "Um assistente que lê o pitch do time e sugere cortes, clareza e uma demo mais objetiva.",
    details:
      "Comece com campo de texto, análise de problema, usuário, diferencial e pedido final. Gere uma versão curta e uma versão de apresentação de dois minutos.",
    tags: ["AI", "Hackathon", "Apresentação"],
  },
  {
    id: "idea-138",
    category: "AI",
    title: "Agente de pesquisa de concorrentes",
    description:
      "Um assistente que organiza concorrentes, diferenciais e riscos para uma ideia de hackathon.",
    details:
      "O MVP pode pedir uma descrição da ideia e devolver uma tabela manualmente editável. Não precisa ser perfeito; precisa ajudar o time a fazer perguntas melhores.",
    tags: ["AI", "Pesquisa", "Planejamento"],
  },
  {
    id: "idea-139",
    category: "AI",
    title: "Assistente de documentação para comunidade",
    description:
      "Um app que transforma mensagens soltas, links e notas em uma página de documentação simples.",
    details:
      "O MVP pode receber texto bruto e gerar seções como começo rápido, perguntas frequentes e links importantes. Serve para comunidades que crescem mais rápido do que conseguem documentar.",
    tags: ["AI", "Comunidade", "Docs"],
  },
  {
    id: "idea-140",
    category: "AI",
    title: "Copiloto de tarefas para squads",
    description:
      "Um assistente que quebra uma ideia em tarefas pequenas e sugere quem do time deveria pegar cada uma.",
    details:
      "Comece com input de ideia, skills do time e prazo. Gere uma lista de tarefas por área: produto, front, back, contrato, design e apresentação.",
    tags: ["AI", "Times", "Hackathon"],
  },
  {
    id: "idea-141",
    category: "Infra",
    title: "Gerador de dados fictícios para demos",
    description:
      "Uma ferramenta que cria dados realistas para dashboards, carteiras, transações e usuários de um projeto.",
    details:
      "O MVP pode ter templates por tipo de app e exportar JSON. Isso ajuda times a construir demos bonitas antes de integrarem dados reais.",
    tags: ["Dev tools", "Demo", "Produtividade"],
  },
  {
    id: "idea-142",
    category: "Infra",
    title: "Validador de links de projeto",
    description:
      "Um checklist automático que verifica se demo, repositório, apresentação e redes sociais estão funcionando.",
    details:
      "Comece com uma URL do projeto e rode checks simples de status, metadados e screenshots. Muito útil antes de submissão em hackathon.",
    tags: ["Hackathon", "Dev tools", "QA"],
  },
  {
    id: "idea-143",
    category: "Infra",
    title: "Explorador de eventos de programa",
    description:
      "Uma tela para acompanhar eventos emitidos por um programa e filtrar por tipo ou usuário.",
    details:
      "O MVP pode receber program id, mostrar eventos recentes e permitir busca. Se dados reais forem difíceis, comece com mock e estrutura pronta para conectar depois.",
    tags: ["Solana", "Monitoring", "Dev tools"],
  },
  {
    id: "idea-144",
    category: "Infra",
    title: "Gerador de SDK mínimo",
    description:
      "Uma ferramenta que cria funções TypeScript básicas para interagir com um programa a partir de uma descrição.",
    details:
      "O MVP pode gerar arquivos de cliente, exemplos e instruções de uso. O valor está em acelerar integrações durante hackathons e reduzir código repetitivo.",
    tags: ["Dev tools", "Solana", "TypeScript"],
  },
  {
    id: "idea-145",
    category: "Infra",
    title: "Painel de logs para demos ao vivo",
    description:
      "Uma tela bonita que mostra ações do usuário, chamadas de API e transações durante uma apresentação.",
    details:
      "Comece com uma biblioteca pequena de eventos e um painel em tempo real. Ajuda jurados a entenderem o que está acontecendo sem abrir console ou explorer.",
    tags: ["Demo", "Monitoring", "Hackathon"],
  },
  {
    id: "idea-146",
    category: "Gaming",
    title: "Ranking de desafios entre turmas",
    description:
      "Um jogo para turmas ou comunidades competirem em desafios semanais de estudo, conteúdo ou construção.",
    details:
      "O MVP pode ter times, missões, pontos e ranking. Badges verificáveis podem registrar conquistas sem transformar o produto em algo complexo.",
    tags: ["Gaming", "Educação", "Comunidade"],
  },
  {
    id: "idea-147",
    category: "Gaming",
    title: "Mercado fictício de previsões para eventos",
    description:
      "Um jogo educativo onde usuários compram posições fictícias sobre resultados de eventos reais ou da comunidade.",
    details:
      "Comece com saldo fictício, mercados criados por admins e ranking. A ideia ensina previsão e probabilidade sem envolver dinheiro real.",
    tags: ["Prediction", "Gaming", "Educação"],
  },
  {
    id: "idea-148",
    category: "Gaming",
    title: "Coleção de conquistas para maratonas de código",
    description:
      "Um sistema de conquistas para participantes desbloquearem badges ao completar etapas de uma maratona.",
    details:
      "O MVP pode ter desafios, validação manual e perfil público. Funciona bem para hackathons, cursos intensivos e comunidades de programação.",
    tags: ["Hackathon", "Educação", "NFT"],
  },
  {
    id: "idea-149",
    category: "Governança",
    title: "Mural de decisões para projetos open source",
    description:
      "Um lugar para registrar decisões importantes de um projeto, contexto e responsáveis.",
    details:
      "Comece com decisão, opções consideradas, pessoa responsável e status. Ajuda times distribuídos a lembrar por que escolheram um caminho.",
    tags: ["Governança", "Open source", "Comunidade"],
  },
  {
    id: "idea-150",
    category: "Governança",
    title: "Consulta pública para decisões de comunidade",
    description:
      "Uma ferramenta para comunidades coletarem opinião antes de tomar decisões sobre orçamento, eventos ou regras.",
    details:
      "O MVP pode ter perguntas, votação, comentários e resultado público. Use identidade ou carteira apenas se a comunidade precisar evitar votos duplicados.",
    tags: ["Governança", "Comunidade", "Brasil"],
  },
  {
    id: "idea-151",
    category: "Pagamentos",
    title: "Cofre para metas de viagem em grupo",
    description:
      "Uma caixinha transparente onde amigos guardam dinheiro para uma viagem e acompanham o progresso de cada pessoa.",
    details:
      "O MVP pode ter grupo, meta, contribuições e gastos previstos. Use stablecoin como saldo digital e mostre tudo em reais para a experiência ficar familiar.",
    tags: ["Pagamentos", "Viagem", "Brasil"],
  },
  {
    id: "idea-152",
    category: "Pagamentos",
    title: "Repasse para artistas em eventos colaborativos",
    description:
      "Um painel para dividir a bilheteria entre artistas, produtores e fornecedores depois de um evento.",
    details:
      "Comece com receita total, custos, percentuais e recibos. O diferencial é transparência para eventos pequenos, onde confiança costuma depender de prints e planilhas soltas.",
    tags: ["Eventos", "Cultura", "Pagamentos"],
  },
  {
    id: "idea-153",
    category: "Pagamentos",
    title: "Pagamento para aulas avulsas online",
    description:
      "Um link de pagamento para professores venderem aulas avulsas com confirmação automática para o aluno.",
    details:
      "O MVP pode criar aula, horário, valor e link de pagamento. Depois do pagamento, gere confirmação, link de reunião e recibo simples para WhatsApp ou email.",
    tags: ["Educação", "Pagamentos", "Serviços"],
  },
  {
    id: "idea-154",
    category: "Pagamentos",
    title: "Conta de patrocínio para newsletters",
    description:
      "Uma ferramenta para newsletters receberem patrocínios pequenos e mostrarem entregas combinadas.",
    details:
      "Comece com proposta de patrocínio, status de pagamento e checklist de entregas. A stablecoin pode simplificar patrocínios internacionais para criadores brasileiros.",
    tags: ["Criadores", "Pagamentos", "B2B"],
  },
  {
    id: "idea-155",
    category: "Pagamentos",
    title: "Adiantamento simples para recebíveis de criadores",
    description:
      "Um simulador para criadores entenderem quanto poderiam adiantar de receitas futuras sem se perder em planilhas.",
    details:
      "O MVP pode ser educativo: receita esperada, taxa, prazo e cenário de pagamento. Não precisa liberar crédito real; a entrega pode ser uma simulação clara e responsável.",
    tags: ["Criadores", "Finanças", "Brasil"],
  },
  {
    id: "idea-156",
    category: "Pagamentos",
    title: "Controle de repasses para afiliados",
    description:
      "Um painel para produtos digitais acompanharem vendas por afiliado e repasses pendentes.",
    details:
      "Comece com links de afiliado, vendas simuladas, comissão e status de pagamento. A camada onchain pode registrar repasses finais em stablecoin.",
    tags: ["Criadores", "Pagamentos", "Crescimento"],
  },
  {
    id: "idea-157",
    category: "Pagamentos",
    title: "Conta para grupos de compra coletiva",
    description:
      "Um app para grupos comprarem juntos, acompanharem quem pagou e fecharem pedido quando a meta bater.",
    details:
      "O MVP pode ter produto, preço por pessoa, quantidade mínima e status de pagamento. Funciona para compras de bairro, comunidades universitárias e grupos de amigos.",
    tags: ["Consumo", "Brasil", "Pagamentos"],
  },
  {
    id: "idea-158",
    category: "Pagamentos",
    title: "Vale-alimentação comunitário",
    description:
      "Um sistema simples para distribuir créditos de alimentação em eventos, mutirões ou ações sociais.",
    details:
      "Comece com emissão de créditos, QR code de resgate e painel do organizador. A demo pode simular estabelecimentos parceiros e comprovantes de uso.",
    tags: ["Impacto", "Pagamentos", "Comunidade"],
  },
  {
    id: "idea-159",
    category: "Pagamentos",
    title: "Rifa transparente para causas locais",
    description:
      "Uma rifa digital com números, comprovantes, sorteio transparente e prestação de contas.",
    details:
      "O MVP pode cadastrar causa, números disponíveis, pagamentos e sorteio. Foque em clareza, regras e transparência, evitando parecer uma aposta sem contexto.",
    tags: ["Comunidade", "Brasil", "Transparência"],
  },
  {
    id: "idea-160",
    category: "Pagamentos",
    title: "Carteira de repasses para coletivos culturais",
    description:
      "Uma ferramenta para coletivos culturais dividirem cachês, custos e apoios de forma transparente.",
    details:
      "O MVP pode ter projeto, participantes, entradas, custos e repasses finais. É uma ideia boa para música, audiovisual, eventos independentes e produção cultural.",
    tags: ["Cultura", "Pagamentos", "Brasil"],
  },
  {
    id: "idea-161",
    category: "Consumo",
    title: "Identidade simples para comunidades de bairro",
    description:
      "Um cartão digital de membro para grupos locais, com presença, função e histórico de participação.",
    details:
      "Comece com perfil, QR code e validação por organizador. Pode ser usado por coletivos, redes de voluntários, grupos de estudo e associações locais.",
    tags: ["Identidade", "Comunidade", "Brasil"],
  },
  {
    id: "idea-162",
    category: "Consumo",
    title: "Diário de impacto para projetos sociais",
    description:
      "Uma página onde projetos sociais registram ações, fotos, números e apoiadores ao longo do tempo.",
    details:
      "O MVP pode ter linha do tempo, métricas simples e recibos de doação. A ideia ajuda ONGs pequenas a comunicar impacto sem depender de relatórios longos.",
    tags: ["Impacto", "Comunidade", "Transparência"],
  },
  {
    id: "idea-163",
    category: "Consumo",
    title: "Clube de descontos entre comunidades",
    description:
      "Uma rede onde membros de comunidades parceiras acessam descontos e benefícios locais.",
    details:
      "Comece com verificação de membro, lista de parceiros e resgate por QR code. O MVP pode focar em uma cidade ou evento para ficar simples.",
    tags: ["Loyalty", "Comunidade", "Brasil"],
  },
  {
    id: "idea-164",
    category: "Consumo",
    title: "Perfil de speaker para eventos",
    description:
      "Uma página para palestrantes mostrarem temas, eventos passados, avaliações e materiais.",
    details:
      "O MVP pode registrar participações, links de slides e feedback. Comunidades podem usar isso para convidar pessoas com histórico real.",
    tags: ["Eventos", "Reputação", "Comunidade"],
  },
  {
    id: "idea-165",
    category: "Consumo",
    title: "Lista de espera com prioridade por contribuição",
    description:
      "Uma lista de espera onde pessoas sobem de posição ao contribuir com feedback, indicação ou teste.",
    details:
      "Comece com cadastro, tarefas simples e ranking. A parte verificável pode entrar nos pontos de contribuição, ajudando projetos a encontrar usuários engajados.",
    tags: ["Crescimento", "Comunidade", "Reputação"],
  },
  {
    id: "idea-166",
    category: "Consumo",
    title: "Coleção de memórias para turmas",
    description:
      "Um álbum digital para turmas guardarem eventos, conquistas, fotos e mensagens de uma fase.",
    details:
      "O MVP pode ter turma, momentos, participantes e colecionáveis opcionais. É uma forma leve de usar web3 como memória compartilhada, não como finanças.",
    tags: ["Educação", "Social", "NFT"],
  },
  {
    id: "idea-167",
    category: "Consumo",
    title: "Passaporte de voluntariado corporativo",
    description:
      "Um registro para empresas acompanharem ações voluntárias de funcionários e impacto gerado.",
    details:
      "Comece com ações, presença, horas e certificado. O produto pode ajudar RH e impacto social sem exigir que usuários entendam blockchain.",
    tags: ["Impacto", "B2B", "Reputação"],
  },
  {
    id: "idea-168",
    category: "Consumo",
    title: "Rede de trocas para comunidades universitárias",
    description:
      "Um marketplace leve para estudantes trocarem livros, materiais, móveis e equipamentos usados.",
    details:
      "O MVP pode ter anúncios, reputação, reserva e confirmação de entrega. A camada onchain pode registrar reputação e histórico de trocas confiáveis.",
    tags: ["Estudantes", "Brasil", "Marketplace"],
  },
  {
    id: "idea-169",
    category: "Consumo",
    title: "Agenda de benefícios para participantes de hackathon",
    description:
      "Uma tela que reúne benefícios, créditos, mentorias e links importantes para participantes de um evento.",
    details:
      "Comece com lista de benefícios, status de resgate e lembretes. Pode virar um companion app de evento, com QR code para validar presença em atividades.",
    tags: ["Hackathon", "Eventos", "Comunidade"],
  },
  {
    id: "idea-170",
    category: "Consumo",
    title: "Perfil de confiança para vendedores informais",
    description:
      "Um cartão público com histórico, avaliações e comprovantes de vendas para pequenos vendedores.",
    details:
      "O MVP pode ter perfil, avaliações, links de pagamento e histórico de pedidos. Ajuda quem vende por WhatsApp ou Instagram a passar mais confiança.",
    tags: ["Comércio local", "Reputação", "Brasil"],
  },
  {
    id: "idea-171",
    category: "DeFi",
    title: "Painel de metas com proteção em stablecoin",
    description:
      "Um app que ajuda usuários a separar dinheiro de curto prazo em stablecoin e acompanhar metas.",
    details:
      "Comece com metas, depósito simulado e alertas de progresso. A educação deve explicar risco e volatilidade, sem vender stablecoin como poupança perfeita.",
    tags: ["Stablecoins", "Brasil", "Educação"],
  },
  {
    id: "idea-172",
    category: "DeFi",
    title: "Simulador de renda passiva conservadora",
    description:
      "Uma ferramenta educativa para comparar estratégias simples de rendimento com stablecoins e staking.",
    details:
      "O MVP pode comparar cenários, riscos e prazo. Não precisa integrar protocolos; o valor está em ensinar o usuário a fazer perguntas melhores antes de investir.",
    tags: ["DeFi", "Educação", "Stablecoins"],
  },
  {
    id: "idea-173",
    category: "DeFi",
    title: "Painel de liquidez para tokens de comunidade",
    description:
      "Um dashboard simples para comunidades entenderem volume, liquidez e concentração do próprio token.",
    details:
      "Comece com métricas básicas e alertas visuais. O produto ajuda comunidades a enxergarem risco sem depender de dashboards avançados.",
    tags: ["DeFi", "Comunidade", "Analytics"],
  },
  {
    id: "idea-174",
    category: "DeFi",
    title: "Organizador de estratégias copiadas",
    description:
      "Um app para usuários salvarem estratégias DeFi que viram em threads, vídeos ou grupos e acompanharem depois.",
    details:
      "O MVP pode ter cards com fonte, passos, risco e status. Em vez de executar a estratégia, o app ajuda a organizar e revisar com cuidado.",
    tags: ["DeFi", "Educação", "Planejamento"],
  },
  {
    id: "idea-175",
    category: "DeFi",
    title: "Checklist antes de comprar token novo",
    description:
      "Uma ferramenta que guia iniciantes por perguntas básicas antes de comprar um token desconhecido.",
    details:
      "Comece com checklist de liquidez, contrato, distribuição, comunidade e promessa de retorno. Gere uma pontuação educativa e links para pesquisa.",
    tags: ["Segurança", "Trading", "Educação"],
  },
  {
    id: "idea-176",
    category: "DeFi",
    title: "Comparador de carteiras de exemplo",
    description:
      "Um simulador com carteiras fictícias para diferentes perfis: iniciante, conservador, explorador e trader.",
    details:
      "O MVP pode mostrar alocação, riscos e evolução simulada. A ideia é ensinar composição de carteira sem capturar dinheiro do usuário.",
    tags: ["Educação", "DeFi", "Simulação"],
  },
  {
    id: "idea-177",
    category: "DeFi",
    title: "Monitor de promessas de rendimento",
    description:
      "Uma ferramenta que ajuda usuários a registrar e questionar promessas de rendimento alto que aparecem em comunidades.",
    details:
      "O MVP pode receber uma promessa, categorizar risco, pedir evidências e gerar perguntas críticas. O produto atua como educação contra golpes.",
    tags: ["Segurança", "DeFi", "Brasil"],
  },
  {
    id: "idea-178",
    category: "DeFi",
    title: "Extrato unificado de carteiras para família",
    description:
      "Um painel para explicar saldos e movimentações cripto de forma simples para familiares ou sócios.",
    details:
      "Comece com carteira, resumo mensal, principais tokens e notas explicativas. O usuário escolhe o que compartilhar, sem expor detalhes sensíveis por padrão.",
    tags: ["Wallet", "Relatórios", "Brasil"],
  },
  {
    id: "idea-179",
    category: "DeFi",
    title: "Radar de oportunidades com baixo valor inicial",
    description:
      "Um feed educativo de experiências DeFi que podem ser testadas com valores pequenos ou em rede de teste.",
    details:
      "O MVP pode listar missões de aprendizado, custo estimado e risco. Ideal para usuários que querem experimentar sem começar por apostas grandes.",
    tags: ["Educação", "DeFi", "Onboarding"],
  },
  {
    id: "idea-180",
    category: "DeFi",
    title: "Painel de metas para dólar digital",
    description:
      "Um app para brasileiros acompanharem uma reserva em dólar digital com metas, aportes e histórico.",
    details:
      "Comece com metas em reais e dólares, lançamentos manuais e gráfico simples. Explique riscos de stablecoin e use linguagem de reserva, não promessa de investimento.",
    tags: ["Stablecoins", "Brasil", "Finanças"],
  },
  {
    id: "idea-181",
    category: "DePIN",
    title: "Mapa de pontos de coleta seletiva",
    description:
      "Um mapa atualizado pela comunidade com pontos de coleta, horários e tipos de material aceitos.",
    details:
      "O MVP pode ter cadastro, confirmação por foto e avaliação. Recompensas simbólicas podem incentivar manutenção dos dados, sem precisar de hardware.",
    tags: ["Impacto", "Brasil", "Dados"],
  },
  {
    id: "idea-182",
    category: "DePIN",
    title: "Registro de sombra e conforto térmico",
    description:
      "Um mapa colaborativo de lugares com sombra, água e descanso em dias de calor.",
    details:
      "Comece com pontos no mapa, fotos e notas por horário. Pode ser útil para entregadores, pedestres, corredores e eventos ao ar livre.",
    tags: ["Clima", "Cidade", "Brasil"],
  },
  {
    id: "idea-183",
    category: "DePIN",
    title: "Rede de medição de filas em serviços públicos",
    description:
      "Um app onde usuários reportam tempo de espera em postos, cartórios e serviços presenciais.",
    details:
      "O MVP pode ter local, tempo estimado, horário e confirmação por múltiplos relatos. O valor é criar dados úteis para cidadãos sem depender de integração oficial.",
    tags: ["Dados", "Brasil", "Cidade"],
  },
  {
    id: "idea-184",
    category: "DePIN",
    title: "Monitor de iluminação pública por bairro",
    description:
      "Um mapa colaborativo para registrar pontos escuros, postes apagados e histórico de resolução.",
    details:
      "Comece com foto, localização aproximada e status. A camada verificável ajuda a criar histórico público para moradores e grupos locais cobrarem solução.",
    tags: ["Cidade", "Brasil", "Impacto"],
  },
  {
    id: "idea-185",
    category: "DePIN",
    title: "Prova de presença em mutirões",
    description:
      "Um app para registrar presença e tarefas realizadas em mutirões de limpeza, doação ou reforma.",
    details:
      "O MVP pode usar QR code, foto opcional e perfil de voluntário. Isso cria histórico de impacto e facilita reconhecimento de quem participou.",
    tags: ["Impacto", "Comunidade", "Brasil"],
  },
  {
    id: "idea-186",
    category: "AI",
    title: "Assistente de moderação para comunidades brasileiras",
    description:
      "Um bot que ajuda moderadores a resumir discussões, detectar dúvidas repetidas e sugerir respostas.",
    details:
      "O MVP pode receber mensagens exportadas ou coladas, gerar resumo e listar tópicos quentes. Foque em apoiar moderadores, não substituir julgamento humano.",
    tags: ["AI", "Comunidade", "Suporte"],
  },
  {
    id: "idea-187",
    category: "AI",
    title: "Leitor de contrato em linguagem simples",
    description:
      "Uma ferramenta que explica cláusulas de um contrato simples e destaca pontos de atenção.",
    details:
      "O MVP pode receber PDF ou texto, gerar resumo e perguntas para fazer a um advogado. Não deve dar aconselhamento jurídico, apenas organizar leitura.",
    tags: ["AI", "Legal", "Brasil"],
  },
  {
    id: "idea-188",
    category: "AI",
    title: "Agente de pesquisa para pequenos negócios",
    description:
      "Um assistente que ajuda pequenos negócios a entender concorrentes, preços e canais antes de lançar uma oferta.",
    details:
      "Comece com um formulário sobre produto, cidade e público. Gere hipóteses, perguntas de validação e uma lista de próximos experimentos.",
    tags: ["AI", "Pesquisa", "Brasil"],
  },
  {
    id: "idea-189",
    category: "AI",
    title: "Resumo de calls para squads de hackathon",
    description:
      "Um app que transforma uma reunião do time em tarefas, decisões e riscos para acompanhar depois.",
    details:
      "O MVP pode receber transcrição ou notas coladas e gerar ata curta, responsáveis e próximos passos. É útil porque times iniciantes se perdem rápido em conversa.",
    tags: ["AI", "Times", "Produtividade"],
  },
  {
    id: "idea-190",
    category: "AI",
    title: "Assistente de validação de problema",
    description:
      "Um app que ajuda o time a separar problema real, público-alvo, evidências e suposições.",
    details:
      "Comece com perguntas guiadas e um canvas simples. A saída pode ser uma página compartilhável com hipótese, usuário, dor e experimento de validação.",
    tags: ["AI", "Produto", "Hackathon"],
  },
  {
    id: "idea-191",
    category: "Infra",
    title: "Gerador de ambiente de demo",
    description:
      "Uma ferramenta que cria variáveis, dados simulados e instruções para rodar uma demo sem depender de produção.",
    details:
      "O MVP pode gerar um checklist e arquivos de exemplo. O valor é ajudar times a apresentarem algo estável, mesmo quando a integração final ainda está frágil.",
    tags: ["Demo", "Dev tools", "Hackathon"],
  },
  {
    id: "idea-192",
    category: "Infra",
    title: "Comparador de exploradores Solana",
    description:
      "Uma página que abre a mesma transação ou endereço em diferentes exploradores e destaca diferenças de leitura.",
    details:
      "Comece com input de assinatura ou endereço e links para exploradores. Adicione resumo próprio em português para ajudar iniciantes e jurados.",
    tags: ["Solana", "Dev tools", "UX"],
  },
  {
    id: "idea-193",
    category: "Infra",
    title: "Validador de metadados de projeto",
    description:
      "Um checklist que confere nome, descrição, links, imagens e redes antes da submissão de um projeto.",
    details:
      "O MVP pode validar URLs, tamanhos de imagem e presença de campos obrigatórios. É simples, mas evita submissões quebradas em hackathons.",
    tags: ["Hackathon", "QA", "Dev tools"],
  },
  {
    id: "idea-194",
    category: "Infra",
    title: "Painel de erros comuns em Anchor",
    description:
      "Uma biblioteca pesquisável de erros comuns em Anchor e Solana com explicações curtas em português.",
    details:
      "Comece com erros manuais, busca e exemplos de correção. Depois, o usuário pode colar logs e receber uma sugestão provável.",
    tags: ["Solana", "Educação", "Dev tools"],
  },
  {
    id: "idea-195",
    category: "Infra",
    title: "Gerador de página pública para APIs",
    description:
      "Uma ferramenta que transforma endpoints de uma API em documentação visual e testável.",
    details:
      "O MVP pode aceitar JSON ou OpenAPI, gerar lista de endpoints e exemplos. Times de hackathon ganham uma página de integração sem escrever documentação manualmente.",
    tags: ["Docs", "Dev tools", "API"],
  },
  {
    id: "idea-196",
    category: "Gaming",
    title: "Campeonato de quizzes sobre Solana",
    description:
      "Um jogo de perguntas por rodada para comunidades aprenderem Solana competindo em times.",
    details:
      "O MVP pode ter perguntas, salas, pontuação e ranking. Badges de participação podem ser emitidos ao final, mas o jogo precisa funcionar só com navegador.",
    tags: ["Gaming", "Educação", "Solana"],
  },
  {
    id: "idea-197",
    category: "Gaming",
    title: "Corrida de tarefas para hackathons",
    description:
      "Um jogo interno onde squads ganham pontos por completar milestones de produto, demo e pitch.",
    details:
      "Comece com quadro de missões, pontos e ranking amigável. A ideia ajuda organizadores a guiar times iniciantes durante o evento.",
    tags: ["Hackathon", "Gaming", "Produtividade"],
  },
  {
    id: "idea-198",
    category: "Gaming",
    title: "Coleção de conquistas para comunidades de games",
    description:
      "Um sistema de badges para campeonatos, participação em guildas e conquistas de jogadores.",
    details:
      "O MVP pode ter perfil, badges manuais e ranking por evento. A camada onchain pode tornar conquistas portáveis entre comunidades.",
    tags: ["Gaming", "Comunidade", "NFT"],
  },
  {
    id: "idea-199",
    category: "Governança",
    title: "Painel de orçamento para hackathons",
    description:
      "Uma página para organizadores mostrarem prêmios, custos, patrocinadores e uso de verba.",
    details:
      "Comece com entradas, despesas e anexos. É útil para comunidades que querem operar de forma mais transparente com patrocinadores e participantes.",
    tags: ["Governança", "Eventos", "Transparência"],
  },
  {
    id: "idea-200",
    category: "Governança",
    title: "Registro de decisões para squads",
    description:
      "Um diário leve para times registrarem decisões de produto, trade-offs e responsáveis durante o hackathon.",
    details:
      "O MVP pode ter decisão, contexto, opções descartadas e próximos passos. Ajuda o time a explicar o caminho para mentores e jurados no final.",
    tags: ["Governança", "Hackathon", "Times"],
  },
];
