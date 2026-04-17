import type { User } from '@supabase/supabase-js';

function parseAllowlist(value: string | undefined): Set<string> {
  if (!value) {
    return new Set();
  }

  return new Set(
    value
      .split(',')
      .map((entry) => entry.trim().toLowerCase())
      .filter(Boolean),
  );
}

export function isAdminUser(user: User | null): boolean {
  if (!user) {
    return false;
  }

  const emailAllowlist = parseAllowlist(process.env.ADMIN_EMAIL_ALLOWLIST);
  const idAllowlist = parseAllowlist(process.env.ADMIN_USER_ID_ALLOWLIST);

  const email = user.email?.toLowerCase();
  return (email ? emailAllowlist.has(email) : false) || idAllowlist.has(user.id.toLowerCase());
}
