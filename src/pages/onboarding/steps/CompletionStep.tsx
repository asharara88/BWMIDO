import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepProps } from './types';

const CompletionStep = ({ onNext }: StepProps) => {
  return (
    <div className="text-center">
      <motion.div
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-success/10 text-success"
      >
        <CheckCircle className="h-10 w-10" />
      </motion.div>
      <h2 className="mb-4 text-2xl font-bold">You're All Set!</h2>
      <p className="mb-8 text-text-light">Thanks for completing onboarding.</p>
      <button onClick={() => onNext()} className="btn-primary w-full py-3">
        Go to Dashboard
      </button>
    </div>
  );
};

export default CompletionStep;
