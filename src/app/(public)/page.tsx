import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { TrackPageView } from "@/components/ui/track-event";
import { UtmCapture } from "@/components/ui/utm-capture";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

const BENEFITS = [
  {
    title: "Times equilibrados",
    description:
      "Formação por função, experiência e interesse para reduzir combinações aleatórias.",
  },
  {
    title: "Onboarding rápido",
    description:
      "Perfil em menos de um minuto, sem chat interno e sem fricção desnecessária.",
  },
  {
    title: "Pronto para construir",
    description:
      "Assim que o time fica pronto, vocês já entram em modo execução via WhatsApp.",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Preencha seu perfil",
    description:
      "Conte sua função principal, experiência e áreas de interesse.",
  },
  {
    step: "02",
    title: "Entre na fila",
    description:
      "A plataforma agrupa pessoas compatíveis em times de 3 a 4 membros.",
  },
  {
    step: "03",
    title: "Encontre seu time",
    description:
      "Quando o time estiver pronto, você entra e já começa a organizar a ideia.",
  },
];

const IDEA_SIGNALS = [
  "Referências para começar a conversa",
  "Temas e categorias para o time se alinhar mais rápido",
  "Inspiração sem virar uma lista confusa",
];

export default function LandingPage() {
  return (
    <main className="relative overflow-hidden">
      <TrackPageView event="landing_view" />
      <Suspense>
        <UtmCapture />
      </Suspense>

      <section className="relative isolate overflow-hidden px-4 pb-20 pt-6 sm:px-6 lg:px-8">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[38rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.16),transparent_45%),radial-gradient(circle_at_18%_30%,rgba(0,139,76,0.22),transparent_30%),linear-gradient(180deg,#1b231d_0%,#162018_52%,#1b231d_100%)]" />
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
                href="/ideas"
                className="rounded-full border border-brand-green/25 bg-brand-dark-green/55 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-brand-off-white/72 transition-colors hover:border-brand-green hover:text-brand-off-white"
              >
                Ideias
              </Link>
              <Link
                href="/auth"
                className="text-sm font-medium text-brand-off-white/70 transition-colors hover:text-brand-off-white"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div className="mt-14 grid items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
            <div className="max-w-2xl">
              <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Formação de times para hackathon
              </p>

              <h1 className="mt-6 font-heading text-5xl font-bold leading-[0.95] tracking-tight sm:text-6xl lg:text-7xl">
                Monte um time
                <span className="block text-brand-yellow">
                  forte de verdade
                </span>
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-brand-off-white/74 sm:text-xl">
                Crie seu perfil, entre na fila e receba um time compatível
                para começar rápido.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/profile" className="sm:min-w-52">
                  <Button variant="primary" size="lg" fullWidth>
                    Quero encontrar meu time
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

      <section className="px-4 pb-6 pt-8 sm:px-6 sm:pt-10 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <Card className="grid gap-8 rounded-[2rem] border-brand-green/28 bg-[linear-gradient(135deg,rgba(0,139,76,0.12),rgba(27,35,29,0.96))] p-6 sm:p-8 lg:grid-cols-[0.9fr_1.1fr]">
            <div className="max-w-xl">
              <p className="text-sm uppercase tracking-[0.2em] text-brand-emerald/82">
                Ideias para começar
              </p>
              <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
                Um bom time começa melhor quando já tem uma ideia para discutir.
              </h2>
              <p className="mt-4 text-base leading-8 text-brand-off-white/70">
                A aba de ideias entra como apoio leve: referências para inspirar
                a primeira conversa, alinhar interesse e sair do branco sem
                virar uma lista confusa.
              </p>
              <div className="mt-6">
                <Link href="/ideas" className="inline-flex">
                  <Button variant="accent" size="lg">
                    Ver ideias
                  </Button>
                </Link>
              </div>
            </div>

            <div className="grid gap-3">
              {IDEA_SIGNALS.map((signal, index) => (
                <div
                  key={signal}
                  className="rounded-2xl border border-brand-green/24 bg-brand-dark-green/72 px-5 py-5"
                >
                  <p className="text-xs uppercase tracking-[0.18em] text-brand-off-white/40">
                    Ideia {index + 1}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-brand-off-white">
                    {signal}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </section>

      <section className="border-y border-brand-green/20 bg-brand-dark-green/80 px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 max-w-2xl">
            <p className="text-sm uppercase tracking-[0.2em] text-brand-emerald/80">
              Por que isso existe
            </p>
            <h2 className="mt-3 font-heading text-3xl font-bold sm:text-4xl">
              Mais chance real de executar.
            </h2>
          </div>

          <div className="grid gap-4 lg:grid-cols-3">
            {BENEFITS.map((benefit) => (
              <Card
                key={benefit.title}
                className="rounded-2xl bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.72))] p-6"
              >
                <p className="text-sm uppercase tracking-[0.18em] text-brand-emerald/78">
                  vantagem
                </p>
                <h3 className="mt-4 font-heading text-2xl font-semibold">
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
                Três passos. Um objetivo: te colocar para construir.
              </h2>
              <p className="mt-5 max-w-md text-base leading-8 text-brand-off-white/68">
                O fluxo é curto de propósito. Tudo aqui foi desenhado para
                reduzir fricção entre descoberta, formação do time e execução.
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
                Pronto para entrar?
              </p>
              <h2 className="mt-4 font-heading text-4xl font-bold leading-tight sm:text-5xl">
                Seu próximo time pode estar a poucos minutos de distância.
              </h2>
              <p className="mt-4 text-base leading-8 text-brand-off-white/72">
                Crie seu perfil agora, entre na fila e deixe a plataforma cuidar
                da parte mais chata: encontrar as pessoas certas para construir
                com você.
              </p>

              <div className="mt-8">
                <Link href="/profile" className="inline-flex">
                  <Button variant="secondary" size="lg">
                    Entrar na fila
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
