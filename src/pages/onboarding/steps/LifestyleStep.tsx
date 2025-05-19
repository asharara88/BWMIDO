import React, { useState } from 'react';

interface StepProps {
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  formState: Record<string, any>;
}

const LifestyleStep = ({ onNext, onBack, formState }: StepProps): JSX.Element => {
  const [active, setActive] = useState(formState.lifestyle || 'sedentary');

  const options = ['sedentary', 'moderate', 'active'];

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">How active are you?</h2>
      <div className="flex gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`btn-secondary ${active === opt ? 'bg-primary text-white' : ''}`}
            onClick={() => setActive(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={() => onNext({ lifestyle: active })}>Next</button>
      </div>
    </div>
  );
};

export default LifestyleStep;
