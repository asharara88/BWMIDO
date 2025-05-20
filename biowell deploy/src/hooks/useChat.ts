import { useState, useCallback } from 'react';
import { useSupabase } from '../contexts/SupabaseContext';
import { useAuth } from '../contexts/AuthContext';
import { ChatMessage, sendChatMessage } from '../utils/openai';

export function () {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { supabase } = useSupabase();
  const { user, isDemo } = useAuth();

  const sendMessage = useCallback(
    async (content: string) => {
      if (!user || !content.trim()) return;

      const userMessage: ChatMessage = {
        role: 'user',
        content,
        timestamp: new Date(),
      };

      setMessages((prevMessages) => [...prevMessages, userMessage]);
      setIsLoading(true);
      setError(null);

      try {
        // Always use the sendChatMessage function which now handles demo responses
        const assistantMessage = await sendChatMessage(content, user.id);
        setMessages((prevMessages) => [...prevMessages, assistantMessage]);
      } catch (err) {
        console.error('Error sending message:', err);
        setError(err instanceof Error ? err.message : 'Failed to send message');
      } finally {
        setIsLoading(false);
      }
    },
    [user]
  );

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages: () => setMessages([]),
  };
}