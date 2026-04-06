'use client';

import { useState } from 'react';
import { updateTeamProfile } from '@/app/(app)/equipe/[id]/actions';
import type { Team } from '@/types/database';
import { INTERESTS } from '@/lib/constants';

export function LeaderPanel({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [ideaTitle, setIdeaTitle] = useState(team.idea_title ?? '');
  const [ideaDescription, setIdeaDescription] = useState(team.idea_description ?? '');
  const [projectCategory, setProjectCategory] = useState(team.project_category ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  async function handleSave() {
    setSaving(true);
    await updateTeamProfile(team.id, {
      name,
      idea_title: ideaTitle || undefined,
      idea_description: ideaDescription || undefined,
      project_category: projectCategory || undefined,
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }

  return (
    <div className="space-y-4 rounded-lg border border-brand-green/30 p-4">
      <h3 className="font-heading text-sm font-semibold text-brand-yellow">Painel do Líder</h3>

      <div className="rounded-lg bg-brand-green/10 p-3">
        <p className="text-sm text-brand-off-white/70"><strong>Próximos passos:</strong></p>
        <ol className="mt-2 list-inside list-decimal space-y-1 text-sm text-brand-off-white/60">
          <li>Crie um grupo no WhatsApp</li>
          <li>Adicione todos os membros</li>
          <li>Definam uma ideia juntos</li>
        </ol>
      </div>

      <div className="space-y-3">
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-off-white/60">Nome do time</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-off-white/60">Ideia do projeto</label>
          <input type="text" value={ideaTitle} onChange={(e) => setIdeaTitle(e.target.value)} placeholder="Título da ideia"
            className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm text-brand-off-white placeholder:text-brand-off-white/30 focus:border-brand-emerald focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-off-white/60">Descrição</label>
          <textarea value={ideaDescription} onChange={(e) => setIdeaDescription(e.target.value)} placeholder="Descreva a ideia do time..." rows={3}
            className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm text-brand-off-white placeholder:text-brand-off-white/30 focus:border-brand-emerald focus:outline-none" />
        </div>
        <div>
          <label className="mb-1 block text-xs font-medium text-brand-off-white/60">Categoria</label>
          <select value={projectCategory} onChange={(e) => setProjectCategory(e.target.value)}
            className="w-full rounded-lg border border-brand-green bg-brand-dark-green px-3 py-2 text-sm text-brand-off-white focus:border-brand-emerald focus:outline-none">
            <option value="">Selecione...</option>
            {INTERESTS.map((interest) => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </select>
        </div>
        <button onClick={handleSave} disabled={saving}
          className="w-full rounded-lg bg-brand-emerald px-4 py-2 text-sm font-medium text-brand-off-white transition-opacity hover:opacity-90 disabled:opacity-50">
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
        </button>
      </div>
    </div>
  );
}
