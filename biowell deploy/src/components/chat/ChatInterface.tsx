import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Loader, AlertCircle, MessageCircle } from 'lucide-react';
import { ChatMessage, sendChatMessage } from '../../utils/openai';
import { useAuth } from '../../contexts/AuthContext';
import { useTheme } from '../../contexts/ThemeContext';

interface ChatInterfaceProps {
  onMessageSent?: (message: ChatMessage) => void;
}

// Focused set of suggested questions with variations
const suggestedQuestionSets = [
  [
    "What's my current health status?",
    "How's my overall health looking?",
    "Can you analyze my health metrics?",
    "Give me a health overview"
  ],
  [
    "How can I improve my sleep quality?",
    "What should I do to sleep better?",
    "Help me optimize my sleep",
    "Why is my sleep quality poor?"
  ],
  [
    "What supplements should I take?",
    "Recommend supplements for my goals",
    "Which supplements would help me most?",
    "Do I need any supplements?"
  ],
  [
    "Analyze my nutrition habits",
    "How can I improve my diet?",
    "What should I eat for better health?",
    "Are my eating patterns healthy?"
  ],
  [
    "Help me reduce stress",
    "What are good stress management techniques?",
    "How can I lower my stress levels?",
    "Why is my HRV showing high stress?"
  ],
  [
    "How's my metabolic health?",
    "Analyze my glucose patterns",
    "How can I improve insulin sensitivity?",
    "What's affecting my metabolic health?"
  ]
];

export default function ChatInterface({ onMessageSent }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();
  const { currentTheme } = useTheme();

  // Get random questions from each category
  const getRandomSuggestions = () => {
    return suggestedQuestionSets.map(set => {
      const randomIndex = Math.floor(Math.random() * set.length);
      return set[randomIndex];
    });
  };

  const [suggestedQuestions, setSuggestedQuestions] = useState(getRandomSuggestions());

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Refresh suggested questions periodically
  useEffect(() => {
    const interval = setInterval(() => {
      if (showSuggestions) {
        setSuggestedQuestions(getRandomSuggestions());
      }
    }, 60000); // Refresh every minute
    
    return () => clearInterval(interval);
  }, [showSuggestions]);

  const handleSubmit = async (e: React.FormEvent | string) => {
    e?.preventDefault?.();
    const messageContent = typeof e === 'string' ? e : input;
    
    if (!messageContent.trim() || !user) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: messageContent,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    setError(null);
    setShowSuggestions(false);

    try {
      const response = await sendChatMessage(messageContent, user.id);
      setMessages(prev => [...prev, response]);
      onMessageSent?.(response);
    } catch (err) {
      console.error('Error sending message:', err);
      setError(err instanceof Error ? err.message : 'Failed to send message');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full flex-col rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] shadow-lg">
      {/* Messages Container */}
      <div className="relative flex-1">
        <div className="relative h-full overflow-y-auto p-3 sm:p-6">
          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
              <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
              <p>{error}</p>
            </div>
          )}

          {messages.length === 0 && showSuggestions ? (
            <div className="flex flex-col items-center justify-center py-6 sm:py-8">
              <MessageCircle className="mb-4 h-10 w-10 text-primary/20 sm:h-12 sm:w-12" />
              <h3 className="mb-2 text-base font-medium sm:text-lg">Welcome to your Health Coach</h3>
              <p className="mb-6 text-center text-xs text-text-light sm:text-sm">
                Ask me anything about your health...
              </p>
              <div className="flex flex-wrap justify-center gap-3">
                {suggestedQuestions.map((question, index) => (
                  <motion.button
                    key={question}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    onClick={() => handleSubmit(question)}
                    className="rounded-full bg-primary/10 px-3 py-2 text-xs text-primary transition-colors hover:bg-primary/20 sm:px-4 sm:py-2 sm:text-sm"
                  >
                    {question}
                  </motion.button>
                ))}
              </div>
            </div>
          ) : (
            <AnimatePresence>
              {messages.map((message, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`mb-3 flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} sm:mb-4`}
                >
                  <div
                    className={`max-w-[85%] rounded-xl px-3 py-2 sm:max-w-[75%] sm:px-4 sm:py-3 ${
                      message.role === 'user'
                        ? 'bg-primary text-white'
                        : currentTheme === 'dark'
                        ? 'bg-[hsl(var(--color-card-hover))] text-text'
                        : 'bg-[hsl(var(--color-surface-2))] text-text'
                    }`}
                  >
                    <div className="prose prose-sm max-w-none dark:prose-invert">
                      {message.content}
                    </div>
                    {message.timestamp && (
                      <div className="mt-1 text-[10px] opacity-70 sm:mt-2 sm:text-xs">
                        {message.timestamp.toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {loading && (
            <div className="flex justify-start">
              <div className={`max-w-[85%] rounded-xl p-3 sm:max-w-[75%] sm:p-4 ${
                currentTheme === 'dark'
                ? 'bg-[hsl(var(--color-card-hover))]'
                : 'bg-[hsl(var(--color-surface-2))]'
              }`}>
                <Loader className="h-4 w-4 animate-spin text-primary sm:h-5 sm:w-5" />
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Form */}
      <div className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3 sm:p-4">
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask me anything about your health..."
            className="flex-1 rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] px-3 py-2 text-sm text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 sm:px-4 sm:py-3"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !input.trim()}
            className="flex items-center justify-center rounded-xl bg-primary px-4 py-2 text-white transition-colors hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-50 sm:px-6 sm:py-3"
          >
            <Send className="h-4 w-4 sm:h-5 sm:w-5" />
          </button>
        </form>
      </div>
    </div>
  );
};