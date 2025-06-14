codex/introduce-modular-onboarding-steps
import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WearablesStepProps {
  formData: {
    wearables: string[];
  };
  updateFormData: (data: Partial<typeof formData>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const wearableOptions = [
  {
    id: 'apple-health',
    name: 'Apple Health',
    icon: '🍎',
    connected: false,
  },
  {
    id: 'oura',
    name: 'Oura Ring',
    icon: '💍',
    connected: false,
  },
  {
    id: 'garmin',
    name: 'Garmin',
    icon: '⌚',
    connected: false,
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    icon: '📊',
    connected: false,
  },
  {
    id: 'whoop',
    name: 'Whoop',
    icon: '🔄',
    connected: false,
  },
  {
    id: 'withings',
    name: 'Withings',
    icon: '⚖️',
    connected: false,
  },
];

const WearablesStep = ({
  formData,
  updateFormData,
  nextStep,
  prevStep,
}: WearablesStepProps) => {
  const handleConnectWearable = (wearableId: string) => {
    // In a real app, this would open the OAuth flow for the specific wearable
    // For now, we'll just mark it as selected
    const updatedWearables = formData.wearables.includes(wearableId)
      ? formData.wearables.filter((w) => w !== wearableId)
      : [...formData.wearables, wearableId];
    
    updateFormData({ wearables: updatedWearables });
=======
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
 main
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
codex/introduce-modular-onboarding-steps
    nextStep();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <h2 className="mb-6 text-xl font-semibold">Connect Health Devices</h2>
      <p className="mb-6 text-text-light">
        Connect your wearables and health apps to get the most out of Biowell.
        This is optional, but provides better personalized insights.
      </p>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-8 grid gap-4 md:grid-cols-2">
          {wearableOptions.map((wearable) => {
            const isConnected = formData.wearables.includes(wearable.id);
            
            return (
              <div
                key={wearable.id}
                className={`rounded-lg border p-4 transition hover:shadow-md ${
                  isConnected ? 'border-primary' : 'border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="mr-3 text-2xl">{wearable.icon}</span>
                    <span className="font-medium">{wearable.name}</span>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => handleConnectWearable(wearable.id)}
                    className={`rounded-lg px-3 py-1 text-sm transition ${
                      isConnected
                        ? 'bg-primary/10 text-primary'
                        : 'bg-gray-100 text-text-light hover:bg-gray-200'
                    }`}
                  >
                    {isConnected ? 'Connected' : 'Connect'}
                  </button>
                </div>
                
                {isConnected && (
                  <div className="mt-2 flex items-center text-xs text-success">
                    <CheckCircle className="mr-1 h-3 w-3" />
                    <span>Successfully connected</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        
        {formData.wearables.length === 0 && (
          <div className="mb-6 flex items-center rounded-lg bg-amber-50 p-3 text-sm text-amber-800">
            <AlertCircle className="mr-2 h-5 w-5" />
            <p>
              You haven't connected any devices. You can still use Biowell,
              but connecting devices provides better personalized recommendations.
            </p>
          </div>
        )}
        
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
          <button
            type="button"
            className="btn-outline"
            onClick={() => {
              if (formData.wearables.length === 0) {
                const confirmed = window.confirm(
                  "You haven't connected any devices. Are you sure you want to skip this step?"
                );
                if (confirmed) {
                  nextStep();
                }
              } else {
                nextStep();
              }
            }}
          >
            {formData.wearables.length === 0 ? "Skip for now" : "Continue"}
          </button>
          
          {formData.wearables.length > 0 && (
            <button type="submit" className="btn-primary">
              Continue with {formData.wearables.length} Device{formData.wearables.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </form>
    </motion.div>

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
 main
  );
};

export default WearablesStep;
