import { redirect } from 'next/navigation';
import { resolveAuthenticatedUserState } from '@/lib/user-state';

export const dynamic = 'force-dynamic';

export default async function TeamRevealPage() {
  const resolvedState = await resolveAuthenticatedUserState();
  if (!resolvedState) redirect('/auth');

  if (resolvedState.team?.id) {
    redirect(`/team/${resolvedState.team.id}`);
  }

  redirect(resolvedState.redirectPath);
}
