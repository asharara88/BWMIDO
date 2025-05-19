import React from 'react';

interface StepProps {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  formState: Record<string, any>;
}

const WelcomeStep = ({ onNext }: StepProps): JSX.Element => (
  <div className="space-y-4 text-center">
    <h2 className="text-2xl font-bold">Welcome to Biowell</h2>
    <p>Let's personalize your health journey.</p>
    <button className="btn-primary" onClick={() => onNext()}>Get Started</button>
  </div>
);

export default WelcomeStep;
