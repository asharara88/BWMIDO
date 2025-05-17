import { motion, AnimatePresence } from 'framer-motion';
import { ShoppingCart, X, Download, Share2 } from 'lucide-react';

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

interface SupplementStackProps {
  stack: Supplement[];
  onRemove: (supplement: Supplement) => void;
  onClear: () => void;
}

const SupplementStack = ({ stack, onRemove, onClear }: SupplementStackProps) => {
  if (stack.length === 0) {
    return (
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6">
        <div className="text-center">
          <ShoppingCart className="mx-auto mb-3 h-8 w-8 text-text-light" />
          <h3 className="mb-1 font-medium">Your Stack is Empty</h3>
          <p className="text-sm text-text-light">
            Add supplements to create your personalized stack
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-medium">Your Stack</h3>
          <p className="text-sm text-text-light">{stack.length} supplements</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {/* Implement share functionality */}}
            className="rounded-lg p-2 text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text"
            title="Share Stack"
          >
            <Share2 className="h-5 w-5" />
          </button>
          <button
            onClick={() => {/* Implement download functionality */}}
            className="rounded-lg p-2 text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text"
            title="Download Stack"
          >
            <Download className="h-5 w-5" />
          </button>
          <button
            onClick={onClear}
            className="rounded-lg p-2 text-text-light transition-colors hover:bg-error/10 hover:text-error"
            title="Clear Stack"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
      </div>

      <AnimatePresence>
        <div className="space-y-2">
          {stack.map((supplement) => (
            <motion.div
              key={supplement.Name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center justify-between rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-3"
            >
              <div className="flex items-center gap-2">
                <span>{supplement.TierIcon}</span>
                <span className="font-medium">{supplement.Name}</span>
              </div>
              <button
                onClick={() => onRemove(supplement)}
                className="rounded p-1 text-text-light transition-colors hover:bg-error/10 hover:text-error"
              >
                <X className="h-4 w-4" />
              </button>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <div className="mt-4 flex flex-col gap-2">
        <button className="btn-primary w-full">
          Save Stack
        </button>
        <button className="btn-outline w-full">
          Share Stack
        </button>
      </div>
    </div>
  );
};

export default SupplementStack;