'use client';

import { useState, useTransition } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  updateNotificationPreferences,
  type NotificationPrefsResult,
} from './actions';

interface Props {
  initialEmailReminders: boolean;
  initialInAppEnabled: boolean;
}

export function NotificationPreferencesForm({
  initialEmailReminders,
  initialInAppEnabled,
}: Props) {
  const [emailReminders, setEmailReminders] = useState(initialEmailReminders);
  const [inAppEnabled, setInAppEnabled] = useState(initialInAppEnabled);
  const [feedback, setFeedback] = useState<NotificationPrefsResult | null>(null);
  const [isPending, startTransition] = useTransition();

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);

    startTransition(async () => {
      const result = await updateNotificationPreferences(formData);
      setFeedback(result);
    });
  }

  return (
    <Card className="flex flex-col gap-5 border-brand-green/20 bg-brand-dark-green/55 p-5">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <ToggleRow
          id="email_reminders"
          label="Lembretes por email"
          description="Avisos úteis mas não essenciais — líder assumiu, novo integrante, etc."
          checked={emailReminders}
          onChange={setEmailReminders}
        />

        <div className="h-px w-full bg-brand-green/15" />

        <ToggleRow
          id="in_app_enabled"
          label="Notificações no app"
          description="Sininho no topo da plataforma mostra tudo que aconteceu com o seu time."
          checked={inAppEnabled}
          onChange={setInAppEnabled}
        />

        <div className="flex items-center justify-between gap-3 pt-1">
          <span className="text-xs text-brand-off-white/55">
            {feedback?.message ?? 'Mudanças entram em vigor imediatamente.'}
          </span>
          <Button type="submit" variant="primary" size="sm" disabled={isPending}>
            {isPending ? 'Salvando…' : 'Salvar'}
          </Button>
        </div>
      </form>
    </Card>
  );
}

interface ToggleRowProps {
  id: string;
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}

function ToggleRow({ id, label, description, checked, onChange }: ToggleRowProps) {
  return (
    <label
      htmlFor={id}
      className="flex cursor-pointer items-start justify-between gap-4"
    >
      <div className="flex flex-col gap-1">
        <span className="font-heading text-sm font-semibold text-brand-off-white">
          {label}
        </span>
        <span className="text-xs leading-relaxed text-brand-off-white/65">
          {description}
        </span>
      </div>
      <span className="relative inline-flex shrink-0 items-center pt-1">
        <input
          id={id}
          name={id}
          type="checkbox"
          checked={checked}
          onChange={(event) => onChange(event.currentTarget.checked)}
          className="peer sr-only"
        />
        <span
          aria-hidden
          className="block h-6 w-11 rounded-full bg-brand-green/25 transition-colors peer-checked:bg-brand-emerald peer-focus-visible:ring-2 peer-focus-visible:ring-brand-yellow/60"
        />
        <span
          aria-hidden
          className="pointer-events-none absolute left-[2px] top-[6px] h-5 w-5 rounded-full bg-brand-off-white shadow transition-transform peer-checked:translate-x-[20px]"
        />
      </span>
    </label>
  );
}
