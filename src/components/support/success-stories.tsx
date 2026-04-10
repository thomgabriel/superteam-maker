import { Card } from "@/components/ui/card";
import type { SuccessStory } from "@/lib/support-content";

export function SuccessStories({ stories }: { stories: SuccessStory[] }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {stories.map((story) => (
        <a
          key={story.name}
          href={story.url}
          target="_blank"
          rel="noreferrer"
        >
          <Card className="h-full rounded-[1.25rem] border-brand-green/20 bg-brand-dark-green/45 p-5 transition-colors hover:border-brand-green/40">
            <p className="font-heading text-xl font-bold text-brand-off-white">
              {story.name}
            </p>
            <p className="mt-2 text-xs font-medium uppercase tracking-[0.14em] text-brand-yellow/82">
              {story.achievement}
            </p>
            <p className="mt-3 text-xs leading-6 text-brand-off-white/52">
              {story.description}
            </p>
          </Card>
        </a>
      ))}
    </div>
  );
}
