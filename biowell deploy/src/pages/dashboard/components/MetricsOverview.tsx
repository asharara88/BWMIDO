import React from 'react';
import { motion } from 'framer-motion';
import { Heart, Footprints, Moon, Flame, Scale, Zap, Brain, Droplet } from 'lucide-react';

interface MetricsOverviewProps {
  metrics: {
    deep_sleep: number;
    rem_sleep: number;
    steps: number;
    calories: number;
    heart_rate: number;
    bmi: number;
    recovery?: number;
    readiness?: number;
    stress?: number;
    glucose?: number;
    hydration?: number;
    hrv?: number;
  };
}

const MetricsOverview = ({ metrics }: MetricsOverviewProps) => {
  const metricCards = [
    {
      name: 'Deep Sleep',
      value: metrics.deep_sleep,
      unit: 'hr',
      target: '1.5-2 hr',
      icon: <Moon className="h-6 w-6" />,
      color: 'bg-indigo-50 text-indigo-600',
      isGood: metrics.deep_sleep >= 1.5,
    },
    {
      name: 'Steps',
      value: metrics.steps,
      unit: '',
      target: '10,000',
      icon: <Footprints className="h-6 w-6" />,
      color: 'bg-blue-50 text-blue-600',
      isGood: metrics.steps >= 8000,
    },
    {
      name: 'Heart Rate',
      value: metrics.heart_rate,
      unit: 'bpm',
      target: '60-70 bpm',
      icon: <Heart className="h-6 w-6" />,
      color: 'bg-red-50 text-red-600',
      isGood: metrics.heart_rate < 70,
    },
    {
      name: 'Active Calories',
      value: metrics.calories,
      unit: 'kcal',
      target: '500+ kcal',
      icon: <Flame className="h-6 w-6" />,
      color: 'bg-orange-50 text-orange-600',
      isGood: metrics.calories >= 400,
    },
    {
      name: 'BMI',
      value: metrics.bmi,
      unit: '',
      target: '18.5-24.9',
      icon: <Scale className="h-6 w-6" />,
      color: 'bg-emerald-50 text-emerald-600',
      isGood: metrics.bmi >= 18.5 && metrics.bmi <= 24.9,
    },
    {
      name: 'Recovery',
      value: metrics.recovery || 68,
      unit: '',
      target: '70+',
      icon: <Zap className="h-6 w-6" />,
      color: 'bg-purple-50 text-purple-600',
      isGood: (metrics.recovery || 68) >= 70,
    },
    {
      name: 'Readiness',
      value: metrics.readiness || 75,
      unit: '',
      target: '80+',
      icon: <Brain className="h-6 w-6" />,
      color: 'bg-cyan-50 text-cyan-600',
      isGood: (metrics.readiness || 75) >= 80,
    },
    {
      name: 'Hydration',
      value: metrics.hydration || 85,
      unit: '%',
      target: '90%+',
      icon: <Droplet className="h-6 w-6" />,
      color: 'bg-sky-50 text-sky-600',
      isGood: (metrics.hydration || 85) >= 90,
    },
  ];

  return (
    <div className="h-full rounded-xl bg-white p-6 shadow-md">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-gray-900">Today's Health Metrics</h2>
        <p className="text-sm text-gray-600">
          Your most recent biometric readings
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
        {metricCards.map((metric, index) => (
          <motion.div
            key={metric.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            className="rounded-lg border border-gray-200 bg-white p-3"
          >
            <div className="flex items-start justify-between">
              <div className={`rounded-lg p-2 ${metric.color}`}>
                {metric.icon}
              </div>
              {metric.isGood ? (
                <span className="text-xs font-medium text-success">
                  Good
                </span>
              ) : (
                <span className="text-xs font-medium text-amber-500">
                  Improve
                </span>
              )}
            </div>
            <div className="mt-3">
              <h3 className="text-sm font-medium text-gray-600">
                {metric.name}
              </h3>
              <div className="mt-1 flex items-baseline">
                <span className="text-xl font-semibold text-gray-900">
                  {typeof metric.value === 'number'
                    ? metric.value.toLocaleString()
                    : metric.value}
                </span>
                {metric.unit && (
                  <span className="ml-1 text-xs text-gray-500">
                    {metric.unit}
                  </span>
                )}
              </div>
              {metric.target && (
                <div className="mt-1">
                  <span className="text-xs text-gray-500">
                    Target: {metric.target}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MetricsOverview;