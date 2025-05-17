import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCardProps {
  name: string;
  price: string;
  tag?: string;
  features: string[];
  buttonLabel: string;
  buttonLink: string;
  isPopular?: boolean;
  index?: number;
}

const PricingCard = ({
  name,
  price,
  tag,
  features,
  buttonLabel,
  buttonLink,
  isPopular = false,
  index = 0,
}: PricingCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={`relative overflow-hidden rounded-2xl border ${
        isPopular
          ? 'border-primary bg-primary/5'
          : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]'
      } p-6 shadow-lg transition-shadow hover:shadow-xl`}
    >
      {tag && (
        <div className={`absolute right-0 top-0 ${
          isPopular 
            ? 'bg-primary text-white' 
            : tag === 'Essential'
              ? 'bg-secondary text-white'
              : 'bg-gray-700 text-white'
        } px-4 py-1 text-xs font-medium`}>
          {tag}
        </div>
      )}

      <div className="mb-6">
        <h3 className="text-xl font-bold">{name}</h3>
        <div className="mt-4 flex items-baseline">
          <span className="text-3xl font-bold">{price.split('/')[0]}</span>
          {price.includes('/') && (
            <span className="ml-2 text-text-light">
              /{price.split('/')[1]}
            </span>
          )}
        </div>
      </div>

      <div className="mb-6 space-y-4">
        {features.map((feature) => (
          <div key={feature} className="flex items-start gap-2">
            <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" />
            <span>{feature}</span>
          </div>
        ))}
      </div>

      <Link
        to={buttonLink}
        className={`block w-full rounded-xl px-6 py-3 text-center font-medium transition-colors ${
          isPopular
            ? 'bg-primary text-white hover:bg-primary-dark'
            : 'bg-[hsl(var(--color-card-hover))] hover:bg-[hsl(var(--color-border))]'
        }`}
      >
        {buttonLabel}
      </Link>
    </motion.div>
  );
};

export default PricingCard;