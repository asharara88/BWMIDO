import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Package, ChevronDown, ChevronUp, Plus, Check, AlertCircle, Info } from 'lucide-react';

interface SupplementStack {
  id: string;
  name: string;
  description: string;
  supplements: Supplement[];
  totalPrice: number;
  isActive: boolean;
}

interface Supplement {
  id: string;
  name: string;
  dosage: string;
  timing: string;
  benefits: string[];
  price: number;
}

interface SupplementStackOverviewProps {
  stacks: SupplementStack[];
  onActivateStack: (stackId: string) => void;
  onAddSupplement: (supplementId: string) => void;
}

const SupplementStackOverview = ({
  stacks,
  onActivateStack,
  onAddSupplement,
}: SupplementStackOverviewProps) => {
  const [expandedStack, setExpandedStack] = useState<string | null>(null);
  const [showAllStacks, setShowAllStacks] = useState(false);

  // Show only first 2 stacks on mobile by default
  const visibleStacks = showAllStacks ? stacks : stacks.slice(0, 2);

  return (
    <div className="space-y-4">
      {/* Header with mobile toggle */}
      <div className="flex items-center justify-between">
        <h2 className="text-base font-bold sm:text-lg">Recommended Stacks</h2>
        <button
          onClick={() => setShowAllStacks(!showAllStacks)}
          className="flex items-center gap-1 rounded-lg bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary sm:hidden"
        >
          {showAllStacks ? 'Show Less' : `Show All (${stacks.length})`}
          {showAllStacks ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
        </button>
      </div>

      {/* Stacks Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {visibleStacks.map((stack) => (
          <motion.div
            key={stack.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]"
          >
            {/* Stack Header */}
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-medium sm:text-base">{stack.name}</h3>
                  <p className="text-xs text-text-light">{stack.description}</p>
                </div>
                {stack.isActive && (
                  <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
                    Active
                  </span>
                )}
              </div>

              {/* Price and Supplements Count */}
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-text-light">
                  {stack.supplements.length} supplements
                </span>
                <span className="font-medium">
                  AED {stack.totalPrice.toFixed(2)}
                </span>
              </div>

              {/* Primary Action Button */}
              <button
                onClick={() => onActivateStack(stack.id)}
                className={`mb-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  stack.isActive
                    ? 'bg-success/10 text-success'
                    : 'bg-primary text-white hover:bg-primary-dark'
                }`}
              >
                {stack.isActive ? (
                  <>
                    <Check className="h-4 w-4" />
                    Active Stack
                  </>
                ) : (
                  <>
                    <Package className="h-4 w-4" />
                    Activate Stack
                  </>
                )}
              </button>

              {/* Expand/Collapse Toggle */}
              <button
                onClick={() => setExpandedStack(expandedStack === stack.id ? null : stack.id)}
                className="flex w-full items-center justify-center gap-1 rounded-lg border border-[hsl(var(--color-border))] px-3 py-2 text-xs text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text"
              >
                {expandedStack === stack.id ? (
                  <>
                    Show Less <ChevronUp className="h-3 w-3" />
                  </>
                ) : (
                  <>
                    View Details <ChevronDown className="h-3 w-3" />
                  </>
                )}
              </button>
            </div>

            {/* Expanded Content */}
            <AnimatePresence>
              {expandedStack === stack.id && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3 }}
                  className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))]"
                >
                  <div className="p-4">
                    {stack.supplements.map((supplement) => (
                      <div
                        key={supplement.id}
                        className="mb-3 last:mb-0"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="text-sm font-medium">{supplement.name}</h4>
                            <p className="text-xs text-text-light">{supplement.dosage}</p>
                          </div>
                          <button
                            onClick={() => onAddSupplement(supplement.id)}
                            className="flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
                          >
                            <Plus className="h-3 w-3" />
                            Add
                          </button>
                        </div>

                        {/* Benefits Tags */}
                        <div className="mt-2 flex flex-wrap gap-1">
                          {supplement.benefits.map((benefit) => (
                            <span
                              key={benefit}
                              className="rounded-full bg-[hsl(var(--color-surface-2))] px-2 py-0.5 text-xs"
                            >
                              {benefit}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* Show More Button (Mobile) */}
      {!showAllStacks && stacks.length > 2 && (
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex w-full items-center justify-center gap-2 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4 text-sm text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text sm:hidden"
          onClick={() => setShowAllStacks(true)}
        >
          <Plus className="h-4 w-4" />
          Show {stacks.length - 2} More Stacks
        </motion.button>
      )}

      {/* Info Card */}
      <div className="flex items-start gap-3 rounded-lg bg-primary/5 p-4 text-xs text-text-light sm:text-sm">
        <Info className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
        <p>
          Stacks are curated combinations of supplements designed to work together
          for specific health goals. Activate a stack to automatically add all
          supplements to your routine.
        </p>
      </div>
    </div>
  );
};

export default SupplementStackOverview;