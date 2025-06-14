import React from 'react';
import type { StepProps } from './types';

const WearablesStep = ({ onNext, onBack }: StepProps): JSX.Element => (
  <div className="space-y-4 text-center">
    <h2 className="text-xl font-bold">Connect your wearables</h2>
    <p className="text-text-light">You can connect devices later in settings.</p>
    <div className="flex justify-between">
      <button className="btn-secondary" onClick={onBack}>Back</button>
      <button className="btn-primary" onClick={() => onNext()}>Continue</button>
    </div>
  </div>
);

export default WearablesStep;
