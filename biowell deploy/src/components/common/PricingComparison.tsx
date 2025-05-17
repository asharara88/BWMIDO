import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface Feature {
  name: string;
  core: boolean | string;
  pro: boolean | string;
  enterprise: boolean | string;
}

interface PricingComparisonProps {
  features: Feature[];
}

const PricingComparison = ({ features }: PricingComparisonProps) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="border-b border-[hsl(var(--color-border))]">
            <th className="py-4 text-left font-medium text-text-light">Features</th>
            <th className="py-4 text-center font-medium text-text-light">Core</th>
            <th className="py-4 text-center font-medium text-text-light">Pro</th>
            <th className="py-4 text-center font-medium text-text-light">Enterprise</th>
          </tr>
        </thead>
        <tbody>
          {features.map((feature, index) => (
            <motion.tr
              key={feature.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className={`border-b border-[hsl(var(--color-border))] ${
                index % 2 === 0 ? 'bg-[hsl(var(--color-card))]' : 'bg-[hsl(var(--color-card-hover))]'
              }`}
            >
              <td className="py-4 font-medium">{feature.name}</td>
              <td className="py-4 text-center">
                {feature.core === true ? (
                  <Check className="mx-auto h-5 w-5 text-success" />
                ) : feature.core === false ? (
                  <X className="mx-auto h-5 w-5 text-text-light" />
                ) : (
                  <span className="text-sm">{feature.core}</span>
                )}
              </td>
              <td className="py-4 text-center">
                {feature.pro === true ? (
                  <Check className="mx-auto h-5 w-5 text-success" />
                ) : feature.pro === false ? (
                  <X className="mx-auto h-5 w-5 text-text-light" />
                ) : (
                  <span className="text-sm">{feature.pro}</span>
                )}
              </td>
              <td className="py-4 text-center">
                {feature.enterprise === true ? (
                  <Check className="mx-auto h-5 w-5 text-success" />
                ) : feature.enterprise === false ? (
                  <X className="mx-auto h-5 w-5 text-text-light" />
                ) : (
                  <span className="text-sm">{feature.enterprise}</span>
                )}
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PricingComparison;