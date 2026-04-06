import Image from 'next/image';
import Link from 'next/link';
import { Suspense } from 'react';
import { TrackPageView } from '@/components/ui/track-event';
import { UtmCapture } from '@/components/ui/utm-capture';

export default function LandingPage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
      <TrackPageView event="landing_view" />
      <Suspense>
        <UtmCapture />
      </Suspense>
      {/* Decorative morph shapes */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-10">
        <Image
          src="/brand/elements/morth-05.svg"
          alt=""
          width={400}
          height={400}
          className="absolute -left-20 -top-20"
        />
        <Image
          src="/brand/elements/morth-21.svg"
          alt=""
          width={350}
          height={350}
          className="absolute -bottom-16 -right-16"
        />
        <Image
          src="/brand/elements/morth-14.svg"
          alt=""
          width={200}
          height={200}
          className="absolute right-10 top-1/4"
        />
      </div>

      <div className="relative z-10 flex max-w-lg flex-col items-center text-center">
        <Image
          src="/brand/logo/logo-horizontal.svg"
          alt="Superteam Brasil"
          width={260}
          height={60}
          priority
        />

        <h1 className="mt-8 font-heading text-3xl font-bold leading-tight sm:text-4xl">
          Monte seu time para o hackathon em minutos
        </h1>

        <p className="mt-4 text-lg text-brand-off-white/70">
          Crie seu perfil, encontre um time equilibrado e comece a construir.
        </p>

        <Link
          href="/auth"
          className="mt-8 inline-flex rounded-lg bg-brand-emerald px-8 py-4 font-heading text-lg font-semibold text-brand-off-white transition-all hover:bg-brand-emerald/90 hover:shadow-lg hover:shadow-brand-emerald/20"
        >
          Participar
        </Link>

        <div className="mt-16 grid w-full grid-cols-1 gap-6 sm:grid-cols-3">
          {[
            { step: '1', title: 'Crie seu perfil', desc: 'Leva menos de 1 minuto' },
            { step: '2', title: 'Encontre um time', desc: 'Matching por role e experiência' },
            { step: '3', title: 'Comece a construir', desc: 'Conecte via WhatsApp' },
          ].map(({ step, title, desc }) => (
            <div key={step} className="rounded-lg border border-brand-green/30 p-4">
              <span className="font-heading text-2xl font-bold text-brand-yellow">
                {step}
              </span>
              <h3 className="mt-2 font-heading text-sm font-semibold">{title}</h3>
              <p className="mt-1 text-xs text-brand-off-white/60">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
