'use client';

import { useState } from 'react';
import { updateTeamProfile } from '@/app/(app)/team/[id]/actions';
import type { Team } from '@/types/database';
import { INTERESTS } from '@/lib/constants';
import { Button } from '@/components/ui/button';
import { Input, inputClassName } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Card } from '@/components/ui/card';

export function LeaderPanel({ team }: { team: Team }) {
  const [name, setName] = useState(team.name);
  const [ideaTitle, setIdeaTitle] = useState(team.idea_title ?? '');
  const [ideaDescription, setIdeaDescription] = useState(team.idea_description ?? '');
  const [projectCategory, setProjectCategory] = useState(team.project_category ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setErrorMessage(null);
    try {
      const result = await updateTeamProfile(team.id, {
        name,
        idea_title: ideaTitle || undefined,
        idea_description: ideaDescription || undefined,
        project_category: projectCategory || undefined,
      });

      if (!result.success) {
        setErrorMessage(result.message ?? 'Não foi possível salvar agora.');
        return;
      }

      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setErrorMessage('Não foi possível salvar agora.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="space-y-6 rounded-[1.75rem] border-brand-yellow/24 bg-[linear-gradient(135deg,rgba(255,210,63,0.10),rgba(27,35,29,0.96))] p-6">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-brand-yellow/82">
          Você é o líder
        </p>
        <h3 className="mt-3 font-heading text-2xl font-semibold text-brand-off-white">
          Defina a ideia e organize o grupo.
        </h3>
      </div>

      <Card className="rounded-[1.25rem] border-brand-green/22 bg-brand-green/8 p-4">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/46">
          Próximos passos
        </p>
        <ol className="mt-3 list-inside list-decimal space-y-2 text-sm leading-7 text-brand-off-white/72">
          <li>Crie um grupo no WhatsApp.</li>
          <li>Adicione todos os membros.</li>
          <li>Definam uma ideia e preencham aqui.</li>
        </ol>
      </Card>

      <div className="grid gap-4">
        {errorMessage && (
          <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
            Nome do time
          </label>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="px-4 py-3 text-sm"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
            Ideia do projeto
          </label>
          <Input
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value)}
            placeholder="Título da ideia"
            className="px-4 py-3 text-sm placeholder:text-brand-off-white/30"
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
            Descrição
          </label>
          <textarea
            value={ideaDescription}
            onChange={(e) => setIdeaDescription(e.target.value)}
            placeholder="Descreva rapidamente o que o time quer construir..."
            rows={4}
            className={`w-full ${inputClassName} px-4 py-3 text-sm leading-7 placeholder:text-brand-off-white/30`}
          />
        </div>
        <div>
          <label className="mb-2 block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
            Categoria
          </label>
          <Select
            value={projectCategory}
            onChange={(e) => setProjectCategory(e.target.value)}
            className="px-4 py-3 text-sm"
          >
            <option value="">Selecione...</option>
            {INTERESTS.map((interest) => (
              <option key={interest} value={interest}>{interest}</option>
            ))}
          </Select>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="primary" size="lg" fullWidth>
          {saving ? 'Salvando...' : saved ? 'Salvo!' : 'Salvar alterações'}
        </Button>
      </div>
    </Card>
  );
}
