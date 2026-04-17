'use client';

import { useEffect, useRef, useState } from 'react';
import {
  createProfile,
  updateProfile,
  type ProfileFormData,
} from '@/app/(app)/profile/actions';
import { SPECIFIC_ROLES, INTERESTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { Card } from '@/components/ui/card';

interface ProfileFormProps {
  mode?: 'create' | 'edit';
  initialData?: ProfileFormData;
  redirectTo?: string;
}

const DEFAULT_FORM: ProfileFormData = {
  name: '',
  phone_number: '',
  linkedin_url: '',
  github_url: '',
  x_url: '',
  primary_role: '',
  secondary_roles: [],
  years_experience: 0,
  interests: [],
};

export function ProfileForm({ mode = 'create', initialData, redirectTo }: ProfileFormProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearsExperienceInput, setYearsExperienceInput] = useState(
    initialData?.years_experience?.toString() ?? '',
  );
  const [form, setForm] = useState<ProfileFormData>(initialData ?? DEFAULT_FORM);
  const initialSerialized = useRef(
    JSON.stringify({ ...(initialData ?? DEFAULT_FORM), _years: initialData?.years_experience?.toString() ?? '' }),
  );
  const submitting = useRef(false);

  useEffect(() => {
    const currentSerialized = JSON.stringify({ ...form, _years: yearsExperienceInput });
    const dirty = currentSerialized !== initialSerialized.current;

    function handler(event: BeforeUnloadEvent) {
      if (submitting.current) return;
      event.preventDefault();
      event.returnValue = '';
    }

    if (dirty) {
      window.addEventListener('beforeunload', handler);
      return () => window.removeEventListener('beforeunload', handler);
    }
  }, [form, yearsExperienceInput]);

  function updateField<K extends keyof ProfileFormData>(key: K, value: ProfileFormData[K]) {
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

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    submitting.current = true;

    try {
      const payload: ProfileFormData = {
        ...form,
        years_experience: yearsExperienceInput.trim() === '' ? 0 : Number(yearsExperienceInput),
      };

      if (mode === 'edit') {
        await updateProfile(payload, redirectTo);
      } else {
        await createProfile(payload);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao salvar perfil');
      submitting.current = false;
      setLoading(false);
    }
  }

  // Required fields are the same in create + edit: the optional ones are
  // NULL-safe in matching scoring, so we don't block users who cleared them.
  const isCreate = mode === 'create';
  const isValid = Boolean(
    form.name.trim() &&
      form.primary_role &&
      yearsExperienceInput.trim() !== '',
  );

  const secondaryRoleOptions = SPECIFIC_ROLES.filter((r) => r !== form.primary_role);

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-brand-green/20 pb-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-brand-yellow/78">Seu perfil</p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            {isCreate ? 'O essencial para começar' : 'Suas informações para o hackathon'}
          </h2>
        </div>
        {isCreate && (
          <div className="hidden rounded-2xl border border-brand-green/25 bg-brand-dark-green/60 px-4 py-3 text-right sm:block">
            <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">Depois</p>
            <p className="mt-1 text-sm text-brand-off-white/68">
              Melhorar perfil
              <span className="block">(opcional)</span>
            </p>
          </div>
        )}
      </div>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">{error}</p>
      )}

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">Identidade</p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Para o time saber quem você é.
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Nome</label>
          <Input
            type="text"
            value={form.name}
            onChange={(e) => updateField('name', e.target.value)}
            placeholder="Seu nome completo"
            required
          />
        </div>

        {!isCreate && (
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
        )}
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Eu posso ajudar com
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            {isCreate
              ? 'Escolha sua função principal para começar.'
              : 'Escolha sua principal e marque outras que você também domina.'}
          </p>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Função principal</label>
          <Select
            value={form.primary_role}
            onChange={(e) => {
              updateField('primary_role', e.target.value);
              updateField(
                'secondary_roles',
                form.secondary_roles.filter((r) => r !== e.target.value),
              );
            }}
            required
          >
            <option value="">Selecione...</option>
            {SPECIFIC_ROLES.map((role) => (
              <option key={role} value={role}>
                {role}
              </option>
            ))}
          </Select>
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium">Anos de experiência</label>
          <Input
            type="text"
            inputMode="numeric"
            pattern="[0-9]*"
            value={yearsExperienceInput}
            onChange={(e) => {
              const nextValue = e.target.value.replace(/\D/g, '');
              setYearsExperienceInput(nextValue);
              updateField('years_experience', nextValue === '' ? 0 : Number(nextValue));
            }}
            placeholder="0"
            required
          />
        </div>

        {!isCreate && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Também posso ajudar com <span className="text-brand-off-white/50">(opcional)</span>
            </label>
            <div className="flex flex-wrap gap-2">
              {secondaryRoleOptions.map((role) => (
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
          </div>
        )}
      </Card>

      {!isCreate && (
        <>
          <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
            <div>
              <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">Sociais</p>
              <p className="mt-2 text-sm text-brand-off-white/62">
                Opcional, mas ajuda seu time a te conhecer melhor.
              </p>
            </div>

            <div className="grid gap-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  LinkedIn <span className="text-brand-off-white/50">(opcional)</span>
                </label>
                <Input
                  type="url"
                  value={form.linkedin_url}
                  onChange={(e) => updateField('linkedin_url', e.target.value)}
                  placeholder="https://linkedin.com/in/seu-perfil"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  GitHub <span className="text-brand-off-white/50">(opcional)</span>
                </label>
                <Input
                  type="url"
                  value={form.github_url}
                  onChange={(e) => updateField('github_url', e.target.value)}
                  placeholder="https://github.com/seu-usuario"
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  X <span className="text-brand-off-white/50">(opcional)</span>
                </label>
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
                Áreas de interesse
              </p>
              <p className="mt-2 text-sm text-brand-off-white/62">
                Ajuda a formar times com interesses parecidos.
              </p>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">
                Interesses <span className="text-brand-off-white/50">(opcional)</span>
              </label>
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
            </div>
          </Card>
        </>
      )}

      <Button
        type="submit"
        disabled={!isValid || loading}
        variant="primary"
        size="lg"
        fullWidth
        className="shadow-[0_16px_40px_rgba(0,139,76,0.18)]"
      >
        {loading
          ? mode === 'edit'
            ? 'Salvando...'
            : 'Criando perfil...'
          : mode === 'edit'
            ? 'Salvar alterações'
            : 'Continuar'}
      </Button>

      {isCreate && (
        <p className="text-center text-xs text-brand-off-white/48">
          Você pode adicionar WhatsApp, redes e interesses no próximo passo.
        </p>
      )}
    </form>
  );
}
