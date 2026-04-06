'use client';

import { useState } from 'react';
import { createProfile, type ProfileFormData } from '@/app/(app)/perfil/actions';
import { SPECIFIC_ROLES, INTERESTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Tag } from '@/components/ui/tag';
import { Card } from '@/components/ui/card';

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [yearsExperienceInput, setYearsExperienceInput] = useState('');
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    phone_number: '',
    linkedin_url: '',
    github_url: '',
    x_url: '',
    primary_role: '',
    secondary_roles: [],
    years_experience: 0,
    interests: [],
  });

  function updateField<K extends keyof ProfileFormData>(
    key: K,
    value: ProfileFormData[K],
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function toggleArrayItem(
    key: 'secondary_roles' | 'interests',
    item: string,
  ) {
    setForm((prev) => {
      const current = prev[key];
      return {
        ...prev,
        [key]: current.includes(item)
          ? current.filter((i) => i !== item)
          : [...current, item],
      };
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await createProfile({
        ...form,
        years_experience: yearsExperienceInput.trim() === '' ? 0 : Number(yearsExperienceInput),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar perfil');
      setLoading(false);
    }
  }

  const isValid =
    form.name.trim() &&
    form.phone_number.trim() &&
    form.primary_role &&
    yearsExperienceInput.trim() !== '' &&
    form.interests.length > 0;

  const secondaryRoleOptions = SPECIFIC_ROLES.filter(
    (r) => r !== form.primary_role,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center justify-between gap-4 border-b border-brand-green/20 pb-5">
        <div>
          <p className="text-sm uppercase tracking-[0.18em] text-brand-yellow/78">
            Seu perfil
          </p>
          <h2 className="mt-2 font-heading text-2xl font-bold">
            Vamos montar sua base para o match
          </h2>
        </div>
        <div className="hidden rounded-2xl border border-brand-green/25 bg-brand-dark-green/60 px-4 py-3 text-right sm:block">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/42">
            Resultado
          </p>
          <p className="mt-1 text-sm text-brand-off-white/68">
            Perfil salvo
            <span className="block">+ entrada na fila</span>
          </p>
        </div>
      </div>

      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Identidade
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            O basico para o time saber quem voce e e como te chamar.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">Nome</label>
            <Input
              type="text"
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              placeholder="Seu nome completo"
              required
            />
          </div>

          <div className="sm:col-span-2">
            <label className="mb-1 block text-sm font-medium">WhatsApp</label>
            <Input
              type="tel"
              value={form.phone_number}
              onChange={(e) => updateField('phone_number', e.target.value)}
              placeholder="+55 11 99999-9999"
              required
            />
          </div>
        </div>
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Sociais
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Opcional, mas ajuda seu time a entender melhor seu repertorio e te encontrar rapido.
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
            Como voce contribui
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Sua funcao principal e a ancora do match. As outras ajudam a dar flexibilidade.
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
              <option key={role} value={role}>{role}</option>
            ))}
          </Select>
        </div>

        {form.primary_role && (
          <div>
            <label className="mb-2 block text-sm font-medium">
              Outras funções <span className="text-brand-off-white/50">(opcional)</span>
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
          />
        </div>
      </Card>

      <Card className="space-y-4 border-brand-green/20 bg-brand-dark-green/45 p-5">
        <div>
          <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/80">
            Onde voce quer construir
          </p>
          <p className="mt-2 text-sm text-brand-off-white/62">
            Esses temas ajudam a aproximar pessoas com repertorio e ambicao parecidos.
          </p>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium">
            Interesses <span className="text-brand-off-white/50">(selecione pelo menos 1)</span>
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

      <Button
        type="submit"
        disabled={!isValid || loading}
        variant="primary"
        size="lg"
        fullWidth
        className="shadow-[0_16px_40px_rgba(0,139,76,0.18)]"
      >
        {loading ? 'Criando perfil...' : 'Encontrar meu time'}
      </Button>
    </form>
  );
}
