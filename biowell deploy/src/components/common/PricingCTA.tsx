import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface PricingCTAProps {
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string;
}

const PricingCTA = ({
  title = "Ready to optimize your health?",
  description = "Join thousands of users who have transformed their health journey with Biowell.",
  buttonText = "Get Started Today",
  buttonLink = "/signup"
}: PricingCTAProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="rounded-xl bg-gradient-to-r from-primary to-secondary p-8 text-center text-white"
    >
      <h2 className="mb-4 text-2xl font-bold">{title}</h2>
      <p className="mb-6">{description}</p>
      <Link
        to={buttonLink}
        className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-medium text-primary transition-colors hover:bg-white/90"
      >
        {buttonText}
        <ArrowRight className="h-5 w-5" />
      </Link>
    </motion.div>
  );
};

export default PricingCTA;