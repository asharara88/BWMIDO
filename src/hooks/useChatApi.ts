import { useState } from "react";
import { supabase } from "../lib/supabaseClient";

export function useChatApi() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sendMessage = async (messages: { role: string; content: string }[], userId?: string) => {
    setLoading(true);
    setError(null);

    try {
      // Validate Supabase URL
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
      if (!supabaseUrl) {
        throw new Error("Supabase URL is not configured. Please check your environment variables.");
      }

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
      if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
        headers["apikey"] = import.meta.env.VITE_SUPABASE_ANON_KEY;
      } else {
        console.warn("Supabase Anon Key is missing. Authentication might fail.");
      }
      
      // Use the chat-assistant endpoint instead of openai-proxy
      const endpoint = `${supabaseUrl}/functions/v1/chat-assistant`;

      console.log("Sending request to:", endpoint);

      const response = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messages, 
          userId: userId || session?.user?.id,
          context: {
            steps: 8432,
            sleep_score: 82,
            goal: "improve deep sleep",
            device: "Apple Watch"
          }
        }),
        credentials: 'include'
      });

      if (!response.ok) {
        // Try to get detailed error message from response
        let errorMessage = `Request failed with status ${response.status}`;
        try {
          const errorData = await response.json();
          if (errorData.error?.message) {
            errorMessage = errorData.error.message;
          }
        } catch (parseError) {
          console.error("Error parsing error response:", parseError);
        }

        // Handle specific status codes
        switch (response.status) {
          case 401:
            throw new Error("Authentication failed. Please try logging in again.");
          case 404:
            throw new Error("Chat service endpoint not found. Please try again later.");
          case 429:
            throw new Error("Too many requests. Please wait a moment and try again.");
          default:
            throw new Error(errorMessage);
        }
      }

      const data = await response.json();
      return data.choices?.[0]?.message?.content || data.response || "";
    } catch (err: any) {
      console.error("Chat API error:", err);
      let errorMessage: string;

      if (err instanceof TypeError && err.message === "Failed to fetch") {
        errorMessage = "Unable to connect to the chat service. Please check your internet connection and try again.";
      } else {
        errorMessage = err.message || "Failed to connect to chat service. Please try again.";
      }

      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return { sendMessage, loading, error };
}