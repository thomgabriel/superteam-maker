import { SENIORITY_LABELS, MACRO_ROLE_LABELS } from '@/lib/constants';

interface MemberCardProps {
  name: string;
  specificRole: string;
  macroRole: string;
  seniority: string;
  isLeader: boolean;
  phoneNumber?: string;
  showPhone?: boolean;
}

export function MemberCard({
  name,
  specificRole,
  macroRole,
  seniority,
  isLeader,
  phoneNumber,
  showPhone = false,
}: MemberCardProps) {
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/\D/g, '')}`
    : null;

  return (
    <div className="rounded-lg border border-brand-green/30 bg-brand-dark-green p-4">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-heading text-base font-semibold">{name}</h3>
          <p className="text-sm text-brand-off-white/70">{specificRole}</p>
        </div>
        {isLeader && (
          <span className="rounded-full bg-brand-yellow/20 px-2 py-0.5 text-xs font-medium text-brand-yellow">
            Líder
          </span>
        )}
      </div>
      <div className="mt-2 flex gap-2">
        <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs text-brand-off-white/60">
          {MACRO_ROLE_LABELS[macroRole] ?? macroRole}
        </span>
        <span className="rounded-full bg-brand-green/20 px-2 py-0.5 text-xs text-brand-off-white/60">
          {SENIORITY_LABELS[seniority] ?? seniority}
        </span>
      </div>
      {showPhone && whatsappUrl && (
        <a
          href={whatsappUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1 text-sm text-brand-emerald hover:underline"
        >
          Contato via WhatsApp
        </a>
      )}
    </div>
  );
}
