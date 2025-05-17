import { createClient } from "npm:@supabase/supabase-js";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-api-key",
  "Access-Control-Max-Age": "86400",
  "Access-Control-Allow-Credentials": "true",
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    // Get the authorization header and apikey
    const authHeader = req.headers.get('Authorization');
    const apiKey = req.headers.get('apikey') || req.headers.get('x-api-key');

    if (!authHeader && !apiKey) {
      return new Response(
        JSON.stringify({ error: { message: "Authorization header or API key is required" } }),
        {
          status: 401,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    // Parse the request body
    const { messages, userId, context } = await req.json();

    // Create Supabase client
    const supabaseUrl = Deno.env.get("SUPABASE_URL") as string;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") as string;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase configuration is missing");
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check for OpenAI API key
    const openaiKey = Deno.env.get("OPENAI_API_KEY");

    if (!openaiKey) {
      throw new Error("OpenAI API key is not configured");
    }

    // System prompt for the health coach
    const systemPrompt = `You are Biowell AI, a personalized health coach focused on providing evidence-based health advice and supplement recommendations.

Your role is to:
- Provide personalized health advice based on user data and goals
- Make evidence-based supplement and lifestyle recommendations
- Help users understand their health metrics and trends
- Suggest actionable steps for health optimization

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

    // Demo responses based on user's health data
    const DEMO_RESPONSES = {
      "what's my current health status": `Here's an analysis of your current health metrics:

| Metric | Value | Status | Trend |
|--------|--------|--------|--------|
| Health Score | 82/100 | Good | ↑ +4% |
| Sleep Quality | 85% | Optimal | ↑ +15% |
| Recovery Score | 88/100 | Excellent | ↑ +5% |
| Daily Steps | 8,432 | Near Target | → |

### Key Insights
1. Sleep quality has improved significantly
2. Recovery metrics show good adaptation
3. Activity level is approaching targets

### Recommendations
1. Morning Activity
   - Add 1,500 steps to reach 10,000 goal
   - Consider morning walk routine

2. Recovery Optimization
   - Maintain current sleep schedule
   - Continue stress management practices`,

      "how can i improve my sleep quality": `Based on your sleep data, here are structured recommendations:

| Current Metric | Your Value | Target Range | Status |
|---------------|------------|--------------|---------|
| Deep Sleep | 1.8 hrs | 1.5-2.0 hrs | ✓ Good |
| Sleep Duration | 7.2 hrs | 7-9 hrs | ! Improve |
| Sleep Timing | 11:30 PM | 10:00-10:30 PM | ! Adjust |

### Recommended Protocol

1. Pre-Sleep Routine
   | Time | Activity | Purpose |
   |------|----------|----------|
   | 2 hrs before | Reduce blue light | Melatonin production |
   | 1 hr before | Light stretching | Physical relaxation |
   | 30 min before | Meditation | Mental relaxation |

2. Environment Optimization
   - Temperature: 65-68°F
   - Lighting: Blackout curtains
   - Sound: White noise or silence

3. Supplement Support
   | Supplement | Dosage | Timing |
   |------------|---------|---------|
   | Magnesium | 300-400mg | 1 hr before bed |
   | L-Theanine | 200mg | 30 min before bed |`,

      "what supplements should i take": `Based on your health profile, here are evidence-based recommendations:

### Core Supplements
| Supplement | Daily Dosage | Benefits | Timing |
|------------|--------------|-----------|---------|
| Vitamin D3+K2 | 5000 IU D3, 100mcg K2 | Immune & bone health | With breakfast |
| Magnesium | 300-400mg | Sleep & stress | Evening |
| Omega-3 | 2-3g | Heart & brain health | With meals |

### Goal-Specific Supplements
| Goal | Supplement | Dosage | Timing |
|------|------------|---------|---------|
| Sleep | Magnesium Glycinate | 300-400mg | 1 hr before bed |
| Recovery | L-Glutamine | 5g | Post-workout |
| Focus | Alpha-GPC | 300mg | Morning |

### Usage Protocol
1. Morning Stack
   - Vitamin D3+K2 with breakfast
   - Alpha-GPC (if focus is priority)

2. Post-Workout
   - L-Glutamine
   - Electrolytes as needed

3. Evening
   - Magnesium Glycinate
   - Omega-3 with dinner`,

      "default": `I understand you're interested in improving your health. Based on your recent metrics, your overall health score is 82/100, with good sleep quality and recovery. Your daily step count is 8,432, approaching the recommended 10,000 steps. What specific aspect of your health would you like to focus on today?`
    };

    // For demo mode or regular users, use predefined responses
    const userMessage = messages[messages.length - 1].content.toLowerCase().trim();
    
    // Find the closest matching demo response
    let responseContent = DEMO_RESPONSES.default;
    for (const [key, value] of Object.entries(DEMO_RESPONSES)) {
      if (userMessage.includes(key) || key.includes(userMessage)) {
        responseContent = value;
        break;
      }
    }

    // Store the chat history if we have a valid user ID
    if (userId) {
      try {
        await supabase.from("chat_history").insert({
          user_id: userId,
          message: messages[messages.length - 1].content,
          response: responseContent
        });
        console.log("Chat history saved for user:", userId);
      } catch (error) {
        console.error("Failed to store chat history:", error);
      }
    }

    return new Response(
      JSON.stringify({
        choices: [
          {
            message: {
              role: "assistant",
              content: responseContent,
            },
          },
        ],
      }),
      {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Function error:", error);
    return new Response(
      JSON.stringify({ 
        error: { 
          message: error.message || "Internal server error",
          type: error.name || "Error",
          status: 500
        }
      }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});