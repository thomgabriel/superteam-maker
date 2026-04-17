import { Resend } from 'resend';
import { logError } from '@/lib/monitoring';

const FROM_EMAIL = 'SuperteamMaker <noreply@ideiadosonhos.com>';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

// sendEmail is the single Resend wrapper. Returns a structured outcome so
// callers can persist status without re-inspecting thrown errors.

export interface SendEmailInput {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export type SendEmailOutcome =
  | { status: 'sent' }
  | { status: 'skipped'; reason: string }
  | { status: 'failed'; reason: string };

export async function sendEmail(
  input: SendEmailInput,
): Promise<SendEmailOutcome> {
  const resend = getResendClient();

  if (!resend) {
    console.warn('[email] RESEND_API_KEY is not configured, skipping send');
    return { status: 'skipped', reason: 'resend_not_configured' };
  }

  if (!input.to) {
    return { status: 'skipped', reason: 'missing_recipient' };
  }

  try {
    const { error } = await resend.emails.send({
      from: input.from ?? FROM_EMAIL,
      to: input.to,
      subject: input.subject,
      html: input.html,
    });

    if (error) {
      const reason = (error as { message?: string })?.message ?? 'resend_error';
      logError('email.send_failed', error, { to: input.to });
      return { status: 'failed', reason };
    }

    return { status: 'sent' };
  } catch (error) {
    const reason = error instanceof Error ? error.message : String(error);
    logError('email.send_exception', error, { to: input.to });
    return { status: 'failed', reason };
  }
}

