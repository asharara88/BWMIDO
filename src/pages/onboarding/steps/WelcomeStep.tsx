codex/introduce-modular-onboarding-steps
import { motion } from 'framer-motion';
import { Activity, Users, LineChart, MessageCircle } from 'lucide-react';

interface WelcomeStepProps {
  nextStep: () => void;
}

const WelcomeStep = ({ nextStep }: WelcomeStepProps) => {
  return (
    <div className="flex flex-col items-center">

import { Activity } from 'lucide-react';
import { motion } from 'framer-motion';
import type { StepProps } from './types';

const WelcomeStep = ({ onNext }: StepProps) => {
  return (
    <div className="flex flex-col items-center text-center">
main
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 text-primary"
      >
        <Activity className="h-8 w-8" />
      </motion.div>
codex/introduce-modular-onboarding-steps
      
      <h2 className="mb-6 text-center text-2xl font-bold">Let's personalize your health journey</h2>
      
      <p className="mb-8 text-center text-text-light">
        We'll ask a few questions to understand your health profile and goals.
        This helps us provide personalized insights and recommendations.
      </p>
      
      <div className="mb-8 grid gap-4 md:grid-cols-3">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm"
        >
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Users className="h-5 w-5" />
          </div>
          <h3 className="mb-1 font-medium">Personal Profile</h3>
          <p className="text-sm text-text-light">Basic information to tailor recommendations</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm"
        >
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-secondary/10 text-secondary">
            <LineChart className="h-5 w-5" />
          </div>
          <h3 className="mb-1 font-medium">Health Goals</h3>
          <p className="text-sm text-text-light">Define what you want to achieve</p>
        </motion.div>
        
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="rounded-lg border border-gray-200 bg-white p-4 text-center shadow-sm"
        >
          <div className="mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
            <MessageCircle className="h-5 w-5" />
          </div>
          <h3 className="mb-1 font-medium">AI Coach Setup</h3>
          <p className="text-sm text-text-light">Prepare for personalized advice</p>
        </motion.div>
      </div>
      
      <button onClick={nextStep} className="btn-primary w-full py-3">
        Let's Get Started
      </button>
      
      <p className="mt-4 text-center text-xs text-text-light">
        Your information is private and secure. We only use it to provide personalized recommendations.
      </p>

      <h2 className="mb-4 text-2xl font-bold">Let's personalize your health journey</h2>
      <p className="mb-8 text-text-light">
        We'll ask a few questions to tailor the experience for you.
      </p>
      <button onClick={() => onNext()} className="btn-primary w-full py-3">
        Let's Get Started
      </button>
main
    </div>
  );
};

export default WelcomeStep;
