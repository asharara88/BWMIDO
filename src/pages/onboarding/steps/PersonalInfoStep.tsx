import React, { useState } from 'react';
import type { StepProps } from './types';

const PersonalInfoStep = ({ onNext, onBack, formState }: StepProps): JSX.Element => {
  const [firstName, setFirstName] = useState(formState.firstName || '');
  const [lastName, setLastName] = useState(formState.lastName || '');

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Tell us about yourself</h2>
      <div className="space-y-2">
        <input
          className="input w-full"
          placeholder="First name"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
        />
        <input
          className="input w-full"
          placeholder="Last name"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
        />
      </div>
      <div className="flex justify-between">
        <button className="btn-secondary" onClick={onBack}>Back</button>
        <button className="btn-primary" onClick={() => onNext({ firstName, lastName })}>Next</button>
      </div>
    </div>
  );
};

export default PersonalInfoStep;
