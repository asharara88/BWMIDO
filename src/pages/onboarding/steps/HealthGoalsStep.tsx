import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';

interface HealthGoalsStepProps {
  formData: {
    goals: string[];
  };
  updateFormData: (data: Partial<HealthGoalsStepProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const goalOptions = [
  'Improve sleep quality',
  'Increase energy levels',
  'Reduce stress',
  'Optimize metabolic health',
  'Enhance cognitive performance',
  'Build muscle',
  'Lose weight',
  'Improve athletic performance',
  'Support immune function',
  'Balance hormones',
  'Support fertility',
  'Longevity and healthy aging',
];

const HealthGoalsStep = ({ formData, updateFormData, nextStep, prevStep }: HealthGoalsStepProps) => {
  const toggleGoal = (goal: string) => {
    const goals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];
    updateFormData({ goals });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="mb-6 text-xl font-semibold">Health Goals</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid gap-3 md:grid-cols-2">
          {goalOptions.map((goal) => (
            <label
              key={goal}
              className={`flex items-center gap-2 rounded-lg border p-2 text-sm hover:bg-[hsl(var(--color-card-hover))] ${
                formData.goals.includes(goal) ? 'border-primary bg-primary/5 text-primary' : 'border-[hsl(var(--color-border))]'
              }`}
            >
              <input
                type="checkbox"
                value={goal}
                checked={formData.goals.includes(goal)}
                onChange={() => toggleGoal(goal)}
                className="h-4 w-4 rounded border-[hsl(var(--color-border))] text-primary focus:ring-primary"
              />
              {goal}
            </label>
          ))}
        </div>
        {formData.goals.length === 0 && (
          <div className="mb-6 flex items-center rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>Please select at least one goal</p>
          </div>
        )}
        <div className="flex justify-between gap-3">
          <button type="button" onClick={prevStep} className="btn-outline w-full">
            Back
          </button>
          <button type="submit" className="btn-primary w-full">
            Continue
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default HealthGoalsStep;
