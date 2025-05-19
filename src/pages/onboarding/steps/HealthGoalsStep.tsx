import React, { useState } from 'react';

interface StepProps {
  onNext: (data: Record<string, any>) => void;
  onBack: () => void;
  formState: Record<string, any>;
}

const options = [
  'Improve sleep',
  'Increase energy',
  'Reduce stress',
  'Other'
];

const HealthGoalsStep = ({ onNext, onBack, formState }: StepProps): JSX.Element => {
  const [selected, setSelected] = useState(formState.healthGoal || '');
  const [other, setOther] = useState(formState.healthGoalOther || '');
  const showOther = selected === 'Other';

  const handleNext = () => {
    const value = showOther ? other : selected;
    onNext({ healthGoal: value });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">What is your primary health goal?</h2>
      <div className="flex flex-wrap gap-2">
        {options.map((opt) => (
          <button
            key={opt}
            className={`btn-secondary ${selected === opt ? 'bg-primary text-white' : ''}`}
            onClick={() => setSelected(opt)}
          >
            {opt}
          </button>
        ))}
      </div>
      {showOther && (
        <input
          className="input w-full"
          placeholder="Your goal"
          value={other}
          onChange={(e) => setOther(e.target.value)}
        />
      )}
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={handleNext} disabled={!selected || (showOther && !other)}>Next</button>
      </div>
    </div>
  );
};

export default HealthGoalsStep;
