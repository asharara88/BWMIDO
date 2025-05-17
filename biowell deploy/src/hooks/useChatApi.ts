import { useState } from "react";
import { useSupabase } from "../contexts/SupabaseContext";

export function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();

  const sendMessage = async (messages: { role: string; content: string }[], userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Construct headers with proper authorization
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
      };

      // If we have a session, use the access token
      if (session?.access_token) {
        headers["Authorization"] = `Bearer ${session.access_token}`;
      }

      // Always include the anon key as a fallback
      headers["apikey"] = import.meta.env.VITE_SUPABASE_ANON_KEY;

      // Ensure we're using the correct URL format
      const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/chat-assistant`;

      const res = await fetch(functionUrl, {
        method: "POST",
        headers,
        body: JSON.stringify({ messages, userId }),
        // Add credentials to ensure cookies are sent
        credentials: 'include'
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ 
          error: `Request failed with status ${res.status}` 
        }));
        throw new Error(errorData.error || errorData.message || `Request failed with status ${res.status}`);
      }

      const data = await res.json();
      return data.choices?.[0]?.message?.content || "";
    } catch (err: any) {
      console.error("Chat API error:", err);
      const errorMessage = err.message || "Failed to connect to chat service. Please try again.";
      setError(errorMessage);
      return "";
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}