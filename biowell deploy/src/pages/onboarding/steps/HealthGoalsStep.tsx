import { motion } from 'framer-motion';
import { Check } from 'lucide-react';

interface HealthGoalsStepProps {
  formData: {
    goals: string[];
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const goalOptions = [
  'Improve sleep',
  'Increase energy',
  'Lose weight',
  'Build muscle',
  'Reduce stress',
  'Improve focus',
  'Better digestion',
  'Balance hormones',
  'Enhance immunity',
  'Manage chronic condition',
  'Optimize athletic performance',
  'Longevity & healthy aging',
];

const HealthGoalsStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: HealthGoalsStepProps) => {
  const handleGoalToggle = (goal: string) => {
    const updatedGoals = formData.goals.includes(goal)
      ? formData.goals.filter((g) => g !== goal)
      : [...formData.goals, goal];
    
    updateFormData({ goals: updatedGoals });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-xl font-semibold">Health Goals</h2>
      <p className="mb-6 text-text-light">
        Select your main health objectives (up to 5). This helps us personalize your recommendations.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8 grid gap-3 md:grid-cols-3">
          {goalOptions.map((goal) => {
            const isSelected = formData.goals.includes(goal);
            
            return (
              <label
                key={goal}
                className={`relative flex cursor-pointer items-center rounded-lg border p-3 transition
                  ${
                    isSelected
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => handleGoalToggle(goal)}
                  className="sr-only"
                  disabled={!isSelected && formData.goals.length >= 5}
                />
                <span className={isSelected ? 'font-medium' : ''}>
                  {goal}
                </span>
                {isSelected && (
                  <div className="absolute right-2 top-2 text-primary">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </label>
            );
          })}
        </div>
        
        <div className="mb-4 text-sm text-text-light">
          {formData.goals.length === 0 ? (
            <span>Please select at least one goal</span>
          ) : (
            <span>
              {formData.goals.length}/5 goals selected
            </span>
          )}
        </div>
        
        <button
          type="submit"
          className="btn-primary w-full py-3"
          disabled={formData.goals.length === 0}
        >
          Continue
        </button>
      </form>
    </motion.div>
  );
};

export default HealthGoalsStep;