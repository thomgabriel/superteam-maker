'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { enhanceProfile, type ProfileEnhanceData } from '@/app/(app)/profile/actions';
import { SPECIFIC_ROLES, INTERESTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tag } from '@/components/ui/tag';
import { Card } from '@/components/ui/card';

interface ProfileEnhanceFormProps {
  initialData: ProfileEnhanceData;
}

export function ProfileEnhanceForm({ initialData }: ProfileEnhanceFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileEnhanceData>(initialData);
  const initialSerialized = useRef(JSON.stringify(initialData));
  const submitting = useRef(false);

  useEffect(() => {
    const dirty = JSON.stringify(form) !== initialSerialized.current;

    function handler(event: BeforeUnloadEvent) {
      if (submitting.current) return;
      event.preventDefault();
      event.returnValue = '';
    }

    if (dirty) {
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [form]);

  function updateField<K extends keyof ProfileEnhanceData>(key: K, value: ProfileEnhanceData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(key: 'secondary_roles' | 'interests', item: string) {
    setForm((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(item) ? current.filter((i) => i !== item) : [...current, item],
      };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    submitting.current = true;

    try {
      await enhanceProfile(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar');
      submitting.current = false;
      setLoading(false);
    }
  }

  function handleSkip() {
    submitting.current = true;
    router.push('/queue');
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>
      )}

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">Contato</p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            WhatsApp ajuda o time a organizar o grupo depois do match.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">
            WhatsApp <span className="text-brand-off-white/50">(opcional)</span>
          </label>
          <Input
            type="tel"
            value={form.phone_number}
            onChange={(e) => updateField('phone_number', e.target.value)}
            placeholder="+55 11 99999-9999"
          />
        </div>
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">Sociais</p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Opcional. Ajuda seu time a te conhecer melhor.
          </p>
        </div>

        <div className="grid gap-4">
          <div>
            <label className="mb-1 block text-sm font-medium">LinkedIn</label>
            <Input
              type="url"
              value={form.linkedin_url}
              onChange={(e) => updateField('linkedin_url', e.target.value)}
              placeholder="https://linkedin.com/in/seu-perfil"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">GitHub</label>
            <Input
              type="url"
              value={form.github_url}
              onChange={(e) => updateField('github_url', e.target.value)}
              placeholder="https://github.com/seu-usuario"
            />
          </div>

          <div>
            <label className="mb-1 block text-sm font-medium">X</label>
            <Input
              type="url"
              value={form.x_url}
              onChange={(e) => updateField('x_url', e.target.value)}
              placeholder="https://x.com/seu-usuario"
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Também posso ajudar com
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Marque outras funções que você domina. Opcional.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {SPECIFIC_ROLES.map((role) => (
            <Tag
              key={role}
              onClick={() => toggleArrayItem('secondary_roles', role)}
              selected={form.secondary_roles.includes(role)}
              tone="emerald"
            >
              {role}
            </Tag>
          ))}
        </div>
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Áreas de interesse
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Ajuda a formar times com interesses parecidos. Opcional.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <Tag
              key={interest}
              onClick={() => toggleArrayItem('interests', interest)}
              selected={form.interests.includes(interest)}
              tone="yellow"
            >
              {interest}
            </Tag>
          ))}
        </div>
      </Card>

      <div className="flex flex-col gap-3 sm:flex-row">
        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="lg"
          fullWidth
          className="shadow-[0_16px_40px_rgba(0,139,76,0.18)]"
        >
          {loading ? 'Salvando...' : 'Salvar e entrar na fila'}
        </Button>
        <Button type="button" variant="accent" size="lg" fullWidth onClick={handleSkip}>
          Pular e entrar na fila
        </Button>
      </div>
    </form>
  );
}
