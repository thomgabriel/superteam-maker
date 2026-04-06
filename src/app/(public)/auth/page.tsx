'use client';

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/client';
import { trackEvent } from '@/lib/analytics';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Suspense } from 'react';
import { UtmCapture } from '@/components/ui/utm-capture';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [checkingSession, setCheckingSession] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();
  const router = useRouter();

  // If already authenticated, redirect to app
  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.replace('/perfil');
        return;
      }

      setCheckingSession(false);
    });
  }, [supabase, router]);

  if (checkingSession) {
    return (
      <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-x-0 top-0 h-[32rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.10),transparent_42%),radial-gradient(circle_at_18%_22%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
        </div>
        <div className="flex flex-col items-center text-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/brand/logo/logo-horizontal.svg"
            alt="Superteam Brasil"
            className="h-auto w-60 object-contain"
          />
          <div className="mt-5 h-10 w-10 animate-spin rounded-full border-2 border-brand-green/25 border-t-brand-emerald" />
        </div>
      </main>
    );
  }

  function trackSignupStarted(method: 'google' | 'otp') {
    void trackEvent({
      event: 'signup_started',
      route: '/auth',
      properties: { method },
    });
  }

  async function handleGoogleSignIn() {
    setLoading(true);
    trackSignupStarted('google');
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError('Erro ao conectar com Google. Tente novamente.');
      setLoading(false);
    }
  }

  async function handleSendOtp() {
    setLoading(true);
    setError(null);
    trackSignupStarted('otp');
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });
    if (error) {
      setError('Erro ao enviar código. Verifique o email.');
    } else {
      setOtpSent(true);
    }
    setLoading(false);
  }

  async function handleVerifyOtp() {
    setLoading(true);
    setError(null);
    const { error } = await supabase.auth.verifyOtp({
      email,
      token: otp,
      type: 'email',
    });
    if (error) {
      setError('Código inválido. Tente novamente.');
      setLoading(false);
    } else {
      window.location.href = '/perfil';
    }
  }

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(255,210,63,0.12),transparent_42%),radial-gradient(circle_at_18%_22%,rgba(0,139,76,0.18),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_48%,#1b231d_100%)]" />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/elements/morth-05.svg"
          alt=""
          className="absolute -left-10 top-24 opacity-12"
        />
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/elements/morth-21.svg"
          alt=""
          className="absolute right-[-2rem] top-10 opacity-12"
        />
      </div>
      <Suspense>
        <UtmCapture />
      </Suspense>
      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-5xl items-center justify-center">
        <Card className="w-full max-w-lg rounded-[2rem] border-brand-green/30 bg-[linear-gradient(180deg,rgba(48,108,64,0.12),rgba(27,35,29,0.98))] p-7 shadow-[0_20px_80px_rgba(0,0,0,0.22)] sm:p-10">
            <div className="flex flex-col items-center text-center">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/brand/logo/logo-vertical.svg"
                alt="Superteam Brasil"
                className="h-40 w-40 object-contain"
              />
              <p className="mt-6 text-sm uppercase tracking-[0.18em] text-brand-emerald/80">
                Comece aqui
              </p>
              <h2 className="mt-4 font-heading text-3xl font-semibold sm:text-[2.15rem]">
                Entre no hackathon
              </h2>
            </div>

            {error && (
              <p className="mt-7 rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
                {error}
              </p>
            )}

            <div className="mt-9 space-y-6">
              <Button
                onClick={handleGoogleSignIn}
                disabled={loading}
                variant="light"
                fullWidth
                className="flex items-center justify-center gap-3 py-4"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Entrar com Google
              </Button>

              <div className="flex items-center gap-4">
                <div className="h-px flex-1 bg-brand-green" />
                <span className="text-sm text-brand-off-white/60">ou</span>
                <div className="h-px flex-1 bg-brand-green" />
              </div>

              {!otpSent ? (
                <div className="space-y-3">
                  <Input
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="py-4"
                  />
                  <Button
                    onClick={handleSendOtp}
                    disabled={loading || !email}
                    variant="primary"
                    fullWidth
                    className="py-4"
                  >
                    {loading ? 'Enviando...' : 'Enviar código'}
                  </Button>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-sm text-brand-off-white/70">
                    Enviamos um código para <strong>{email}</strong>
                  </p>
                  <Input
                    type="text"
                    placeholder="Código de verificação"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="py-4 text-center text-lg tracking-widest"
                    maxLength={6}
                  />
                  <Button
                    onClick={handleVerifyOtp}
                    disabled={loading || otp.length < 6}
                    variant="primary"
                    fullWidth
                    className="py-4"
                  >
                    {loading ? 'Verificando...' : 'Verificar'}
                  </Button>
                </div>
              )}
            </div>
        </Card>
      </div>
    </main>
  );
}
