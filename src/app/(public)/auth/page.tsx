'use client';

export const dynamic = 'force-dynamic';

import { createClient } from '@/lib/supabase/client';
import { useState } from 'react';
import Image from 'next/image';
import { TrackPageView } from '@/components/ui/track-event';

export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  async function handleGoogleSignIn() {
    setLoading(true);
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
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <TrackPageView event="signup_started" />
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center">
          <Image
            src="/brand/logo/logo-vertical.svg"
            alt="Superteam Brasil"
            width={180}
            height={80}
            priority
          />
          <h1 className="mt-6 font-heading text-2xl font-semibold">
            Entre no hackathon
          </h1>
        </div>

        {error && (
          <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
            {error}
          </p>
        )}

        <button
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="flex w-full items-center justify-center gap-3 rounded-lg bg-brand-off-white px-4 py-3 font-body font-medium text-brand-dark-green transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          <svg className="h-5 w-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Entrar com Google
        </button>

        <div className="flex items-center gap-4">
          <div className="h-px flex-1 bg-brand-green" />
          <span className="text-sm text-brand-off-white/60">ou</span>
          <div className="h-px flex-1 bg-brand-green" />
        </div>

        {!otpSent ? (
          <div className="space-y-3">
            <input
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white placeholder:text-brand-off-white/40 focus:border-brand-emerald focus:outline-none"
            />
            <button
              onClick={handleSendOtp}
              disabled={loading || !email}
              className="w-full rounded-lg bg-brand-emerald px-4 py-3 font-body font-medium text-brand-off-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar código'}
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            <p className="text-sm text-brand-off-white/70">
              Enviamos um código para <strong>{email}</strong>
            </p>
            <input
              type="text"
              placeholder="Código de verificação"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-center text-lg tracking-widest text-brand-off-white placeholder:text-brand-off-white/40 focus:border-brand-emerald focus:outline-none"
              maxLength={6}
            />
            <button
              onClick={handleVerifyOtp}
              disabled={loading || otp.length < 6}
              className="w-full rounded-lg bg-brand-emerald px-4 py-3 font-body font-medium text-brand-off-white transition-opacity hover:opacity-90 disabled:opacity-50"
            >
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
