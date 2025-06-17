/**
 * Simple health check endpoint returning status information.
 */
export async function handleRequest(): Promise<Response> {
  return new Response(JSON.stringify({ status: 'ok' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}

Deno.serve(handleRequest);
