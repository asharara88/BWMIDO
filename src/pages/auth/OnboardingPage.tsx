import { useState } from 'react';
import steps from '../onboarding/steps/config';
import type { StepProps } from '../onboarding/steps/types';

const OnboardingPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState<Record<string, any>>({});
  const Step = steps[stepIndex] as React.ComponentType<StepProps>;

  const handleNext = (data?: Record<string, any>) => {
    if (data) {
      setFormState((prev) => ({ ...prev, ...data }));
    }
    setStepIndex((i) => Math.min(i + 1, steps.length - 1));
  };

  const handleBack = () => setStepIndex((i) => Math.max(i - 1, 0));

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background-alt p-4">
      <div className="w-full max-w-md rounded-xl bg-[hsl(var(--color-card))] p-6 shadow-lg">
        <Step onNext={handleNext} onBack={handleBack} formState={formState} />
      </div>
    </div>
  );
};

export default OnboardingPage;
