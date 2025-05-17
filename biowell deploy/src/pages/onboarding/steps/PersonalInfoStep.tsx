import { motion } from 'framer-motion';

interface PersonalInfoStepProps {
  formData: {
    firstName: string;
    lastName: string;
    age: string;
    gender: string;
    height: string;
    weight: string;
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const PersonalInfoStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: PersonalInfoStepProps) => {
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
      <h2 className="mb-6 text-xl font-semibold">Personal Information</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="label">
              First Name
            </label>
            <input
              id="firstName"
              type="text"
              className="input"
              value={formData.firstName}
              onChange={(e) => updateFormData({ firstName: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="label">
              Last Name
            </label>
            <input
              id="lastName"
              type="text"
              className="input"
              value={formData.lastName}
              onChange={(e) => updateFormData({ lastName: e.target.value })}
              required
            />
          </div>
        </div>
        
        <div className="mb-6">
          <label htmlFor="age" className="label">
            Age
          </label>
          <input
            id="age"
            type="number"
            min="18"
            max="120"
            className="input"
            value={formData.age}
            onChange={(e) => updateFormData({ age: e.target.value })}
            required
          />
        </div>
        
        <div className="mb-6">
          <label className="label">Gender</label>
          <div className="grid gap-3 md:grid-cols-3">
            {['Male', 'Female', 'Non-binary'].map((option) => (
              <label
                key={option}
                className={`flex cursor-pointer items-center justify-center rounded-lg border p-3 transition
                  ${
                    formData.gender === option
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
              >
                <input
                  type="radio"
                  name="gender"
                  value={option}
                  checked={formData.gender === option}
                  onChange={() => updateFormData({ gender: option })}
                  className="sr-only"
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        </div>
        
        <div className="mb-6 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="height" className="label">
              Height (cm)
            </label>
            <input
              id="height"
              type="number"
              min="100"
              max="250"
              className="input"
              value={formData.height}
              onChange={(e) => updateFormData({ height: e.target.value })}
              required
            />
          </div>
          
          <div>
            <label htmlFor="weight" className="label">
              Weight (kg)
            </label>
            <input
              id="weight"
              type="number"
              min="30"
              max="300"
              className="input"
              value={formData.weight}
              onChange={(e) => updateFormData({ weight: e.target.value })}
              required
            />
          </div>
        </div>
        
        <button type="submit" className="btn-primary w-full py-3">
          Continue
        </button>
      </form>
    </motion.div>
  );
};

export default PersonalInfoStep;