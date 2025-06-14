import React from 'react';
import type { StepProps } from './types';

const CompletionStep = ({ onBack }: StepProps): JSX.Element => (
  <div className="space-y-4 text-center">
    <h2 className="text-xl font-bold">You're all set!</h2>
    <p className="text-text-light">Your preferences have been saved.</p>
    <button className="btn-primary" onClick={onBack}>Go to dashboard</button>
  </div>
);

export default CompletionStep;
