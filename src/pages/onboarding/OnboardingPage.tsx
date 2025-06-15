import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import steps from './steps/config';

interface FormState {
  [key: string]: any;
}

const OnboardingPage = (): JSX.Element => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formState, setFormState] = useState<FormState>({});
  const navigate = useNavigate();

  const Step = steps[stepIndex];

  const handleNext = (data: FormState = {}) => {
    setFormState((prev) => ({ ...prev, ...data }));
    setStepIndex((i) => i + 1);
  };

  const handleBack = () => {
    if (stepIndex === 0) {
      navigate(-1);
    } else {
      setStepIndex((i) => i - 1);
    }
  };

  return <Step onNext={handleNext} onBack={handleBack} formState={formState} />;
};

export default OnboardingPage;
