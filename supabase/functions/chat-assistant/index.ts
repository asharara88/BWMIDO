import { createClient } from "npm:@supabase/supabase-js";
import * as Sentry from "npm:@sentry/node";

Sentry.init({ dsn: Deno.env.get("SENTRY_DSN") || "", tracesSampleRate: 1.0 });

/**
 * Edge Function used by the chat UI for demo responses.
 * Includes basic rate limiting and error capture.
 */
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-api-key",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "true",
};

const RATE_LIMIT_WINDOW = 60; // seconds
const RATE_LIMIT_MAX = 5;

function getIdentifier(req: Request) {
  return (
    req.headers.get("x-forwarded-for") ||
    req.headers.get("cf-connecting-ip") ||
    "anonymous"
  );
}

async function checkRateLimit(supabase: any, id: string): Promise<boolean> {
  const windowStart = new Date(
    Math.floor(Date.now() / (RATE_LIMIT_WINDOW * 1000)) *
      RATE_LIMIT_WINDOW *
      1000
  );
  const { data } = await supabase
    .from("api_rate_limits")
    .select("count")
    .eq("identifier", id)
    .eq("window_start", windowStart.toISOString())
    .single();

  if (data && data.count >= RATE_LIMIT_MAX) {
    return false;
  }

  if (data) {
    await supabase
      .from("api_rate_limits")
      .update({ count: data.count + 1 })
      .eq("identifier", id)
      .eq("window_start", windowStart.toISOString());
  } else {
    await supabase
      .from("api_rate_limits")
      .insert({ identifier: id, window_start: windowStart.toISOString(), count: 1 });
  }

  return true;
}

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Missing Supabase configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    const identifier = getIdentifier(req);
    if (!(await checkRateLimit(supabase, identifier))) {
      return new Response(JSON.stringify({ error: { message: "Rate limit exceeded" } }), {
        status: 429,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { messages, userId } = await req.json();
    const responseContent = messages[messages.length - 1].content;

    if (userId) {
      await supabase.from("chat_history").insert({
        user_id: userId,
        message: responseContent,
        response: responseContent,
      });
    }

    return new Response(
      JSON.stringify({ choices: [{ message: { role: "assistant", content: responseContent } }] }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    Sentry.captureException(err);
    return new Response(
      JSON.stringify({ error: { message: err.message || "Internal server error" } }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

Deno.serve(handleRequest);
