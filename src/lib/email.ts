import { Resend } from 'resend';

const FROM_EMAIL = 'SuperTeamMaker <noreply@updates.solarium.courses>';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY;

  if (!apiKey) {
    return null;
  }

  return new Resend(apiKey);
}

export async function sendMatchNotification(
  to: string,
  teamName: string,
) {
  try {
    const resend = getResendClient();

    if (!resend) {
      console.warn('[email] RESEND_API_KEY is not configured, skipping match notification');
      return;
    }

    await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject: `Você tem um time! 🎉 ${teamName}`,
      html: `
        <div style="font-family: Inter, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px; background-color: #1b231d; color: #f5e8ca; border-radius: 12px;">
          <h1 style="font-family: 'Archivo', sans-serif; color: #ffd23f; font-size: 24px; margin: 0 0 16px;">
            Você foi matcheado!
          </h1>
          <p style="font-size: 16px; line-height: 1.5; margin: 0 0 8px;">
            Seu time é: <strong style="color: #ffd23f;">${teamName}</strong>
          </p>
          <p style="font-size: 14px; line-height: 1.5; color: #f5e8ca99; margin: 0 0 24px;">
            Acesse a plataforma para ver seus colegas de time e começar a construir.
          </p>
          <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://superteammaker.vercel.app'}/equipe/revelacao"
             style="display: inline-block; background-color: #008b4c; color: #f5e8ca; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px;">
            Ver meu time
          </a>
          <p style="font-size: 12px; color: #f5e8ca66; margin-top: 32px;">
            Superteam Brasil
          </p>
        </div>
      `,
    });
  } catch (error) {
    // Email failure should not block matchmaking
    console.error('[email] Failed to send match notification:', error);
  }
}
