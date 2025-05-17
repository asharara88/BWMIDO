import { useState } from 'react';
import { motion } from 'framer-motion';
import { Send, Loader, AlertCircle, MessageCircle } from 'lucide-react';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';

export default function CoachChat() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { supabase } = useSupabase();
  const { user } = useAuth();

  const handleSend = async () => {
    if (!input.trim()) return;
    
    setLoading(true);
    setError('');
    setResponse('');

    try {
      // Get the current session
      const { data: { session } } = await supabase.auth.getSession();
      
      // Construct headers with proper authorization
      const headers: Record<string, string> = {
        "Content-Type": "application/json",
        apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        Authorization: user?.access_token
          ? `Bearer ${user.access_token}`
          : `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}`,
      };
      
      // Use the openai-proxy endpoint
      const endpoint = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/openai-proxy`;

      const res = await fetch(endpoint, {
        method: "POST",
        headers,
        body: JSON.stringify({ 
          messages: [{ role: 'user', content: input }],
          userId: user?.id,
          context: {
            steps: 8432,
            sleep_score: 82,
            goal: "improve deep sleep",
            device: "Apple Watch"
          }
        }),
        // Add credentials to ensure cookies are sent
        credentials: 'include'
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err?.error || `Request failed with ${res.status}`);
      }

      const data = await res.json();
      const content = data.choices?.[0]?.message?.content || "No response.";
      setResponse(content);
    } catch (err: any) {
      setError(err.message || "Failed to fetch");
      console.error("Chat error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] shadow-sm">
      <div className="border-b border-[hsl(var(--color-border))] bg-[hsl(var(--color-card-hover))] p-3">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-medium">Quick Coach Chat</h3>
            <p className="text-xs text-text-light">Ask a health question</p>
          </div>
        </div>
      </div>
      
      <div className="p-4">
        <div className="mb-4">
          <input
            className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] px-3 py-2 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. give me a supplement stack for sleep"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
          />
        </div>
        
        <div className="flex justify-end">
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? (
              <>
                <Loader className="h-4 w-4 animate-spin" />
                <span>Thinking...</span>
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                <span>Ask</span>
              </>
            )}
          </button>
        </div>

        {error && (
          <div className="mt-4 flex items-center gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        )}
        
        {response && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4"
          >
            <h4 className="mb-2 text-sm font-medium">Coach Response:</h4>
            <div className="prose prose-sm max-w-none whitespace-pre-wrap text-text-light">
              {response}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}