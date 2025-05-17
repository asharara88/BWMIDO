import { motion } from 'framer-motion';

interface LifestyleStepProps {
  formData: {
    sleepHours: string;
    exerciseFrequency: string;
    dietPreference: string;
    stressLevel: string;
    existingConditions: string[];
    medications: string[];
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const conditionOptions = [
  'None',
  'Hypertension',
  'Diabetes',
  'Heart disease',
  'Thyroid issues',
  'Autoimmune condition',
  'Digestive issues',
  'Sleep apnea',
  'Anxiety/Depression',
  'Other',
];

const LifestyleStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: LifestyleStepProps) => {
  const handleConditionToggle = (condition: string) => {
    let updatedConditions;
    
    // Handle "None" special case
    if (condition === 'None') {
      updatedConditions = formData.existingConditions.includes('None')
        ? []
        : ['None'];
    } else {
      // Remove "None" if it exists and add the new condition
      updatedConditions = formData.existingConditions
        .filter((c) => c !== 'None')
        .includes(condition)
        ? formData.existingConditions.filter((c) => c !== condition)
        : [...formData.existingConditions.filter((c) => c !== 'None'), condition];
    }
    
    updateFormData({ existingConditions: updatedConditions });
  };

  const handleMedicationsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const medsArray = e.target.value
      .split(',')
      .map((med) => med.trim())
      .filter((med) => med !== '');
    
    updateFormData({ medications: medsArray });
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
      <h2 className="mb-6 text-xl font-semibold">Lifestyle & Health</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6">
          <label htmlFor="sleepHours" className="label">
            Average Sleep (hours per night)
          </label>
          <input
            id="sleepHours"
            type="number"
            min="3"
            max="14"
            step="0.5"
            className="input"
            value={formData.sleepHours}
            onChange={(e) => updateFormData({ sleepHours: e.target.value })}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="label">Exercise Frequency</label>
          <div className="grid gap-3 md:grid-cols-4">
            {[
              'Rarely',
              '1-2 times/week',
              '3-4 times/week',
              '5+ times/week',
            ].map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 text-center transition
                  ${
                    formData.exerciseFrequency === option
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  type="radio"
                  name="exerciseFrequency"
                  value={option}
                  checked={formData.exerciseFrequency === option}
                  onChange={() => updateFormData({ exerciseFrequency: option })}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="label">Diet Preference</label>
          <div className="grid gap-3 md:grid-cols-3">
            {[
              'Omnivore',
              'Vegetarian',
              'Vegan',
              'Keto',
              'Paleo',
              'Mediterranean',
            ].map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                  ${
                    formData.dietPreference === option
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  type="radio"
                  name="dietPreference"
                  value={option}
                  checked={formData.dietPreference === option}
                  onChange={() => updateFormData({ dietPreference: option })}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="label">Stress Level</label>
          <div className="grid gap-3 md:grid-cols-4">
            {['Low', 'Moderate', 'High', 'Very High'].map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                  ${
                    formData.stressLevel === option
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  type="radio"
                  name="stressLevel"
                  value={option}
                  checked={formData.stressLevel === option}
                  onChange={() => updateFormData({ stressLevel: option })}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <label className="label">Existing Health Conditions</label>
          <div className="grid gap-2 md:grid-cols-2">
            {conditionOptions.map((condition) => {
              const isSelected = formData.existingConditions.includes(condition);
              
              return (
                <label
                  key={condition}
                  className={`flex cursor-pointer items-center rounded-lg border p-3 transition
                    ${
                      isSelected
                        ? 'border-primary bg-primary/5 text-primary'
                        : 'border-gray-300 hover:border-gray-400'
                    }`}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => handleConditionToggle(condition)}
                    className="sr-only"
                  />
                  <span className={isSelected ? 'font-medium' : ''}>
                    {condition}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="medications" className="label">
            Current Medications & Supplements
          </label>
          <textarea
            id="medications"
            className="input h-24 resize-none"
            placeholder="Enter each medication or supplement, separated by commas"
            value={formData.medications.join(', ')}
            onChange={handleMedicationsChange}
          ></textarea>
        </div>
        
        <button type="submit" className="btn-primary w-full py-3">
          Continue
        </button>
      </form>
    </motion.div>
  );
};

export default LifestyleStep;