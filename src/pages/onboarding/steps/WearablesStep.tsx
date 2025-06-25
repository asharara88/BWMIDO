import { motion } from 'framer-motion';
import { CheckCircle, AlertCircle } from 'lucide-react';

interface WearablesStepProps {
  formData: {
    wearables: string[];
  };
  updateFormData: (data: Partial<WearablesStepProps['formData']>) => void;
  nextStep: () => void;
  prevStep: () => void;
}

const wearableOptions = [
  { id: 'apple-health', name: 'Apple Health', icon: '🍎' },
  { id: 'oura', name: 'Oura Ring', icon: '💍' },
  { id: 'garmin', name: 'Garmin', icon: '⌚' },
  { id: 'fitbit', name: 'Fitbit', icon: '📊' },
  { id: 'whoop', name: 'Whoop', icon: '🔄' },
  { id: 'withings', name: 'Withings', icon: '⚖️' },
];

const WearablesStep = ({ formData, updateFormData, nextStep, prevStep }: WearablesStepProps) => {
  const handleConnectWearable = (wearableId: string) => {
    const updatedWearables = formData.wearables.includes(wearableId)
      ? formData.wearables.filter((w) => w !== wearableId)
      : [...formData.wearables, wearableId];

    updateFormData({ wearables: updatedWearables });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    nextStep();
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <h2 className="mb-6 text-xl font-semibold">Connect Health Devices</h2>
      <p className="mb-6 text-text-light">
        Connect your wearables and health apps to get the most out of Biowell. This is optional, but provides better personalized
        insights.
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
                      isConnected ? 'bg-primary/10 text-primary' : 'bg-gray-100 text-text-light hover:bg-gray-200'
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
              You haven't connected any devices. You can still use Biowell, but connecting devices provides better personalized
              recommendations.
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
            {formData.wearables.length === 0 ? 'Skip for now' : 'Continue'}
          </button>

          {formData.wearables.length > 0 && (
            <button type="submit" className="btn-primary">
              Continue with {formData.wearables.length} Device{formData.wearables.length > 1 ? 's' : ''}
            </button>
          )}
        </div>
      </form>
    </motion.div>
  );
};

export default WearablesStep;
