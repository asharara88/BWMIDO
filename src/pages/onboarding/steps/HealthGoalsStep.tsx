import { useState, useEffect } from 'react';
import { Check } from 'lucide-react';
import type { StepProps } from './types';

const goalOptions = [
  'Improve sleep',
  'Increase energy',
  'Lose weight',
  'Build muscle',
];

const HealthGoalsStep = ({ onNext, onBack, formState }: StepProps) => {
  const [goals, setGoals] = useState<string[]>(formState.healthGoals || []);

  useEffect(() => {
    setGoals(formState.healthGoals || []);
  }, [formState]);

  const toggleGoal = (goal: string) => {
    setGoals((prev) =>
      prev.includes(goal) ? prev.filter((g) => g !== goal) : [...prev, goal]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ healthGoals: goals });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Health Goals</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {goalOptions.map((goal) => {
          const selected = goals.includes(goal);
          return (
            <label
              key={goal}
              className={`flex cursor-pointer items-center rounded-lg border p-3 transition ${selected ? 'border-primary bg-primary/5 text-primary' : 'border-gray-300 hover:border-gray-400'}`}
            >
              <input
                type="checkbox"
                checked={selected}
                onChange={() => toggleGoal(goal)}
                className="sr-only"
              />
              <span className={selected ? 'font-medium' : ''}>{goal}</span>
              {selected && (
                <Check className="ml-auto h-4 w-4 text-primary" />
              )}
            </label>
          );
        })}
      </div>
      <div className="flex justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-outline w-full">
          Back
        </button>
        <button type="submit" className="btn-primary w-full" disabled={goals.length === 0}>
          Continue
        </button>
      </div>
    </form>
  );
};

export default HealthGoalsStep;
