import { motion } from 'framer-motion';
import { Check, AlertCircle, Info } from 'lucide-react';

interface Supplement {
  Name: string;
  TierIcon: string;
  Category: string;
  Form: string;
  ShortBenefit: string;
  UseCases: string[];
  TypicalDose: string;
  Mechanism: string;
  SafetyNotes: string;
  References: string[];
}

interface SupplementDetailsProps {
  supplement: Supplement;
}

const SupplementDetails = ({ supplement }: SupplementDetailsProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6"
    >
      <div className="mb-4 flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{supplement.TierIcon}</span>
            <h3 className="text-lg font-semibold">{supplement.Name}</h3>
          </div>
          <p className="mt-1 text-sm text-text-light">{supplement.ShortBenefit}</p>
        </div>
        <span className="rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
          {supplement.Category}
        </span>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Info className="h-4 w-4 text-primary" />
          Key Information
        </div>
        <div className="grid gap-4 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4">
          <div>
            <div className="text-sm font-medium">Form</div>
            <div className="text-text-light">{supplement.Form}</div>
          </div>
          <div>
            <div className="text-sm font-medium">Typical Dosage</div>
            <div className="text-text-light">{supplement.TypicalDose}</div>
          </div>
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium">
          <Check className="h-4 w-4 text-success" />
          Use Cases
        </div>
        <div className="flex flex-wrap gap-2">
          {supplement.UseCases.map((useCase) => (
            <span
              key={useCase}
              className="rounded-full bg-success/10 px-3 py-1 text-sm font-medium text-success"
            >
              {useCase}
            </span>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <div className="mb-2 text-sm font-medium">Mechanism of Action</div>
        <p className="text-sm text-text-light">{supplement.Mechanism}</p>
      </div>

      <div className="mb-4 rounded-lg bg-warning/10 p-4">
        <div className="mb-2 flex items-center gap-2 text-sm font-medium text-warning">
          <AlertCircle className="h-4 w-4" />
          Safety Notes
        </div>
        <p className="text-sm text-warning">{supplement.SafetyNotes}</p>
      </div>

      <div>
        <div className="mb-2 text-sm font-medium">References</div>
        <div className="space-y-1">
          {supplement.References.map((reference, index) => (
            <a
              key={index}
              href={reference}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-sm text-primary hover:text-primary-dark hover:underline"
            >
              {reference}
            </a>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default SupplementDetails;