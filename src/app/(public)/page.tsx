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
                href="/auth"
                className="text-sm font-medium text-brand-off-white/70 transition-colors hover:text-brand-off-white"
              >
                Entrar
              </Link>
            </div>
          </div>

          <div className="mt-16 grid min-h-[36rem] items-center gap-12 sm:min-h-[40rem] lg:mt-[5.5rem] lg:min-h-[50rem] lg:grid-cols-[1.1fr_0.9fr]">
            <div className="relative max-w-2xl">
              <div className="pointer-events-none absolute -left-10 top-8 h-56 w-56 rounded-full bg-brand-yellow/8 blur-[100px] lg:-left-20 lg:top-4 lg:h-72 lg:w-72" />
              <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
                Formação de times para hackathon
              </p>

              <h1 className="mt-6 max-w-[13ch] font-heading text-5xl font-bold leading-[0.92] tracking-tight sm:text-6xl lg:max-w-[12ch] lg:text-[5.5rem]">
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
                  Ideias para começar
                </p>
                <h2 className="mt-4 font-heading text-3xl font-bold leading-tight sm:text-4xl lg:text-[3.25rem]">
                  Um bom time começa melhor quando já tem uma ideia para discutir.
                </h2>
                <p className="mt-5 text-base leading-8 text-brand-off-white/70">
                  A aba de ideias entra como apoio leve: referências para inspirar
                  a primeira conversa, alinhar interesse e sair do branco sem
                  virar uma lista confusa.
                </p>
                <div className="mt-7">
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
                    className="rounded-[1.7rem] border border-brand-green/34 bg-[linear-gradient(180deg,rgba(26,36,29,0.84),rgba(10,15,12,0.98))] px-5 py-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.035),0_20px_48px_rgba(0,0,0,0.22)]"
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
