import { useState, useEffect } from 'react';
import type { StepProps } from './types';

const options = ['Rarely', '1-2x/week', '3-4x/week', '5+ times/week'];

const LifestyleStep = ({ onNext, onBack, formState }: StepProps) => {
  const [exercise, setExercise] = useState(formState.exerciseFrequency || '');

  useEffect(() => {
    setExercise(formState.exerciseFrequency || '');
  }, [formState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ exerciseFrequency: exercise });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Exercise Frequency</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {options.map((o) => (
          <label
            key={o}
            className={`flex cursor-pointer items-center rounded-lg border p-3 transition ${exercise === o ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 hover:border-gray-400'}`}
          >
            <input
              type="radio"
              value={o}
              checked={exercise === o}
              onChange={() => setExercise(o)}
              className="sr-only"
            />
            <span>{o}</span>
          </label>
        ))}
      </div>
      <div className="flex justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-outline w-full">
          Back
        </button>
        <button type="submit" className="btn-primary w-full" disabled={!exercise}>
          Continue
        </button>
      </div>
    </form>
  );
};

export default LifestyleStep;
