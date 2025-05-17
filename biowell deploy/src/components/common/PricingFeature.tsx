import { motion } from 'framer-motion';
import { Check, X } from 'lucide-react';

interface PricingFeatureProps {
  name: string;
  tiers: {
    core: boolean | string;
    pro: boolean | string;
    enterprise: boolean | string;
  };
  index: number;
}

const PricingFeature = ({ name, tiers, index }: PricingFeatureProps) => {
  return (
    <motion.tr
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.05 }}
      className={`border-b border-[hsl(var(--color-border))] ${
        index % 2 === 0 ? 'bg-[hsl(var(--color-card))]' : 'bg-[hsl(var(--color-card-hover))]'
      }`}
    >
      <td className="py-4 font-medium">{name}</td>
      <td className="py-4 text-center">
        {tiers.core === true ? (
          <Check className="mx-auto h-5 w-5 text-success" />
        ) : tiers.core === false ? (
          <X className="mx-auto h-5 w-5 text-text-light" />
        ) : (
          <span className="text-sm">{tiers.core}</span>
        )}
      </td>
      <td className="py-4 text-center">
        {tiers.pro === true ? (
          <Check className="mx-auto h-5 w-5 text-success" />
        ) : tiers.pro === false ? (
          <X className="mx-auto h-5 w-5 text-text-light" />
        ) : (
          <span className="text-sm">{tiers.pro}</span>
        )}
      </td>
      <td className="py-4 text-center">
        {tiers.enterprise === true ? (
          <Check className="mx-auto h-5 w-5 text-success" />
        ) : tiers.enterprise === false ? (
          <X className="mx-auto h-5 w-5 text-text-light" />
        ) : (
          <span className="text-sm">{tiers.enterprise}</span>
        )}
      </td>
    </motion.tr>
  );
};

export default PricingFeature;