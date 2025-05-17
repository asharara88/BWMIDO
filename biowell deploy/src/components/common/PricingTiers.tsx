import { useState } from 'react';
import { motion } from 'framer-motion';
import { Check, Shield, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingTier {
  name: string;
  price: string;
  tag?: string;
  features: string[];
  button: {
    label: string;
    link: string;
  };
}

interface PricingTiersProps {
  tiers?: PricingTier[];
  showToggle?: boolean;
  className?: string;
}

const defaultTiers: PricingTier[] = [
  {
    name: "Core",
    price: "199 AED/month",
    tag: "Essential",
    features: [
      "Personalized insights",
      "Wearable integration",
      "Smart health dashboard",
      "Basic supplement guidance"
    ],
    button: {
      label: "Get Started",
      link: "/signup/core"
    }
  },
  {
    name: "Pro",
    price: "349 AED/month",
    tag: "Most Popular",
    features: [
      "Everything in Core",
      "Advanced metabolic insights",
      "Dynamic supplement protocol",
      "Priority support",
      "Premium supplement stack"
    ],
    button: {
      label: "Upgrade to Pro",
      link: "/signup/pro"
    }
  },
  {
    name: "Enterprise",
    price: "Custom pricing",
    tag: "For Teams",
    features: [
      "Tailored API integrations",
      "White-labeled AI coach",
      "Team analytics & reporting",
      "Dedicated account manager",
      "Advanced compliance options"
    ],
    button: {
      label: "Contact Sales",
      link: "/contact-sales"
    }
  }
];

const PricingTiers = ({ tiers = defaultTiers, showToggle = true, className = '' }: PricingTiersProps) => {
  const [isAnnual, setIsAnnual] = useState(true);

  return (
    <div className={`w-full ${className}`}>
      {showToggle && (
        <div className="mb-8 flex items-center justify-center gap-4">
          <span className={`text-sm ${!isAnnual ? 'text-text' : 'text-text-light'}`}>
            Monthly
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className={`relative h-6 w-12 rounded-full transition-colors ${
              isAnnual ? 'bg-primary' : 'bg-gray-300'
            }`}
            aria-label={isAnnual ? 'Switch to monthly billing' : 'Switch to annual billing'}
          >
            <span
              className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform ${
                isAnnual ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
          <div className="flex items-center gap-2">
            <span className={`text-sm ${isAnnual ? 'text-text' : 'text-text-light'}`}>
              Annual
            </span>
            <span className="rounded-full bg-success/10 px-2 py-1 text-xs font-medium text-success">
              Save 20%
            </span>
          </div>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-3">
        {tiers.map((tier, index) => (
          <motion.div
            key={tier.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-2xl border ${
              tier.tag === 'Most Popular'
                ? 'border-primary bg-primary/5'
                : 'border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]'
            } p-6 shadow-lg transition-shadow hover:shadow-xl`}
          >
            {tier.tag && (
              <div className={`absolute right-0 top-0 ${
                tier.tag === 'Most Popular' 
                  ? 'bg-primary text-white' 
                  : tier.tag === 'Essential'
                    ? 'bg-secondary text-white'
                    : 'bg-gray-700 text-white'
              } px-4 py-1 text-xs font-medium`}>
                {tier.tag}
              </div>
            )}

            <div className="mb-6">
              <h3 className="text-xl font-bold">{tier.name}</h3>
              <div className="mt-4 flex items-baseline">
                <span className="text-3xl font-bold">{tier.price.split('/')[0]}</span>
                {tier.price.includes('/') && (
                  <span className="ml-2 text-text-light">
                    /{tier.price.split('/')[1]}
                  </span>
                )}
              </div>
              {tier.price.includes('month') && isAnnual && (
                <p className="mt-1 text-sm text-success">Save 20% with annual billing</p>
              )}
            </div>

            <div className="mb-6 space-y-4">
              {tier.features.map((feature) => (
                <div key={feature} className="flex items-start gap-2">
                  <Check className="mt-1 h-4 w-4 flex-shrink-0 text-success" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <Link
              to={tier.button.link}
              className={`block w-full rounded-xl px-6 py-3 text-center font-medium transition-colors ${
                tier.tag === 'Most Popular'
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-[hsl(var(--color-card-hover))] hover:bg-[hsl(var(--color-border))]'
              }`}
            >
              {tier.button.label}
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Money Back Guarantee */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        viewport={{ once: true }}
        className="mt-8 flex items-center justify-center gap-2 rounded-xl bg-[hsl(var(--color-card))] p-4 text-center"
      >
        <Shield className="h-5 w-5 text-success" />
        <p className="text-text-light">
          All plans include a 14-day money-back guarantee. No questions asked.
        </p>
      </motion.div>
    </div>
  );
};

export default PricingTiers;