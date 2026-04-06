import Image from 'next/image';

export const dynamic = 'force-dynamic';

const MOCK_IDEAS = [
  {
    id: '1',
    title: 'DeFi Yield Aggregator para Solana',
    description: 'Agregador que otimiza yield farming automaticamente entre protocolos Solana.',
    tags: ['DeFi', 'Developer Infrastructure'],
  },
  {
    id: '2',
    title: 'Marketplace de NFTs para Artistas Brasileiros',
    description: 'Plataforma focada em artistas locais com pagamentos em Real via PIX.',
    tags: ['Consumer / Other', 'RWAs'],
  },
  {
    id: '3',
    title: 'DAO Governance Dashboard',
    description: 'Painel unificado para participar de votações em múltiplas DAOs.',
    tags: ['Community DAOs', 'Developer Infrastructure'],
  },
  {
    id: '4',
    title: 'Gaming Rewards on Solana',
    description: 'Sistema de recompensas em tokens para jogos mobile integrados com Solana.',
    tags: ['Gaming', 'Payments'],
  },
  {
    id: '5',
    title: 'DePIN Sensor Network',
    description: 'Rede descentralizada de sensores ambientais com incentivos em token.',
    tags: ['DePIN', 'Security Tools'],
  },
  {
    id: '6',
    title: 'Social Trading Platform',
    description: 'Copy-trading social com perfis on-chain e reputação transparente.',
    tags: ['Social', 'DeFi'],
  },
];

export default function IdeasPage() {
  return (
    <main className="flex min-h-screen flex-col items-center px-4 py-8">
      <div className="w-full max-w-2xl">
        <div className="mb-8 text-center">
          <Image src="/brand/logo/symbol.svg" alt="" width={40} height={40} className="mx-auto" />
          <h1 className="mt-3 font-heading text-2xl font-bold">Inspiração</h1>
          <p className="mt-1 text-sm text-brand-off-white/60">
            Ideias de hackathons anteriores para inspirar seu time
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {MOCK_IDEAS.map((idea) => (
            <div key={idea.id} className="rounded-lg border border-brand-green/30 p-4">
              <h3 className="font-heading text-base font-semibold">{idea.title}</h3>
              <p className="mt-1 text-sm text-brand-off-white/60">{idea.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">
                {idea.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs text-brand-off-white/50">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
