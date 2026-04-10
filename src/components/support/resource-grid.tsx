import { Card } from "@/components/ui/card";
import type { ResourceGroup } from "@/lib/support-content";

export function ResourceGrid({ groups }: { groups: ResourceGroup[] }) {
  return (
    <div className="grid gap-8">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-brand-emerald/82">
            {group.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {group.links.map((link) => (
              <a
                key={link.url}
                href={link.url}
                target="_blank"
                rel="noreferrer"
              >
                <Card className="h-full rounded-[1.25rem] border-brand-green/20 bg-brand-dark-green/45 p-5 transition-colors hover:border-brand-green/40">
                  <p className="text-sm font-medium text-brand-off-white">
                    {link.title}
                  </p>
                  <p className="mt-2 text-xs leading-6 text-brand-off-white/52">
                    {link.description}
                  </p>
                </Card>
              </a>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
