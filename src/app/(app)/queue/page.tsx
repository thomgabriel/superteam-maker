import { redirect } from "next/navigation";
import { QueueStatus } from "@/components/queue/queue-status";
import Image from "next/image";
import { resolveAuthenticatedUserState } from "@/lib/user-state";
import { TrackPageView } from "@/components/ui/track-event";
import { createServerSupabaseClient } from '@/lib/supabase/server';

export const dynamic = "force-dynamic";

export default async function QueuePage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect("/auth");
  if (resolvedState.state !== "waiting_match") {
    redirect(resolvedState.redirectPath);
  }

  // Load profile interests for recap card + pool count for context
  const supabase = await createServerSupabaseClient();
  const interests = resolvedState.profile
    ? (await supabase.from('profile_interests').select('interest').eq('profile_id', resolvedState.profile.id)).data ?? []
    : [];

  const { data: poolCountData } = await supabase.rpc('get_waiting_pool_count');
  const poolCount = typeof poolCountData === 'number' ? poolCountData : null;

  return (
    <main className="relative min-h-screen overflow-hidden px-4 py-8 sm:px-6 lg:px-8">
      <TrackPageView event="entered_pool" />
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute inset-x-0 top-0 h-[34rem] bg-[radial-gradient(circle_at_top,rgba(0,139,76,0.18),transparent_42%),radial-gradient(circle_at_82%_18%,rgba(255,210,63,0.10),transparent_28%),linear-gradient(180deg,#1b231d_0%,#162018_50%,#1b231d_100%)]" />
        <Image
          src="/brand/elements/morth-09.svg"
          alt=""
          width={300}
          height={300}
          className="absolute -right-10 top-1/4 opacity-12"
        />
        <Image
          src="/brand/elements/morth-21.svg"
          alt=""
          width={300}
          height={300}
          className="absolute -left-12 top-12 opacity-10"
        />
      </div>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-6xl items-start pt-8 sm:pt-16 lg:pt-18">
        <QueueStatus
          userId={resolvedState.userId}
          profile={resolvedState.profile}
          interests={interests.map((i) => i.interest)}
          poolEntryCreatedAt={resolvedState.poolEntry?.created_at ?? null}
          poolCount={poolCount}
        />
      </div>
    </main>
  );
}
