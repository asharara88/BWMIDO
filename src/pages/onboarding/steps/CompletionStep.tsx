import { motion } from 'framer-motion';
import { CheckCircle, ArrowRight } from 'lucide-react';

// If you want to keep the more flexible prop interface from the "codex/introduce-modular-onboarding-steps" branch:
interface CompletionStepProps {
  completeOnboarding?: () => Promise<void>;
  onNext?: () => void;
  loading?: boolean;
}

const CompletionStep = ({
  completeOnboarding,
  onNext,
  loading = false,
}: CompletionStepProps) => {
  // Prefer onNext if present, fallback to completeOnboarding for backward compatibility
  const handleClick = onNext
    ? () => onNext()
    : completeOnboarding
    ? () => completeOnboarding()
    : undefined;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle className="h-10 w-10" />
      </motion.div>

      <h2 className="mb-4 text-2xl font-bold">You're All Set!</h2>

      <p className="mb-8 text-text-light">
        Thanks for sharing your health information. We'll use this to provide personalized insights and recommendations.
      </p>

      <div className="mb-8 w-full rounded-lg bg-primary/5 p-5">
        <h3 className="mb-3 text-lg font-medium">What's Next?</h3>
        <ul className="space-y-3 text-left">
          <li className="flex items-start">
            <span className="mr-3 text-primary">1.</span>
            <span>
              <strong>Dashboard</strong>: View your health insights and personalized recommendations
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-primary">2.</span>
            <span>
              <strong>Chat with AI Coach</strong>: Get personalized health advice based on your data
            </span>
          </li>
          <li className="flex items-start">
            <span className="mr-3 text-primary">3.</span>
            <span>
              <strong>Explore Supplements</strong>: Discover supplements tailored to your health needs
            </span>
          </li>
        </ul>
      </div>

      <button
        onClick={handleClick}
        className="btn-primary flex w-full items-center justify-center gap-2 py-3"
        disabled={loading}
      >
        {loading ? (
          <span className="flex items-center justify-center">
            <span className="mr-2 h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
            Finalizing...
          </span>
        ) : (
          <>
            Go to Dashboard <ArrowRight className="h-5 w-5" />
          </>
        )}
      </button>
    </motion.div>
  );
};

export default CompletionStep;