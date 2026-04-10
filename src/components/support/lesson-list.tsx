import { Card } from "@/components/ui/card";
import type { LessonGroup } from "@/lib/support-content";

function youtubeId(url: string): string | null {
  const match = url.match(/[?&]v=([^&]+)/);
  return match ? match[1] : null;
}

export function LessonList({ groups }: { groups: LessonGroup[] }) {
  return (
    <div className="grid gap-8">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-3 text-xs uppercase tracking-[0.16em] text-brand-emerald/82">
            {group.title}
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {group.lessons.map((lesson) => {
              const id = youtubeId(lesson.videoUrl);
              return (
                <Card
                  key={lesson.videoUrl}
                  className="h-full rounded-[1.25rem] border-brand-green/20 bg-brand-dark-green/45"
                >
                  {id && (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={`https://img.youtube.com/vi/${id}/mqdefault.jpg`}
                      alt={lesson.title}
                      className="w-full rounded-t-[1.25rem] object-cover"
                    />
                  )}
                  <div className="p-5">
                    <p className="text-sm font-medium text-brand-off-white">
                      {lesson.title}
                    </p>
                    <p className="mt-2 text-xs leading-6 text-brand-off-white/52">
                      {lesson.description}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={lesson.videoUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="text-xs font-medium text-brand-emerald underline-offset-2 hover:underline"
                      >
                        Assistir
                      </a>
                      {lesson.resources?.map((r) => (
                        <a
                          key={r.url}
                          href={r.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-xs text-brand-off-white/42 underline-offset-2 hover:text-brand-off-white/70 hover:underline"
                        >
                          {r.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
