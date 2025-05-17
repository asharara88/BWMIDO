const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey",
  "Access-Control-Allow-Credentials": "true"
};
// System prompt to enforce evidence-based recommendations
const SYSTEM_PROMPT = `You are Biowell, a personalized health coach focused on providing evidence-based health advice and supplement recommendations.

Your role is to:
- Provide personalized health advice based on user data and goals
- Make evidence-based supplement and lifestyle recommendations
- Help users understand their health metrics and trends
- Suggest actionable steps for health optimization

Response Format Guidelines:
1. For metric analysis or comparisons, use markdown tables
2. For recommendations, use numbered lists with clear categories
3. For supplement suggestions, structure as:
   | Supplement | Dosage | Benefits | Timing |
   |------------|---------|-----------|---------|
4. For health insights, break down into clear sections using markdown headers

Guidelines:
- Always base recommendations on scientific research
- Consider the user's health data, goals, and conditions
- Be honest about limitations of current research
- Avoid making diagnostic or strong medical claims
- Defer to healthcare professionals for medical issues
- Focus on lifestyle, nutrition, exercise, and well-researched supplements
- Provide specific, actionable advice when possible
- Maintain a supportive and encouraging tone

Remember: You're a coach and guide, not a replacement for medical care.`;
Deno.serve(async (req)=>{
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: corsHeaders
    });
  }
  try {
    // Extract OpenAI API key from environment variables
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    console.log("OpenAI API key available:", !!OPENAI_API_KEY);
    if (!OPENAI_API_KEY) {
      throw new Error("Missing OpenAI API key");
    }
    // Parse the request body
    const { messages, userId } = await req.json();
    if (!messages || !Array.isArray(messages)) {
      throw new Error("Invalid messages format");
    }
    console.log("Using OpenAI API with key available:", !!OPENAI_API_KEY);
    // Prepare messages for OpenAI API
    const formattedMessages = [
      {
        role: "system",
        content: SYSTEM_PROMPT
      },
      ...messages
    ];
    // Call OpenAI API
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages: formattedMessages,
        temperature: 0.7,
        max_tokens: 1000
      })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(()=>({}));
      console.error("OpenAI API error:", errorData);
      throw new Error(`OpenAI API error: ${response.status}`);
    }
    const data = await response.json();
    return new Response(JSON.stringify({
      choices: [
        {
          message: {
            role: "assistant",
            content: data.choices[0].message.content
          }
        }
      ]
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response(JSON.stringify({
      error: error.message || "Internal server error",
      details: error.stack
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
