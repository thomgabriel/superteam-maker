import Image from "next/image";
import {
  FAQ_ITEMS,
  RESOURCE_GROUPS,
  LESSON_GROUPS,
  SUCCESS_STORIES,
} from "@/lib/support-content";
import { FaqAccordion } from "@/components/support/faq-accordion";
import { ResourceGrid } from "@/components/support/resource-grid";
import { LessonList } from "@/components/support/lesson-list";
import { SuccessStories } from "@/components/support/success-stories";
import { SupportTabs } from "@/components/support/support-tabs";
import { PublicHeader } from "@/components/ui/public-header";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { AppHeader } from "@/components/ui/app-header";
import { resolveUserStateWithClient } from '@/lib/user-state';

export const dynamic = "force-dynamic";

export default async function SupportPage() {
  const supabase = await createServerSupabaseClient();
  const { data: { user } } = await supabase.auth.getUser();

  let header;
  if (user) {
    const admin = isAdminUser(user);
    const resolvedState = await resolveUserStateWithClient(user.id, supabase);
    const teamId = resolvedState.team?.id ?? null;
    let statusPath: string | null = null;
    if (!teamId) {
      statusPath = resolvedState.redirectPath;
    }
    header = <AppHeader admin={admin} teamId={teamId} statusPath={statusPath} showProfileLink={statusPath === '/queue'} />;
  } else {
    header = <PublicHeader />;
  }

  return (
    <>
    {header}
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

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Hero */}
        <section className="pb-10 pt-4">
          <div className="max-w-3xl">
            <p className="inline-flex rounded-full border border-brand-yellow/30 bg-brand-yellow/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-brand-yellow">
              Frontier Hackathon
            </p>

            <h1 className="mt-6 font-heading text-4xl font-bold leading-[0.96] tracking-tight sm:text-5xl lg:text-6xl">
              Tudo que você precisa
              <span className="block text-brand-emerald">pra construir e vencer</span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-brand-off-white/68">
              FAQ, recursos, aulas e histórias de quem já passou por aqui.
            </p>
          </div>
        </section>

        {/* Tabbed content */}
        <section>
          <SupportTabs
            tabs={[
              {
                key: "faq",
                label: "Perguntas Frequentes",
                content: <FaqAccordion items={FAQ_ITEMS} />,
              },
              {
                key: "resources",
                label: "Recursos",
                content: <ResourceGrid groups={RESOURCE_GROUPS} />,
              },
              {
                key: "lessons",
                label: "Aulas",
                content: <LessonList groups={LESSON_GROUPS} />,
              },
              {
                key: "cases",
                label: "Cases BR",
                content: <SuccessStories stories={SUCCESS_STORIES} />,
              },
            ]}
          />
        </section>

        {/* Warning */}
        <section className="mt-12">
          <div className="rounded-2xl border border-brand-yellow/20 bg-brand-yellow/8 px-6 py-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-yellow/82">
              Aviso de segurança
            </p>
            <p className="mt-2 text-sm leading-7 text-brand-off-white/68">
              A Superteam Brasil nunca pede seed phrase, chave privada ou
              pagamento pra participar do hackathon. Tudo é gratuito. Viu algo
              suspeito? Reporte no Discord.
            </p>
          </div>
        </section>
      </div>
    </main>
    </>
  );
}
