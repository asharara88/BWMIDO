export interface StepProps {
  onNext: (data?: Record<string, any>) => void;
  onBack: () => void;
  formState: Record<string, any>;
}
