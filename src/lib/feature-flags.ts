// Feature-flag helpers. Flags are reserved for shadow-validation, live-data
// kill-switches, and destructive-action gates — everything else ships as
// plain code.

function flag(name: string): boolean {
  return process.env[name] === 'true';
}

/**
 * Destructive member-initiated leadership reset. Detection runs live
 * unconditionally (read-only), but the "convocar nova liderança" button +
 * server action are gated until we've validated detection accuracy (target:
 * <10% false-positive rate on flagged-dormant leaders).
 */
export const LEADER_DORMANT_RECLAIM = () => flag('LEADER_DORMANT_RECLAIM');
