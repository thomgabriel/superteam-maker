import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

Deno.serve(async (req) => {
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );

  return new Response(
    JSON.stringify({ message: 'Edge function placeholder — use Vercel cron for MVP' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
