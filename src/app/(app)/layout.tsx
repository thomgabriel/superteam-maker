/**
 * Protected app layout.
 *
 * Auth is enforced by the middleware (src/lib/supabase/middleware.ts) which
 * redirects unauthenticated requests to /auth before this layout ever runs.
 * Adding a second getUser() + redirect here used to cause an infinite loop:
 * if the middleware refreshed the session token, the new cookies lived on the
 * middleware response, but a *separate* Supabase client created here would
 * read the pre-refresh cookies, see no valid session, and redirect to /auth —
 * where the middleware would see the (still-authenticated) user and bounce
 * them back to /perfil, ad infinitum.
 *
 * Removing the redundant check breaks the loop while keeping all routes
 * under (app)/ fully protected via middleware.
 */
export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
