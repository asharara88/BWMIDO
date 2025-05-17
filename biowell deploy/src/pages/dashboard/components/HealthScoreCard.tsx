import { motion } from 'framer-motion';
import { Activity, TrendingUp } from 'lucide-react';

interface HealthScoreCardProps {
  score: number;
}

const HealthScoreCard = ({ score }: HealthScoreCardProps) => {
  // Determine score category and color
  let category = '';
  let colorClass = '';
  
  if (score >= 90) {
    category = 'Excellent';
    colorClass = 'text-success';
  } else if (score >= 75) {
    category = 'Good';
    colorClass = 'text-primary';
  } else if (score >= 60) {
    category = 'Fair';
    colorClass = 'text-amber-500';
  } else {
    category = 'Needs Improvement';
    colorClass = 'text-error';
  }
  
  // Animation values for the circular progress
  const circumference = 2 * Math.PI * 45;
  const progressOffset = circumference - (score / 100) * circumference;
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full rounded-xl bg-white p-6 shadow-md"
    >
      <div className="flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold">
          <Activity className="h-5 w-5 text-primary" />
          Health Score
        </h2>
        <div className="flex items-center text-success">
          <TrendingUp className="mr-1 h-4 w-4" />
          <span className="text-xs font-medium">+3 pts</span>
        </div>
      </div>
      
      <div className="mt-4 flex flex-col items-center">
        <div className="relative flex h-40 w-40 items-center justify-center">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="#f1f5f9"
              strokeWidth="8"
            />
            {/* Progress circle */}
            <motion.circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="currentColor"
              strokeWidth="8"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset: progressOffset }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              className={colorClass}
            />
          </svg>
          {/* Score text */}
          <div className="absolute flex flex-col items-center">
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className="text-3xl font-bold"
            >
              {score}
            </motion.span>
            <span className="text-xs text-text-light">out of 100</span>
          </div>
        </div>
        
        <div className="mt-3 text-center">
          <h3 className={`text-lg font-semibold ${colorClass}`}>{category}</h3>
          <p className="mt-1 text-sm text-text-light">
            Your overall health score based on recent metrics
          </p>
        </div>
      </div>
      
      <div className="mt-6 rounded-lg bg-primary/5 p-3">
        <h4 className="text-sm font-medium">Top Recommendation</h4>
        <p className="mt-1 text-xs text-text-light">
          Increase deep sleep by reducing screen time 1 hour before bed.
        </p>
      </div>
    </motion.div>
  );
};

export default HealthScoreCard;