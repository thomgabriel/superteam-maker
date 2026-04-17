"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { updateTeamProfile } from "@/app/(app)/team/[id]/actions";
import type { Team } from "@/types/database";
import { INTERESTS } from "@/lib/constants";
import {
  TEAM_NAME_MAX_LENGTH,
  TEAM_TITLE_MAX_LENGTH,
  TEAM_DESCRIPTION_MAX_LENGTH,
} from "@/lib/team-profile";
import { getLeaderChecklistState } from "@/lib/team-leader-checklist";
import { Button } from "@/components/ui/button";
import { Input, inputClassName } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card } from "@/components/ui/card";

const WHATSAPP_URL_REGEX = /^https:\/\/chat\.whatsapp\.com\/[A-Za-z0-9]{20,25}$/;

function Counter({ value, max }: { value: number; max: number }) {
  const ratio = value / max;
  const tone =
    ratio >= 1
      ? "text-red-300"
      : ratio >= 0.8
        ? "text-brand-yellow"
        : "text-brand-off-white/42";
  return (
    <span className={`text-xs tabular-nums ${tone}`}>
      {value}/{max}
    </span>
  );
}

export function LeaderPanel({
  team,
  memberCount = 0,
  readyCount = 0,
  allReady = false,
}: {
  team: Team;
  memberCount?: number;
  readyCount?: number;
  allReady?: boolean;
}) {
  const [name, setName] = useState(team.name);
  const [ideaTitle, setIdeaTitle] = useState(team.idea_title ?? "");
  const [ideaDescription, setIdeaDescription] = useState(
    team.idea_description ?? "",
  );
  const [projectCategory, setProjectCategory] = useState(
    team.project_category ?? "",
  );
  const [whatsappUrl, setWhatsappUrl] = useState(team.whatsapp_group_url ?? "");
  const [submissionUrl, setSubmissionUrl] = useState(team.submission_url ?? "");
  const [saving, setSaving] = useState(false);
  const [savingWhatsapp, setSavingWhatsapp] = useState(false);
  const [savingSubmission, setSavingSubmission] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savedWhatsapp, setSavedWhatsapp] = useState(false);
  const [savedSubmission, setSavedSubmission] = useState(false);
  const [copied, setCopied] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [whatsappErrorMessage, setWhatsappErrorMessage] = useState<string | null>(null);
  const [submissionErrorMessage, setSubmissionErrorMessage] = useState<string | null>(null);

  const initialSnapshot = useRef(
    JSON.stringify({
      name: team.name,
      ideaTitle: team.idea_title ?? "",
      ideaDescription: team.idea_description ?? "",
      projectCategory: team.project_category ?? "",
      whatsappUrl: team.whatsapp_group_url ?? "",
      submissionUrl: team.submission_url ?? "",
    }),
  );
  const submitting = useRef(false);

  useEffect(() => {
    const current = JSON.stringify({
      name,
      ideaTitle,
      ideaDescription,
      projectCategory,
      whatsappUrl,
      submissionUrl,
    });
    const dirty = current !== initialSnapshot.current;

    function handler(event: BeforeUnloadEvent) {
      if (submitting.current) return;
      event.preventDefault();
      event.returnValue = "";
    }

    if (dirty) {
      window.addEventListener("beforeunload", handler);
      return () => window.removeEventListener("beforeunload", handler);
    }
  }, [name, ideaTitle, ideaDescription, projectCategory, whatsappUrl, submissionUrl]);

  const whatsappValid = useMemo(
    () => whatsappUrl.trim() === "" || WHATSAPP_URL_REGEX.test(whatsappUrl.trim()),
    [whatsappUrl],
  );

  const readinessTarget = Math.max(memberCount - 1, 0);
  const checklist = getLeaderChecklistState(
    team,
    readyCount,
    readinessTarget,
    allReady,
  );

  async function handleSubmissionSave() {
    setSavingSubmission(true);
    setSavedSubmission(false);
    setSubmissionErrorMessage(null);
    submitting.current = true;
    try {
      const result = await updateTeamProfile(team.id, {
        submission_url: submissionUrl || undefined,
      });

      if (!result.success) {
        setSubmissionErrorMessage(result.message ?? "Não foi possível salvar agora.");
        submitting.current = false;
        return;
      }

      setSavedSubmission(true);
      initialSnapshot.current = JSON.stringify({
        name,
        ideaTitle,
        ideaDescription,
        projectCategory,
        whatsappUrl,
        submissionUrl,
      });
      setTimeout(() => setSavedSubmission(false), 2000);
    } catch {
      setSubmissionErrorMessage("Não foi possível salvar agora.");
    } finally {
      submitting.current = false;
      setSavingSubmission(false);
    }
  }

  async function handleCopyWhatsapp() {
    if (!whatsappUrl.trim() || !navigator.clipboard) return;
    try {
      await navigator.clipboard.writeText(whatsappUrl.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Silently ignore — clipboard not available (older browsers, insecure contexts)
    }
  }

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setErrorMessage(null);
    submitting.current = true;
    try {
      const result = await updateTeamProfile(team.id, {
        name,
        idea_title: ideaTitle || undefined,
        idea_description: ideaDescription || undefined,
        project_category: projectCategory || undefined,
        whatsapp_group_url: whatsappUrl || undefined,
      });

      if (!result.success) {
        setErrorMessage(result.message ?? "Não foi possível salvar agora.");
        submitting.current = false;
        return;
      }

      setSaved(true);
      initialSnapshot.current = JSON.stringify({
        name,
        ideaTitle,
        ideaDescription,
        projectCategory,
        whatsappUrl,
        submissionUrl,
      });
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setErrorMessage("Não foi possível salvar agora.");
    } finally {
      submitting.current = false;
      setSaving(false);
    }
  }

  async function handleWhatsappSave() {
    if (!whatsappValid) {
      setWhatsappErrorMessage(
        "Link do WhatsApp inválido. Use um link do tipo https://chat.whatsapp.com/...",
      );
      return;
    }
    setSavingWhatsapp(true);
    setSavedWhatsapp(false);
    setWhatsappErrorMessage(null);
    submitting.current = true;
    try {
      const result = await updateTeamProfile(team.id, {
        whatsapp_group_url: whatsappUrl || undefined,
      });

      if (!result.success) {
        setWhatsappErrorMessage(result.message ?? "Não foi possível salvar agora.");
        submitting.current = false;
        return;
      }

      setSavedWhatsapp(true);
      initialSnapshot.current = JSON.stringify({
        name,
        ideaTitle,
        ideaDescription,
        projectCategory,
        whatsappUrl,
        submissionUrl,
      });
      setTimeout(() => setSavedWhatsapp(false), 2000);
    } catch {
      setWhatsappErrorMessage("Não foi possível salvar agora.");
    } finally {
      submitting.current = false;
      setSavingWhatsapp(false);
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

      <div className="rounded-2xl border border-brand-emerald/24 bg-brand-emerald/8 p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand-emerald/82">
              Link da submissão
            </p>
            <p className="mt-2 text-sm leading-6 text-brand-off-white/72">
              Quando submeterem o projeto no Colosseum, cole o link aqui para registrar a
              participação do time.
            </p>
          </div>
          {savedSubmission && (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-emerald">
              Link salvo
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="url"
            value={submissionUrl}
            onChange={(e) => setSubmissionUrl(e.target.value)}
            placeholder="https://arena.colosseum.org/..."
            className="px-4 py-3 text-sm placeholder:text-brand-off-white/30"
          />
          <Button
            onClick={handleSubmissionSave}
            disabled={savingSubmission}
            variant="primary"
            className="sm:w-auto"
          >
            {savingSubmission ? "Salvando..." : savedSubmission ? "Salvo!" : "Salvar"}
          </Button>
        </div>

        {team.submitted_at && (
          <p className="mt-3 text-xs text-brand-off-white/52">
            Submetido em {new Date(team.submitted_at).toLocaleDateString('pt-BR')}
          </p>
        )}

        {submissionErrorMessage && (
          <p className="mt-3 text-sm text-red-300">{submissionErrorMessage}</p>
        )}
      </div>

      <div className="border-t border-brand-yellow/12 pt-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow/62">
              Grupo do WhatsApp
            </p>
            <p className="mt-2 text-sm leading-7 text-brand-off-white/72">
              Crie o grupo, cole o link aqui e adicione todo mundo para acelerar a
              organização do time.
            </p>
          </div>
          {savedWhatsapp && (
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-brand-emerald">
              Link salvo
            </p>
          )}
        </div>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <Input
            type="url"
            value={whatsappUrl}
            onChange={(e) => setWhatsappUrl(e.target.value)}
            placeholder="https://chat.whatsapp.com/..."
            className="px-4 py-3 text-sm placeholder:text-brand-off-white/30"
          />
          {whatsappUrl.trim() && whatsappValid && (
            <Button
              type="button"
              onClick={handleCopyWhatsapp}
              variant="accent"
              className="sm:w-auto"
            >
              {copied ? "Copiado!" : "Copiar"}
            </Button>
          )}
          <Button
            onClick={handleWhatsappSave}
            disabled={savingWhatsapp || !whatsappValid}
            variant="secondary"
            className="sm:w-auto"
          >
            {savingWhatsapp ? "Salvando..." : savedWhatsapp ? "Salvo!" : "Salvar"}
          </Button>
        </div>

        {!whatsappValid && whatsappUrl.trim() !== "" && (
          <p className="mt-2 text-xs text-red-300">
            Link inválido. Use o formato https://chat.whatsapp.com/...
          </p>
        )}

        {whatsappErrorMessage && (
          <p className="mt-3 text-sm text-red-300">{whatsappErrorMessage}</p>
        )}
      </div>

      <div className="border-t border-brand-yellow/12 pt-5">
        <p className="text-xs uppercase tracking-[0.16em] text-brand-yellow/62">Checklist</p>
        {checklist.nextStepMessage ? (
          <p className="mt-3 text-sm font-medium text-brand-yellow">
            Próximo passo: {checklist.nextStepMessage}
          </p>
        ) : (
          <p className="mt-3 text-sm font-medium text-brand-emerald">
            Tudo pronto! Agora é construir.
          </p>
        )}
        <div className="mt-4 space-y-2.5">
          {checklist.steps.map((step) => (
            <div key={step.label} className="flex items-center gap-3">
              {step.done ? (
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-emerald/20 text-brand-emerald">
                  <svg viewBox="0 0 16 16" className="h-3 w-3 fill-current">
                    <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z" />
                  </svg>
                </span>
              ) : (
                <span className="h-5 w-5 rounded-full border-2 border-brand-off-white/20" />
              )}
              <span
                className={`text-sm ${step.done ? "text-brand-off-white/72" : "text-brand-off-white/42"}`}
              >
                {step.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="grid gap-4 border-t border-brand-yellow/12 pt-5">
        {errorMessage && (
          <p className="rounded-lg bg-red-900/30 px-4 py-2 text-sm text-red-300">
            {errorMessage}
          </p>
        )}
        <div>
          <div className="mb-2 flex items-end justify-between">
            <label className="block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
              Nome do time
            </label>
            <Counter value={name.length} max={TEAM_NAME_MAX_LENGTH} />
          </div>
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value.slice(0, TEAM_NAME_MAX_LENGTH))}
            className="px-4 py-3 text-sm"
          />
        </div>
        <div>
          <div className="mb-2 flex items-end justify-between">
            <label className="block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
              Ideia do projeto
            </label>
            <Counter value={ideaTitle.length} max={TEAM_TITLE_MAX_LENGTH} />
          </div>
          <Input
            type="text"
            value={ideaTitle}
            onChange={(e) => setIdeaTitle(e.target.value.slice(0, TEAM_TITLE_MAX_LENGTH))}
            placeholder="Título da ideia"
            className="px-4 py-3 text-sm placeholder:text-brand-off-white/30"
          />
        </div>
        <div>
          <div className="mb-2 flex items-end justify-between">
            <label className="block text-xs font-medium uppercase tracking-[0.14em] text-brand-off-white/54">
              Descrição
            </label>
            <Counter value={ideaDescription.length} max={TEAM_DESCRIPTION_MAX_LENGTH} />
          </div>
          <textarea
            value={ideaDescription}
            onChange={(e) =>
              setIdeaDescription(e.target.value.slice(0, TEAM_DESCRIPTION_MAX_LENGTH))
            }
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
              <option key={interest} value={interest}>
                {interest}
              </option>
            ))}
          </Select>
        </div>
        <Button onClick={handleSave} disabled={saving} variant="primary" size="lg" fullWidth>
          {saving ? "Salvando..." : saved ? "Salvo!" : "Salvar alterações"}
        </Button>
      </div>
    </Card>
  );
}
