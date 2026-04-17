import { redirect } from 'next/navigation';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui/card';
import { DEFAULT_PREFERENCES } from '@/lib/notifications/types';
import { NotificationPreferencesForm } from './preferences-form';

export const dynamic = 'force-dynamic';

export default async function NotificationPreferencesPage() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/auth');
  }

  const { data } = await supabase
    .from('notification_preferences')
    .select('email_lifecycle, email_reminders, in_app_enabled')
    .eq('user_id', user.id)
    .maybeSingle();

  const prefs = data ?? { ...DEFAULT_PREFERENCES };

  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-6 px-4 py-10 sm:px-6">
      <header className="flex flex-col gap-2">
        <span className="font-heading text-[11px] font-bold uppercase tracking-[0.22em] text-brand-yellow">
          Conta
        </span>
        <h1 className="font-heading text-4xl font-bold leading-tight text-brand-off-white">
          Notificações
        </h1>
        <p className="text-sm leading-relaxed text-brand-off-white/70">
          Controle como a gente avisa sobre o seu time. Emails essenciais (time formado,
          desfeito, etc.) continuam sempre ativos — é como você fica sabendo do que rola.
        </p>
      </header>

      <Card className="border-brand-yellow/25 bg-brand-yellow/8 p-4 text-sm leading-relaxed text-brand-off-white/85">
        <strong className="text-brand-yellow">Por que alguns avisos são obrigatórios?</strong>
        <span className="mt-2 block">
          Emails sobre o ciclo de vida do seu time (formação, desfecho, substituições) não
          podem ser desativados — você precisa saber quando o time muda pra não ser
          substituído por inatividade.
        </span>
      </Card>

      <NotificationPreferencesForm
        initialEmailReminders={prefs.email_reminders}
        initialInAppEnabled={prefs.in_app_enabled}
      />

      <Card className="border-brand-green/20 bg-brand-green/5 p-4 text-sm text-brand-off-white/75">
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="font-heading text-[11px] font-bold uppercase tracking-[0.18em] text-brand-off-white/60">
              Emails críticos
            </div>
            <div className="mt-1 text-brand-off-white">
              Match, time desfeito, substituição, desativação.
            </div>
            <p className="mt-1 text-xs text-brand-off-white/60">
              Sempre ativos. Parte do contrato de uso da plataforma.
            </p>
          </div>
          <span className="rounded-full border border-brand-emerald/40 bg-brand-emerald/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.18em] text-brand-emerald">
            Sempre ativo
          </span>
        </div>
      </Card>
    </main>
  );
}
