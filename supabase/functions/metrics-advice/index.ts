import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "true",
};

export async function handleRequest(req: Request): Promise<Response> {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    const openaiApiKey = Deno.env.get("OPENAI_API_KEY") as string;

    if (!supabaseUrl || !supabaseKey || !openaiApiKey) {
      throw new Error("Missing configuration");
    }

    const supabase = createClient(supabaseUrl, supabaseKey);
    const { userId, userQuestion } = await req.json();

    const { data: userMetrics, error } = await supabase
      .from("user_metrics")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error) {
      return new Response(
        JSON.stringify({ error: error.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const prompt = `\n  User metrics:\n  - Sleep hours: ${userMetrics.sleep_hours}\n  - Deep sleep: ${userMetrics.deep_sleep_minutes} minutes\n  - Daily steps: ${userMetrics.daily_steps}\n  - Calories burned: ${userMetrics.calories_burned}\n  - BMI: ${userMetrics.bmi}\n  - Activity goal: ${userMetrics.activity_goal}\n\n  User question: "${userQuestion}"\n\n  Provide clear, actionable, personalized recommendations based on the provided metrics.\n  `;

    const openaiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${openaiApiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4-turbo",
        messages: [{ role: "user", content: prompt }],
        max_tokens: 300,
      }),
    });

    const gptData = await openaiResponse.json();

    return new Response(
      JSON.stringify({ reply: gptData.choices[0].message.content }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err: any) {
    return new Response(
      JSON.stringify({ error: err.message || "Internal server error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
}

Deno.serve(handleRequest);
