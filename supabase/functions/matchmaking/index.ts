Deno.serve(async () => {
  return new Response(
    JSON.stringify({ message: 'Edge function placeholder — use Vercel cron for MVP' }),
    { headers: { 'Content-Type': 'application/json' } },
  );
});
