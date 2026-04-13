import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { TrackPageView } from "@/components/ui/track-event";
import { UtmCapture } from "@/components/ui/utm-capture";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { resolveAuthenticatedUserState } from '@/lib/user-state';

const BENEFITS = [
  {
    title: "Time diverso",
    description:
      "Cada time mistura quem programa, quem pesquisa, quem apresenta e quem organiza.",
  },
  {
    title: "Perfil em 1 minuto",
    description:
      "Diz o que você faz, entra na fila e pronto. Sem formulário longo.",
  },
  {
    title: "Direto pro WhatsApp",
    description:
      "Quando o time sai, vocês já se conectam e começam a construir.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Crie seu perfil",
    description:
      "Diz como pode ajudar e o que te interessa. Leva menos de 1 minuto.",
  },
  {
    step: "02",
    title: "Entre na fila",
    description:
      "A plataforma monta times de 3 a 4 pessoas com perfis complementares.",
  },
  {
    step: "03",
    title: "Receba seu time",
    description:
      "Você recebe um email, entra na plataforma e já pode começar.",
  },
];

const IDEA_SIGNALS = [
  { label: "Ideias curadas", value: "200+ ideias prontas para hackathon" },
  { label: "Acervo Colosseum", value: "5.400+ projetos reais já submetidos" },
  { label: "Filtros", value: "Busca por categoria, track e tecnologia" },
];

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  let resolvedState = null;
  try {
    resolvedState = await resolveAuthenticatedUserState();
  } catch {
    // During Supabase outage, treat as unauthenticated and show landing page
  }

  const primaryHref = resolvedState?.redirectPath ?? '/profile';
  const primaryLabel = resolvedState ? 'Continuar de onde parei' : 'Encontrar meu time';
  const headerHref = resolvedState?.redirectPath ?? '/auth';
  const headerLabel = 'Entrar';

  return (
    <main className="relative overflow-hidden">
      <TrackPageView event="landing_view" />
      <Suspense>
        <UtmCapture />
      </Suspense>

      <section className="relative isolate overflow-hidden px-4 pb-44 pt-6 sm:px-6 sm:pb-56 lg:px-8 lg:pb-72">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[52rem] bg-[radial-gradient(circle_at_50%_4%,rgba(255,210,63,0.22),transparent_30%),radial-gradient(circle_at_20%_30%,rgba(0,139,76,0.3),transparent_26%),radial-gradient(circle_at_80%_20%,rgba(48,108,64,0.18),transparent_20%),linear-gradient(180deg,#1b231d_0%,#142019_38%,#0d1511_68%,#070b09_100%)] lg:h-[62rem]" />
          <div className="absolute left-[31%] top-36 h-[24rem] w-[28rem] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,rgba(245,232,202,0.16)_0%,rgba(245,232,202,0.05)_40%,rgba(245,232,202,0)_72%)] blur-[90px] lg:top-38 lg:h-[32rem] lg:w-[36rem]" />
          <div className="absolute left-[37%] top-24 h-72 w-[32rem] -translate-x-1/2 rounded-full bg-brand-yellow/14 blur-[110px] sm:h-80 sm:w-[38rem] lg:top-18 lg:h-[26rem] lg:w-[46rem]" />
          <div className="absolute left-[24%] top-44 h-56 w-[26rem] -translate-x-1/2 rounded-full bg-brand-emerald/12 blur-[120px] sm:w-[30rem] lg:top-48 lg:h-72 lg:w-[38rem]" />
          <div className="absolute inset-x-[10%] bottom-20 h-48 rounded-full bg-brand-emerald/14 blur-[120px] lg:bottom-16 lg:h-64" />
          <div className="absolute inset-x-0 bottom-0 h-72 bg-[linear-gradient(180deg,rgba(27,35,29,0)_0%,rgba(10,15,12,0.34)_18%,rgba(6,9,8,0.78)_66%,rgba(7,11,9,0.94)_100%)] sm:h-80 lg:h-[28rem]" />
          <div className="absolute inset-x-[18%] bottom-[-3.5rem] h-44 rounded-full bg-[radial-gradient(circle,rgba(0,139,76,0.26)_0%,rgba(0,139,76,0.08)_38%,rgba(0,139,76,0)_72%)] blur-3xl lg:bottom-[-5rem] lg:h-56" />
          <Image
            src="/brand/elements/morth-05.svg"
            alt=""
            width={380}
            height={380}
            className="absolute -left-20 top-20 rotate-6 opacity-20"
          />
          <Image
            src="/brand/elements/morth-21.svg"
            alt=""
            width={320}
            height={320}
            className="absolute right-[-3rem] top-10 -rotate-12 opacity-20"
          />
          <Image
            src="/brand/elements/morth-14.svg"
            alt=""
            width={180}
            height={180}
            className="absolute left-1/2 top-[28rem] -translate-x-1/2 opacity-15"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4">
            <Image
              src="/brand/logo/logo-horizontal.svg"
              alt="Superteam Brasil"
              width={220}
              height={52}
              priority
            />
            <div className="hidden items-center gap-3 sm:flex">
              <Link
                href="/support"
                className="rounded-full border border-brand-green/25 bg-brand-dark-green/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/72 transition-colors hover:border-brand-green hover:text-brand-off-white"
              >
                Suporte
              </Link>
              <Link
                href={headerHref}
                className="text-sm font-medium text-brand-off-white/70 transition-colors hover:text-brand-off-white"
              >
                {headerLabel}
              </Link>
            </div>
          </div>

          <div className="mt-16 grid min-h-[36rem] items-center gap-12 sm:min-h-[40rem] lg:mt-[5.5rem] lg:min-h-[50rem] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative max-w-2xl">
              <div className="pointer-events-none absolute -left-10 top-8 h-56 w-56 rounded-full bg-brand-yellow/8 blur-[100px] lg:-left-20 lg:top-4 lg:h-72 lg:w-72" />
              <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Frontier Hackathon — Colosseum
              </p>

              <h1 className="mt-6 max-w-[13ch] font-heading text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:max-w-[12ch] lg:text-[5.5rem]">
                Monte um time
                <span className="block text-brand-yellow">
                  forte de verdade
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-off-white/74 sm:text-xl">
                Encontre pessoas que complementam você e comece a construir
                em minutos.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href={primaryHref} className="sm:min-w-52">
                  <Button variant="primary" size="lg" fullWidth>
                    {primaryLabel}
                  </Button>
                </Link>
                <a
                  href="#como-funciona"
                  className="inline-flex items-center justify-center rounded-lg border border-brand-off-white/18 px-6 py-4 text-sm font-medium text-brand-off-white/80 transition-colors hover:border-brand-off-white/35 hover:text-brand-off-white"
                >
                  Ver como funciona
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="relative z-30 -mt-44 px-4 pb-12 pt-0 sm:-mt-48 sm:px-6 lg:-mt-64 lg:px-8">
        <div className="pointer-events-none absolute inset-x-0 top-[-8rem] h-80 bg-[radial-gradient(circle_at_50%_18%,rgba(0,139,76,0.18),rgba(0,139,76,0.07)_32%,rgba(0,139,76,0)_66%),linear-gradient(180deg,rgba(7,11,9,0)_0%,rgba(7,11,9,0.78)_36%,rgba(7,11,9,0.98)_58%,rgba(7,11,9,0)_100%)] blur-3xl lg:top-[-12rem] lg:h-[28rem]" />
        <div className="mx-auto max-w-6xl">
          <Card className="relative overflow-hidden rounded-[3.25rem] border-brand-green/45 bg-[linear-gradient(145deg,rgba(12,18,14,0.92)_0%,rgba(18,43,29,0.97)_38%,rgba(9,13,11,1)_100%)] p-6 shadow-[0_52px_170px_rgba(0,0,0,0.56)] sm:p-8 lg:p-12">
            <div className="pointer-events-none absolute inset-0">
              <div className="absolute left-[8%] top-0 h-32 w-60 rounded-full bg-brand-emerald/18 blur-3xl lg:h-44 lg:w-96" />
              <div className="absolute right-[10%] top-10 h-28 w-44 rounded-full bg-brand-yellow/8 blur-3xl lg:h-36 lg:w-56" />
              <div className="absolute inset-x-0 top-0 h-24 bg-[linear-gradient(180deg,rgba(255,255,255,0.07),rgba(255,255,255,0))]" />
            </div>

            <div className="relative grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
              <div className="max-w-xl">
                <p className="text-sm uppercase tracking-[0.24em] text-brand-emerald/82">
                  Inspiração para o time
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-[3.25rem]">
                  Não sabe o que construir? A gente te ajuda.
                </h2>
                <p className="mt-5 text-base leading-8 text-brand-off-white/70">
                  Explore ideias prontas para hackathon ou busque em milhares de
                  projetos reais já submetidos no Colosseum.
                </p>
                <div className="mt-7">
                  <Link href="/ideas" className="inline-flex">
                    <Button variant="accent" size="lg">
                      Explorar ideias
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="grid gap-3">
                {IDEA_SIGNALS.map((signal) => (
                  <div
                    key={signal.label}
                    className="rounded-[1.7rem] border border-brand-green/34 bg-[linear-gradient(180deg,rgba(26,36,29,0.84),rgba(10,15,12,0.98))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_20px_48px_rgba(0,0,0,0.22)]"
                  >
                    <p className="text-xs uppercase tracking-[0.18em] text-brand-emerald/72">
                      {signal.label}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-brand-off-white">
                      {signal.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </section>

      <section className="border-y border-brand-green/20 bg-brand-dark-green/80 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-emerald/80">
              Por que usar
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Monta time em minutos, não em dias.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <Card
                key={benefit.title}
                className="rounded-2xl bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6"
              >
                <h3 className="font-heading text-2xl font-semibold">
                  {benefit.title}
                </h3>
                <p className="mt-3 text-sm leading-7 text-brand-off-white/66">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section
        id="como-funciona"
        className="relative px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-12">
          <Image
            src="/brand/elements/morth-09.svg"
            alt=""
            width={260}
            height={260}
            className="absolute left-0 top-20 -translate-x-1/3"
          />
          <Image
            src="/brand/elements/morth-27.svg"
            alt=""
            width={260}
            height={260}
            className="absolute bottom-12 right-0 translate-x-1/4"
          />
        </div>

        <div className="relative z-10 mx-auto max-w-6xl">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className="text-sm uppercase tracking-[0.2em] text-brand-yellow/82">
                Como funciona
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
                Três passos. Pronto pra construir.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-brand-off-white/68">
                Sem processo longo. Você preenche o perfil, entra na fila e
                recebe seu time.
              </p>
            </div>

            <div className="grid gap-4">
              {STEPS.map((item) => (
                <Card
                  key={item.step}
                  className="grid gap-5 rounded-2xl bg-brand-dark-green/65 p-6 sm:grid-cols-[6rem_1fr]"
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-brand-emerald/16 font-heading text-xl font-bold text-brand-emerald">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-heading text-2xl font-semibold">
                      {item.title}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-brand-off-white/66">
                      {item.description}
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="px-4 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-5xl">
          <Card className="relative overflow-hidden rounded-[2rem] border-brand-yellow/30 bg-[linear-gradient(135deg,rgba(255,210,63,0.12),rgba(0,139,76,0.12),rgba(27,35,29,0.96))] px-6 py-10 sm:px-10">
            <Image
              src="/brand/elements/morth-01.svg"
              alt=""
              width={170}
              height={170}
              className="pointer-events-none absolute -right-10 -top-10 opacity-18"
            />

            <div className="relative z-10 max-w-2xl">
              <p className="text-sm uppercase tracking-[0.2em] text-brand-yellow">
                Bora?
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Seu time pode estar a poucos minutos de distância.
              </h2>
              <p className="mt-4 text-base leading-8 text-brand-off-white/72">
                Crie seu perfil, entre na fila e comece a construir com
                pessoas que complementam você.
              </p>

              <div className="mt-8">
                <Link href="/profile" className="inline-flex">
                  <Button variant="secondary" size="lg">
                    Criar meu perfil
                  </Button>
                </Link>
              </div>
            </div>
          </Card>
        </div>
      </section>
    </main>
  );
}
