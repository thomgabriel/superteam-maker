import { MACRO_ROLE_LABELS } from "@/lib/constants";
import { Card } from "@/components/ui/card";
import { Tag } from "@/components/ui/tag";
import { sanitizeExternalUrl } from "@/lib/security";

interface MemberCardProps {
  name: string;
  specificRole: string;
  macroRole: string;
  seniority: string;
  isLeader: boolean;
  phoneNumber?: string;
  linkedinUrl?: string | null;
  githubUrl?: string | null;
  xUrl?: string | null;
  showPhone?: boolean;
}

export function MemberCard({
  name,
  specificRole,
  macroRole,
  isLeader,
  phoneNumber,
  linkedinUrl,
  githubUrl,
  xUrl,
  showPhone = false,
}: MemberCardProps) {
  const whatsappUrl = phoneNumber
    ? `https://wa.me/${phoneNumber.replace(/\D/g, "")}`
    : null;
  const socialLinks = [
    { label: "LinkedIn", href: sanitizeExternalUrl(linkedinUrl) },
    { label: "GitHub", href: sanitizeExternalUrl(githubUrl) },
    { label: "X", href: sanitizeExternalUrl(xUrl) },
  ].filter((link): link is { label: string; href: string } =>
    Boolean(link.href),
  );

  return (
    <Card className="rounded-[1.5rem] border-brand-green/28 bg-[linear-gradient(180deg,rgba(27,35,29,0.96),rgba(27,35,29,0.74))] p-5">
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.16em] text-brand-off-white/40">
            Membro
          </p>
          <h3 className="mt-2 font-heading text-xl font-semibold leading-tight">
            {name}
          </h3>
          <p className="mt-1 text-sm leading-6 text-brand-off-white/68">
            {specificRole}
          </p>
        </div>
        {isLeader && (
          <span className="rounded-full border border-brand-yellow/30 bg-brand-yellow/12 px-3 py-1 text-xs font-medium uppercase tracking-[0.14em] text-brand-yellow">
            Líder
          </span>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <Tag selected tone="emerald" className="cursor-default" disabled>
          {MACRO_ROLE_LABELS[macroRole] ?? macroRole}
        </Tag>
      </div>

      {(showPhone && whatsappUrl) || socialLinks.length > 0 ? (
        <div className="mt-5 flex flex-wrap gap-2">
          {showPhone && whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-emerald/30 bg-brand-emerald/10 px-4 py-2 text-sm font-medium text-brand-emerald transition-colors hover:bg-brand-emerald/16"
            >
              <svg
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="h-4 w-4 fill-current"
              >
                <path d="M19.05 4.94A9.94 9.94 0 0012 2a9.94 9.94 0 00-8.58 15l-1.33 4.86 4.98-1.3A10 10 0 1019.05 4.94zM12 20.2a8.2 8.2 0 01-4.17-1.14l-.3-.18-2.95.77.79-2.88-.2-.3A8.2 8.2 0 1112 20.2zm4.5-6.15c-.24-.12-1.4-.7-1.62-.77-.22-.08-.38-.12-.54.11-.16.24-.62.78-.76.94-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.94-1.2-.72-.64-1.2-1.44-1.34-1.68-.14-.24-.01-.37.11-.49.11-.11.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.31-.02-.43-.06-.12-.54-1.3-.74-1.78-.2-.47-.4-.4-.54-.4h-.46c-.16 0-.42.06-.64.3s-.84.82-.84 2c0 1.18.86 2.32.98 2.48.12.16 1.68 2.56 4.08 3.6.57.24 1.01.38 1.36.48.57.18 1.09.15 1.5.09.46-.07 1.4-.57 1.6-1.13.2-.56.2-1.04.14-1.13-.06-.1-.22-.16-.46-.28z" />
              </svg>
              <span>{phoneNumber}</span>
            </a>
          )}

          {socialLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-brand-green/28 bg-brand-green/10 px-4 py-2 text-sm font-medium text-brand-off-white/76 transition-colors hover:border-brand-green hover:text-brand-off-white"
            >
              <span className="text-xs uppercase tracking-[0.12em]">
                {link.label}
              </span>
            </a>
          ))}
        </div>
      ) : null}
    </Card>
  );
}
