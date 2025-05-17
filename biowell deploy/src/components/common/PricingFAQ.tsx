import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';

interface FAQ {
  question: string;
  answer: string;
}

interface PricingFAQProps {
  faqs: FAQ[];
}

const PricingFAQ = ({ faqs }: PricingFAQProps) => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);

  const toggleExpand = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="space-y-4">
      {faqs.map((faq, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 * index }}
          className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]"
        >
          <button
            onClick={() => toggleExpand(index)}
            className="flex w-full items-center justify-between p-6 text-left"
          >
            <div className="flex items-center gap-3">
              <HelpCircle className="h-5 w-5 text-primary" />
              <span className="font-medium">{faq.question}</span>
            </div>
            {expandedIndex === index ? (
              <ChevronUp className="h-5 w-5 text-text-light" />
            ) : (
              <ChevronDown className="h-5 w-5 text-text-light" />
            )}
          </button>
          
          <AnimatePresence>
            {expandedIndex === index && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-6"
              >
                <p className="text-text-light">{faq.answer}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  );
};

export default PricingFAQ;