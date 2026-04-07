import Image from "next/image";
import { Card } from "@/components/ui/card";
import { searchProjects } from "@/lib/colosseum";
import { IdeaSearch } from "@/components/ideas/idea-search";
import type { CopilotFacetBucket } from "@/types/colosseum";

export const dynamic = "force-dynamic";

export default async function IdeasPage() {
  const result = await searchProjects({ limit: 12, includeFacets: true });

  const projects = result.ok ? result.data.results : [];
  const totalFound = result.ok ? result.data.totalFound : 0;
  const hackathonFacets: CopilotFacetBucket[] =
    result.ok ? (result.data.facets?.hackathons ?? []) : [];
  const clusterFacets: CopilotFacetBucket[] =
    result.ok ? (result.data.facets?.clusters ?? []) : [];

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
        {/* Hero */}
        <section className="pb-10 pt-4">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Projetos reais do Colosseum
            </p>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl">
              Ideias para tirar o time
              <span className="block text-brand-emerald">do branco rápido</span>
            </h1>
          </div>
        </section>

        {/* Attribution + intro */}
        <section className="pb-6">
          <Card className="rounded-[1.75rem] border-brand-yellow/20 bg-[linear-gradient(135deg,rgba(255,210,63,0.08),rgba(27,35,29,0.94)_42%,rgba(0,139,76,0.06))] p-6 sm:p-8">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-yellow/72">
              Acervo Colosseum
            </p>
            <p className="mt-3 max-w-2xl text-base leading-8 text-brand-off-white/70">
              Busque projetos reais submetidos em hackathons Colosseum para
              encontrar referências, padrões e possíveis caminhos para o seu
              time.
            </p>
            <div className="mt-4 flex gap-4">
              <a
                href="https://docs.colosseum.com/copilot/introduction"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
              >
                Sobre o acervo
              </a>
              <a
                href="https://github.com/ColosseumOrg/colosseum-copilot"
                target="_blank"
                rel="noreferrer"
                className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
              >
                Código aberto
              </a>
            </div>
          </Card>
        </section>

        {/* Search + Results */}
        <section>
          {result.ok ? (
            <IdeaSearch
              initialProjects={projects}
              initialTotal={totalFound}
              hackathonFacets={hackathonFacets}
              clusterFacets={clusterFacets}
            />
          ) : (
            <div className="rounded-2xl border border-brand-green/20 bg-brand-green/8 px-8 py-12 text-center">
              <p className="text-sm text-brand-off-white/52">
                Não foi possível carregar projetos agora. Tente novamente em
                alguns minutos.
              </p>
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
