'use client';

import { useState } from 'react';
import { createProfile, type ProfileFormData } from '@/app/(app)/perfil/actions';
import { SPECIFIC_ROLES, INTERESTS } from '@/lib/constants';

export function ProfileForm() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProfileFormData>({
    name: '',
    phone_number: '',
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
      await createProfile(form);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao criar perfil');
      setLoading(false);
    }
  }

  const isValid =
    form.name.trim() &&
    form.phone_number.trim() &&
    form.primary_role &&
    form.years_experience >= 0 &&
    form.interests.length > 0;

  const secondaryRoleOptions = SPECIFIC_ROLES.filter(
    (r) => r !== form.primary_role,
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
          {error}
        </p>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Nome</label>
        <input
          type="text"
          value={form.name}
          onChange={(e) => updateField('name', e.target.value)}
          placeholder="Seu nome completo"
          required
          className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white placeholder:text-brand-off-white/40 focus:border-brand-emerald focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">WhatsApp</label>
        <input
          type="tel"
          value={form.phone_number}
          onChange={(e) => updateField('phone_number', e.target.value)}
          placeholder="+55 11 99999-9999"
          required
          className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white placeholder:text-brand-off-white/40 focus:border-brand-emerald focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-1 block text-sm font-medium">Função principal</label>
        <select
          value={form.primary_role}
          onChange={(e) => {
            updateField('primary_role', e.target.value);
            updateField(
              'secondary_roles',
              form.secondary_roles.filter((r) => r !== e.target.value),
            );
          }}
          required
          className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white focus:border-brand-emerald focus:outline-none"
        >
          <option value="">Selecione...</option>
          {SPECIFIC_ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {form.primary_role && (
        <div>
          <label className="mb-2 block text-sm font-medium">
            Outras funções <span className="text-brand-off-white/50">(opcional)</span>
          </label>
          <div className="flex flex-wrap gap-2">
            {secondaryRoleOptions.map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => toggleArrayItem('secondary_roles', role)}
                className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                  form.secondary_roles.includes(role)
                    ? 'border-brand-emerald bg-brand-emerald/20 text-brand-emerald'
                    : 'border-brand-green/40 text-brand-off-white/60 hover:border-brand-green'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      <div>
        <label className="mb-1 block text-sm font-medium">Anos de experiência</label>
        <input
          type="number"
          min={0}
          max={30}
          value={form.years_experience}
          onChange={(e) =>
            updateField('years_experience', parseInt(e.target.value) || 0)
          }
          className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-4 py-3 text-brand-off-white focus:border-brand-emerald focus:outline-none"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium">
          Interesses <span className="text-brand-off-white/50">(selecione pelo menos 1)</span>
        </label>
        <div className="flex flex-wrap gap-2">
          {INTERESTS.map((interest) => (
            <button
              key={interest}
              type="button"
              onClick={() => toggleArrayItem('interests', interest)}
              className={`rounded-full border px-3 py-1.5 text-xs transition-colors ${
                form.interests.includes(interest)
                  ? 'border-brand-yellow bg-brand-yellow/20 text-brand-yellow'
                  : 'border-brand-green/40 text-brand-off-white/60 hover:border-brand-green'
              }`}
            >
              {interest}
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        disabled={!isValid || loading}
        className="w-full rounded-lg bg-brand-emerald px-6 py-4 font-heading text-lg font-semibold text-brand-off-white transition-opacity hover:opacity-90 disabled:opacity-50"
      >
        {loading ? 'Criando perfil...' : 'Encontrar meu time'}
      </button>
    </form>
  );
}
