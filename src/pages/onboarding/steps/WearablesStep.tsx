import { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle } from 'lucide-react';
import type { StepProps } from './types';

const wearableOptions = ['Apple Health', 'Oura Ring', 'Garmin', 'Fitbit'];

const WearablesStep = ({ onNext, onBack, formState }: StepProps) => {
  const [wearables, setWearables] = useState<string[]>(formState.wearables || []);

  useEffect(() => {
    setWearables(formState.wearables || []);
  }, [formState]);

  const toggle = (id: string) => {
    setWearables((prev) =>
      prev.includes(id) ? prev.filter((w) => w !== id) : [...prev, id]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onNext({ wearables });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="text-xl font-semibold">Connect Wearables</h2>
      <div className="grid gap-3 md:grid-cols-2">
        {wearableOptions.map((w) => {
          const connected = wearables.includes(w);
          return (
            <div
              key={w}
              className={`rounded-lg border p-4 transition hover:shadow-md ${connected ? 'border-primary' : 'border-gray-200'}`}
            >
              <div className="flex items-center justify-between">
                <span>{w}</span>
                <button
                  type="button"
                  onClick={() => toggle(w)}
                  className={`rounded-lg px-3 py-1 text-sm transition ${connected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-light hover:bg-gray-200'}`}
                >
                  {connected ? 'Connected' : 'Connect'}
                </button>
              </div>
              {connected && (
                <div className="mt-2 flex items-center text-xs text-success">
                  <CheckCircle className="mr-1 h-3 w-3" />
                  <span>Successfully connected</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {wearables.length === 0 && (
        <div className="mb-6 flex items-center rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
          <AlertCircle className="mr-2 h-5 w-5" />
          <p>No devices connected. You can skip this step.</p>
        </div>
      )}
      <div className="flex justify-between gap-3">
        <button type="button" onClick={onBack} className="btn-outline w-full">
          Back
        </button>
        <button type="submit" className="btn-primary w-full">
          {wearables.length === 0 ? 'Skip' : 'Continue'}
        </button>
      </div>
    </form>
  );
};

export default WearablesStep;
