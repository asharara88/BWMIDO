import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepProps } from './types';

codex/fix-onboarding-index-and-protectedroute-import-path
const WelcomeStep = ({ onNext }: StepProps): JSX.Element => {

const WelcomeStep = ({ onNext }: StepProps) => {
main
  return (
    <div className="flex flex-col items-center text-center">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Activity className="h-8 w-8" />
      </motion.div>
      <h2 className="mb-4 text-2xl font-bold">Let's personalize your health journey</h2>
      <p className="mb-8 text-text-light">
        We'll ask a few questions to tailor the experience for you.
      </p>
      <button onClick={() => onNext()} className="btn-primary w-full py-3">
        Let's Get Started
      </button>
    </div>
  );
};

export default WelcomeStep;
