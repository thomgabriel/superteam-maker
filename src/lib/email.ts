import { Resend } from 'resend';

const FROM_EMAIL = 'SuperteamMaker <noreply@updates.solarium.courses>';

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
        <div style="margin:0; padding:32px 16px; background:#121914; font-family:Inter, Arial, sans-serif; color:#f5e8ca;">
          <div style="max-width:560px; margin:0 auto; border:1px solid rgba(0,139,76,0.24); border-radius:28px; overflow:hidden; background:linear-gradient(180deg,#1b231d 0%,#162018 100%);">
            <div style="padding:32px 32px 20px; background:radial-gradient(circle at top, rgba(255,210,63,0.14), transparent 42%), radial-gradient(circle at 20% 20%, rgba(0,139,76,0.18), transparent 28%), linear-gradient(180deg, #1b231d 0%, #162018 100%);">
              <div style="display:inline-block; padding:8px 14px; border-radius:999px; border:1px solid rgba(255,210,63,0.28); background:rgba(255,210,63,0.08); color:#ffd23f; font-size:11px; font-weight:700; letter-spacing:0.22em; text-transform:uppercase;">
                Match confirmado
              </div>

              <h1 style="margin:20px 0 0; font-family:Archivo, Inter, Arial, sans-serif; font-size:46px; line-height:0.98; letter-spacing:-0.04em; color:#f5e8ca;">
                Você caiu em um
                <span style="display:block; color:#ffd23f;">time forte.</span>
              </h1>

              <p style="margin:20px 0 0; max-width:420px; font-size:17px; line-height:1.7; color:rgba(245,232,202,0.72);">
                Seu time já está pronto para começar a conversa. Agora é abrir a plataforma, ver quem está com você e partir para a execução.
              </p>
            </div>

            <div style="padding:0 32px 32px;">
              <div style="margin-top:4px; padding:20px 22px; border-radius:22px; border:1px solid rgba(255,210,63,0.22); background:rgba(255,210,63,0.08);">
                <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(255,210,63,0.82);">
                  Seu time
                </div>
                <div style="margin-top:10px; font-family:Archivo, Inter, Arial, sans-serif; font-size:34px; line-height:1.05; color:#ffd23f; font-weight:700;">
                  ${teamName}
                </div>
              </div>

              <div style="margin-top:18px; padding:20px 22px; border-radius:22px; border:1px solid rgba(0,139,76,0.22); background:rgba(0,139,76,0.08);">
                <div style="font-size:11px; font-weight:700; letter-spacing:0.18em; text-transform:uppercase; color:rgba(245,232,202,0.42);">
                  Próximo passo
                </div>
                <div style="margin-top:10px; font-size:15px; line-height:1.75; color:rgba(245,232,202,0.82);">
                  Entre na plataforma para ver os membros do seu time, assumir a liderança se quiser e começar a organizar o grupo.
                </div>
              </div>

              <div style="margin-top:26px;">
                <a href="${process.env.NEXT_PUBLIC_APP_URL || 'https://superteammaker.vercel.app'}/team/reveal"
                   style="display:inline-block; padding:15px 24px; border-radius:12px; background:#008b4c; color:#f5e8ca; text-decoration:none; font-family:Archivo, Inter, Arial, sans-serif; font-size:16px; font-weight:700;">
                  Ver meu time
                </a>
              </div>

              <div style="margin-top:28px; font-size:12px; line-height:1.7; color:rgba(245,232,202,0.46);">
                Superteam Brasil
              </div>
            </div>
          </div>
        </div>
      `,
    });
  } catch (error) {
    // Email failure should not block matchmaking
    console.error('[email] Failed to send match notification:', error);
  }
}
