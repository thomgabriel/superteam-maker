import type { EnrichedPoolUser, Seniority } from '@/types/database';
import { MATCHMAKING_CONFIG } from './config';
import { scoreCandidate } from './scoring';
import { generateTeamName } from './team-names';

const SENIORITY_ORDER: Seniority[] = ['beginner', 'junior', 'mid', 'senior'];

export interface FormedTeam {
  name: string;
  members: EnrichedPoolUser[];
}

export function runMatchmaking(
  pool: EnrichedPoolUser[],
  roundNumber: number,
): FormedTeam[] {
  const config = MATCHMAKING_CONFIG;
  const isFallback = roundNumber >= config.minPoolSizeByRound.length;
  const weights = isFallback ? config.fallbackWeights : config.weights;

  const groups = new Map<Seniority, EnrichedPoolUser[]>();
  for (const user of pool) {
    const group = groups.get(user.seniority) ?? [];
    group.push(user);
    groups.set(user.seniority, group);
  }

  const teams: FormedTeam[] = [];
  const assigned = new Set<string>();

  for (const seniority of SENIORITY_ORDER) {
    const group = (groups.get(seniority) ?? []).filter(
      (u) => !assigned.has(u.user_id),
    );

    while (group.filter((u) => !assigned.has(u.user_id)).length >= config.minTeamSize) {
      const available = group.filter((u) => !assigned.has(u.user_id));
      if (available.length < config.minTeamSize) break;

      available.sort(
        (a, b) =>
          new Date(a.waiting_since).getTime() -
          new Date(b.waiting_since).getTime(),
      );
      const anchor = available[0];
      const team: EnrichedPoolUser[] = [anchor];
      assigned.add(anchor.user_id);

      const maxWaitMs = Math.max(
        ...pool.map((u) => Date.now() - new Date(u.waiting_since).getTime()),
        1,
      );

      const remaining = available.slice(1).filter((u) => !assigned.has(u.user_id));

      while (team.length < config.targetTeamSize && remaining.length > 0) {
        let bestIdx = 0;
        let bestScore = -1;

        for (let i = 0; i < remaining.length; i++) {
          if (assigned.has(remaining[i].user_id)) continue;
          const score = scoreCandidate(remaining[i], team, maxWaitMs, weights);
          if (score > bestScore) {
            bestScore = score;
            bestIdx = i;
          }
        }

        const picked = remaining.splice(bestIdx, 1)[0];
        team.push(picked);
        assigned.add(picked.user_id);
      }

      if (team.length < config.targetTeamSize) {
        const seniorityIdx = SENIORITY_ORDER.indexOf(seniority);
        const adjacentSeniorities = [
          SENIORITY_ORDER[seniorityIdx - 1],
          SENIORITY_ORDER[seniorityIdx + 1],
        ].filter(Boolean) as Seniority[];

        for (const adjSeniority of adjacentSeniorities) {
          const adjGroup = (groups.get(adjSeniority) ?? []).filter(
            (u) => !assigned.has(u.user_id),
          );
          if (adjGroup.length === 0) continue;

          let bestUser: EnrichedPoolUser | null = null;
          let bestScore = -1;

          for (const user of adjGroup) {
            const score = scoreCandidate(user, team, maxWaitMs, weights);
            if (score > bestScore) {
              bestScore = score;
              bestUser = user;
            }
          }

          if (bestUser) {
            team.push(bestUser);
            assigned.add(bestUser.user_id);
          }

          if (team.length >= config.targetTeamSize) break;
        }
      }

      if (team.length >= config.minTeamSize) {
        teams.push({ name: generateTeamName(), members: team });
      } else {
        for (const member of team) {
          assigned.delete(member.user_id);
        }
      }
    }
  }

  return teams;
}
