import React, { useState } from 'react';
import type { StepProps } from './types';

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
