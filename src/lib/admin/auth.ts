import { createServerSupabaseClient } from '@/lib/supabase/server';
import { isAdminUser } from './index';

/**
 * A.3 — Defense-in-depth admin check that runs inside every admin data helper
 * and server action (not just at the page/route boundary).
 *
 * Throws NotAdminError when the caller is not authenticated or not on the
 * admin allowlist. Callers should either let it propagate (server action
 * returns 500 / page shows error) or catch it and redirect to /queue.
 *
 * This intentionally mirrors isAdminUser() — the env-allowlist check is the
 * single source of truth. We do NOT consult a users.is_admin column because
 * no such column exists; adding one would split the admin list across two
 * places (env + DB) and create drift.
 */

export class NotAdminError extends Error {
  readonly code = 'not_admin';

  constructor(message = 'Admin privileges required.') {
    super(message);
    this.name = 'NotAdminError';
  }
}

export async function requireAdmin() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!isAdminUser(user)) {
    throw new NotAdminError();
  }

  return user!;
}
