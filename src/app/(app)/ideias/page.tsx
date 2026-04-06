import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";

export const dynamic = "force-dynamic";

const MOCK_IDEAS = [
  {
    id: "1",
    category: "DeFi",
    title: "Yield router para stablecoins em Solana",
    description:
      "Um roteador que redistribui capital entre protocolos de lending e pools de liquidez para buscar o melhor retorno com risco controlado.",
    fit: "Bom para times com engenharia forte e alguem puxando produto.",
    tags: ["DeFi", "Infra", "Analytics"],
  },
  {
    id: "2",
    category: "Payments",
    title: "Checkout onchain para creators brasileiros",
    description:
      "Fluxo simples para vender produtos digitais com pagamento em stablecoin e reconciliacao com PIX para operacao local.",
    fit: "Combina bem com design, GTM e alguem com repertorio em pagamentos.",
    tags: ["Payments", "Consumer", "Brasil"],
  },
  {
    id: "3",
    category: "Governance",
    title: "Radar de votacoes e teses para DAOs",
    description:
      "Um painel que organiza propostas, resume contexto e ajuda comunidades a acompanhar decisoes mais rapido.",
    fit: "Boa para squads com community builder, design e full-stack.",
    tags: ["Governance", "Community", "Dashboard"],
  },
  {
    id: "4",
    category: "Consumer",
    title: "Social wallet com reputacao por contribuicao",
    description:
      "Uma carteira voltada para grupos e criadores, com historico de acoes, prova social e reputacao compartilhavel.",
    fit: "Funciona quando o time quer algo mais narrativo e orientado a produto.",
    tags: ["Consumer", "Social", "Identity"],
  },
  {
    id: "5",
    category: "DePIN",
    title: "Camada de monitoramento para sensores ambientais",
    description:
      "Rede com incentivos para dados de qualidade, visualizacao de cobertura e mecanismos simples de validacao.",
    fit: "Pede alguem tecnico, alguem de produto e repertorio em operacao real.",
    tags: ["DePIN", "Data", "Infra"],
  },
  {
    id: "6",
    category: "Infra",
    title: "Copiloto de observabilidade para apps onchain",
    description:
      "Ferramenta que centraliza eventos, alertas e fluxos criticos para equipes pequenas enviarem mais rapido sem perder visibilidade.",
    fit: "Boa para squads tecnicos que querem demo forte e utilidade imediata.",
    tags: ["Infra", "Developer Tools", "B2B"],
  },
];

export default function IdeasPage() {
  return (
    <main className="relative min-h-screen overflow-hidden px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.10),transparent_44%),radial-gradient(circle_at_18%_22%,rgba(0,139,76,0.20),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
        <Image
          src="/brand/elements/morth-21.svg"
          alt=""
          width={320}
          height={320}
          className="absolute -right-10 top-4 opacity-16"
        />
        <Image
          src="/brand/elements/morth-09.svg"
          alt=""
          width={220}
          height={220}
          className="absolute left-0 top-56 -translate-x-1/3 opacity-12"
        />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl">
        <section className="pb-10 pt-4">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Etapa de inspiracao
            </p>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl">
              Ideias para tirar o time
              <span className="block text-brand-emerald">do branco rapido</span>
            </h1>
          </div>
        </section>

        <section className="pb-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-emerald/82">
                Biblioteca inicial
              </p>
              <h2 className="mt-2 font-heading text-3xl font-bold sm:text-4xl">
                Referencias para o time ganhar tracao logo no comeco.
              </h2>
            </div>
            <p className="max-w-md text-sm leading-7 text-brand-off-white/62">
              Cada card aqui e um ponto de partida. O time pode adaptar,
              simplificar ou misturar ideias sem precisar comecar do zero.
            </p>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {MOCK_IDEAS.map((idea, index) => (
            <Card
              key={idea.id}
              className="group rounded-[1.75rem] bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6 transition-transform duration-200 hover:-translate-y-1"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/42">
                    Ideia {String(index + 1).padStart(2, "0")}
                  </p>
                  <p className="mt-2 text-sm font-medium uppercase tracking-[0.16em] text-brand-emerald">
                    {idea.category}
                  </p>
                </div>
                <span className="rounded-full border border-brand-yellow/25 bg-brand-yellow/10 px-3 py-1 text-xs uppercase tracking-[0.14em] text-brand-yellow">
                  ponto de partida
                </span>
              </div>

              <h3 className="mt-5 font-heading text-2xl font-semibold leading-tight text-brand-off-white">
                {idea.title}
              </h3>

              <p className="mt-4 text-sm leading-7 text-brand-off-white/68">
                {idea.description}
              </p>

              <div className="mt-5 rounded-2xl border border-brand-green/22 bg-brand-green/8 px-4 py-4">
                <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
                  Melhor encaixe
                </p>
                <p className="mt-2 text-sm leading-7 text-brand-off-white/86">
                  {idea.fit}
                </p>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {idea.tags.map((tag, tagIndex) => (
                  <Tag
                    key={tag}
                    selected={tagIndex === 0}
                    tone={tagIndex === 0 ? "emerald" : "neutral"}
                    className="cursor-default"
                    disabled
                  >
                    {tag}
                  </Tag>
                ))}
              </div>
            </Card>
          ))}
        </section>
      </div>
    </main>
  );
}
