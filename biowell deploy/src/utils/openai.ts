import { createClient } from '@supabase/supabase-js';
import { getRandomResponse } from './demoResponses';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: Date;
}

const MAX_RETRIES = 3;
const INITIAL_RETRY_DELAY = 1000;

async function wait(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export async function sendChatMessage(message: string, userId: string): Promise<ChatMessage> {
  let retries = 0;
  let lastError: Error | null = null;

  while (retries < MAX_RETRIES) {
    try {
      // For demo mode, use predefined responses
      if (userId === '00000000-0000-0000-0000-000000000000') {
        // Simulate network delay
        await wait(1000);
        
        return {
          role: 'assistant',
          content: getRandomResponse(message.toLowerCase()),
          timestamp: new Date(),
        };
      }

      // Get the current session for authentication
      const { data: { session } } = await supabase.auth.getSession();
      
      // Construct headers with proper authorization
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // If we have a session, use the access token
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      } else {
        // Fall back to anon key if no session
        headers["apikey"] = supabaseAnonKey;
      }

      // Call the Supabase Edge Function
      const functionUrl = `${supabaseUrl}/functions/v1/chat-assistant`;
      
      const response = await fetch(functionUrl, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          userId: userId,
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          error: `Request failed with status ${response.status}` 
        }));
        throw new Error(errorData.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      
      if (!data.choices || !data.choices[0] || !data.choices[0].message) {
        throw new Error('Invalid response format from AI');
      }

      return {
        role: 'assistant',
        content: data.choices[0].message.content,
        timestamp: new Date(),
      };
    } catch (error) {
      console.error(`Attempt ${retries + 1} failed:`, error);
      lastError = error instanceof Error ? error : new Error('Unknown error occurred');
      
      // If we get a 429 (rate limit) error, wait and retry
      if (error instanceof Error && error.message.includes('429')) {
        retries++;
        await wait(INITIAL_RETRY_DELAY * Math.pow(2, retries));
        continue;
      }
      
      if (retries >= MAX_RETRIES - 1) break;
      
      retries++;
      await wait(INITIAL_RETRY_DELAY * Math.pow(2, retries));
    }
  }

  throw lastError || new Error('Failed to send message after retries');
}