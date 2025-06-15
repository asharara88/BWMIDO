import { useState, useEffect } from 'react';
import type { StepProps } from './types';

const PersonalInfoStep = ({ onNext, onBack, formState }: StepProps) => {
  const [firstName, setFirstName] = useState(formState.firstName || '');
  const [lastName, setLastName] = useState(formState.lastName || '');

  useEffect(() => {
    setFirstName(formState.firstName || '');
    setLastName(formState.lastName || '');
  }, [formState]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ firstName, lastName });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="firstName" className="label">First Name</label>
        <input
          id="firstName"
          className="input"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
      </div>
      <div>
        <label htmlFor="lastName" className="label">Last Name</label>
        <input
          id="lastName"
          className="input"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>
      <div className="flex justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-outline w-full">
          Back
        </button>
        <button type="submit" className="btn-primary w-full">
          Continue
        </button>
      </div>
    </form>
  );
};

export default PersonalInfoStep;