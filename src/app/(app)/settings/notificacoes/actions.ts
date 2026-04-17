'use server';

import { revalidatePath } from 'next/cache';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { logError } from '@/lib/monitoring';

export interface NotificationPrefsResult {
  success: boolean;
  message: string;
}

export async function updateNotificationPreferences(
  formData: FormData,
): Promise<NotificationPrefsResult> {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, message: 'Sessão expirada. Faça login novamente.' };
  }

  const emailReminders = formData.get('email_reminders') === 'on';
  const inAppEnabled = formData.get('in_app_enabled') === 'on';

  // Upsert-safe: the auth trigger creates the row on signup, but we handle
  // the fallback for users who existed before the trigger was installed.
  const { error } = await supabase
    .from('notification_preferences')
    .upsert(
      {
        user_id: user.id,
        email_reminders: emailReminders,
        in_app_enabled: inAppEnabled,
        // email_lifecycle is locked on — critical lifecycle emails can't be opted out of (LGPD).
      },
      { onConflict: 'user_id' },
    );

  if (error) {
    logError('notifications.prefs.update_failed', error, { user_id: user.id });
    return {
      success: false,
      message: 'Não conseguimos salvar suas preferências. Tente de novo.',
    };
  }

  revalidatePath('/settings/notificacoes');
  return { success: true, message: 'Preferências salvas.' };
}
