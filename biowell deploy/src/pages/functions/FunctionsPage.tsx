import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Activity, Brain, Heart, Watch, Zap, ArrowRight } from 'lucide-react';

interface FunctionCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  functions: Function[];
}

interface Function {
  id: string;
  name: string;
  description: string;
  category: string;
  metrics: {
    usage: number;
    performance: number;
    reliability: number;
  };
}

const functionCategories: FunctionCategory[] = [
  {
    id: 'health-metrics',
    name: 'Health Metrics',
    description: 'Core functions for processing and analyzing health data',
    icon: <Activity className="h-6 w-6" />,
    functions: [
      {
        id: 'calculate-health-score',
        name: 'calculateHealthScore',
        description: 'Calculate overall health score based on multiple metrics',
        category: 'health-metrics',
        metrics: {
          usage: 95,
          performance: 98,
          reliability: 99,
        },
      },
      {
        id: 'analyze-sleep-quality',
        name: 'analyzeSleepQuality',
        description: 'Analyze sleep patterns and quality metrics',
        category: 'health-metrics',
        metrics: {
          usage: 88,
          performance: 95,
          reliability: 97,
        },
      },
    ],
  },
  {
    id: 'ai-insights',
    name: 'AI Insights',
    description: 'Machine learning functions for personalized recommendations',
    icon: <Brain className="h-6 w-6" />,
    functions: [
      {
        id: 'generate-health-insights',
        name: 'generateHealthInsights',
        description: 'Generate personalized health insights using AI',
        category: 'ai-insights',
        metrics: {
          usage: 92,
          performance: 94,
          reliability: 96,
        },
      },
    ],
  },
  {
    id: 'device-integration',
    name: 'Device Integration',
    description: 'Functions for connecting and syncing with wearable devices',
    icon: <Watch className="h-6 w-6" />,
    functions: [
      {
        id: 'sync-device-data',
        name: 'syncDeviceData',
        description: 'Sync health data from connected wearable devices',
        category: 'device-integration',
        metrics: {
          usage: 85,
          performance: 92,
          reliability: 94,
        },
      },
    ],
  },
];

const FunctionsPage = () => {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-12">
        <h1 className="text-3xl font-bold md:text-4xl">Function Documentation</h1>
        <p className="mt-2 text-text-light">
          Explore our comprehensive library of health analytics functions
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {functionCategories.map((category) => (
          <motion.div
            key={category.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                {category.icon}
              </div>
              <div>
                <h2 className="text-xl font-bold">{category.name}</h2>
                <p className="text-sm text-text-light">{category.description}</p>
              </div>
            </div>

            <div className="space-y-4">
              {category.functions.map((func) => (
                <Link
                  key={func.id}
                  to={`/functions/${func.id}`}
                  className="flex items-center justify-between rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-4 transition-colors hover:border-primary/50 hover:bg-[hsl(var(--color-card-hover))]"
                >
                  <div>
                    <h3 className="font-mono text-lg font-medium text-primary">
                      {func.name}
                    </h3>
                    <p className="mt-1 text-sm text-text-light">
                      {func.description}
                    </p>
                    <div className="mt-3 flex gap-4">
                      <div className="text-xs text-text-light">
                        Usage:{' '}
                        <span className="text-primary">{func.metrics.usage}%</span>
                      </div>
                      <div className="text-xs text-text-light">
                        Performance:{' '}
                        <span className="text-primary">
                          {func.metrics.performance}%
                        </span>
                      </div>
                      <div className="text-xs text-text-light">
                        Reliability:{' '}
                        <span className="text-primary">
                          {func.metrics.reliability}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <ArrowRight className="h-5 w-5 text-primary" />
                </Link>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default FunctionsPage;