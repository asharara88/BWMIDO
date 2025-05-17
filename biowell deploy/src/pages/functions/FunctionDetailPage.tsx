import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronRight, Activity, Code, Book, Link as LinkIcon, ArrowLeft } from 'lucide-react';

const FunctionDetailPage = () => {
  const { functionId } = useParams<{ functionId: string }>();

  // In a real app, fetch function details from API
  const functionDetails = {
    id: functionId,
    name: 'calculateHealthScore',
    description: 'Calculates a comprehensive health score based on various biometric inputs',
    category: 'Health Metrics',
    version: '1.2.0',
    lastUpdated: '2025-03-15',
    author: 'Biowell Team',
    metrics: {
      usage: 95,
      performance: 98,
      reliability: 99,
    },
    parameters: [
      {
        name: 'metrics',
        type: 'HealthMetrics',
        description: 'Object containing health metric values',
        required: true,
      },
      {
        name: 'options',
        type: 'CalculationOptions',
        description: 'Optional configuration for score calculation',
        required: false,
      },
    ],
    returns: {
      type: 'number',
      description: 'Health score between 0 and 100',
    },
    examples: [
      {
        title: 'Basic Usage',
        code: `const metrics = {
  deepSleep: 2.5,
  remSleep: 1.8,
  steps: 8000,
  heartRate: 65,
  bmi: 22.5
};

const score = calculateHealthScore(metrics);
console.log(score); // Output: 85`,
      },
      {
        title: 'With Custom Options',
        code: `const metrics = {
  deepSleep: 2.5,
  remSleep: 1.8,
  steps: 8000
};

const options = {
  weights: {
    sleep: 0.6,
    activity: 0.4
  }
};

const score = calculateHealthScore(metrics, options);
console.log(score); // Output: 78`,
      },
    ],
    relatedFunctions: [
      {
        id: 'analyze-sleep-quality',
        name: 'analyzeSleepQuality',
        description: 'Analyze sleep patterns and quality metrics',
      },
      {
        id: 'calculate-activity-score',
        name: 'calculateActivityScore',
        description: 'Calculate activity score based on steps and exercise',
      },
    ],
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <div className="mb-8 flex items-center gap-2 text-sm text-text-light">
        <Link to="/functions" className="hover:text-primary">
          Functions
        </Link>
        <ChevronRight className="h-4 w-4" />
        <span>{functionDetails.category}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-text">{functionDetails.name}</span>
      </div>

      {/* Header */}
      <div className="mb-12">
        <Link
          to="/functions"
          className="mb-6 inline-flex items-center gap-2 text-text-light transition-colors hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Functions
        </Link>

        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold md:text-4xl">
              {functionDetails.name}
            </h1>
            <p className="mt-2 text-lg text-text-light">
              {functionDetails.description}
            </p>
          </div>
          <div className="rounded-xl bg-[hsl(var(--color-card))] p-4">
            <div className="flex items-center gap-4 text-sm">
              <div>
                <div className="text-text-light">Version</div>
                <div className="font-medium">{functionDetails.version}</div>
              </div>
              <div className="h-8 w-px bg-[hsl(var(--color-border))]" />
              <div>
                <div className="text-text-light">Last Updated</div>
                <div className="font-medium">{functionDetails.lastUpdated}</div>
              </div>
              <div className="h-8 w-px bg-[hsl(var(--color-border))]" />
              <div>
                <div className="text-text-light">Author</div>
                <div className="font-medium">{functionDetails.author}</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Parameters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card mb-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Code className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Parameters</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-[hsl(var(--color-border))]">
                    <th className="pb-3 text-left font-medium text-text-light">
                      Name
                    </th>
                    <th className="pb-3 text-left font-medium text-text-light">
                      Type
                    </th>
                    <th className="pb-3 text-left font-medium text-text-light">
                      Required
                    </th>
                    <th className="pb-3 text-left font-medium text-text-light">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[hsl(var(--color-border))]">
                  {functionDetails.parameters.map((param) => (
                    <tr key={param.name}>
                      <td className="py-3 font-mono text-primary">
                        {param.name}
                      </td>
                      <td className="py-3 font-mono">{param.type}</td>
                      <td className="py-3">
                        {param.required ? (
                          <span className="badge-primary">Required</span>
                        ) : (
                          <span className="badge bg-gray-500/10 text-gray-500">
                            Optional
                          </span>
                        )}
                      </td>
                      <td className="py-3 text-text-light">{param.description}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>

          {/* Returns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card mb-8"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <ArrowLeft className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Returns</h2>
            </div>

            <div className="rounded-lg border border-[hsl(var(--color-border))] p-4">
              <div className="mb-2 font-mono text-primary">
                {functionDetails.returns.type}
              </div>
              <p className="text-text-light">
                {functionDetails.returns.description}
              </p>
            </div>
          </motion.div>

          {/* Examples */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.2 }}
            className="card"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <Book className="h-6 w-6" />
              </div>
              <h2 className="text-xl font-bold">Examples</h2>
            </div>

            <div className="space-y-6">
              {functionDetails.examples.map((example, index) => (
                <div key={index}>
                  <h3 className="mb-3 font-medium">{example.title}</h3>
                  <pre className="overflow-x-auto rounded-lg bg-[hsl(var(--color-card))] p-4 font-mono text-sm">
                    <code>{example.code}</code>
                  </pre>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

        <div>
          {/* Metrics */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="card mb-8"
          >
            <h2 className="mb-4 text-lg font-bold">Metrics</h2>
            <div className="space-y-4">
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-light">Usage</span>
                  <span className="font-medium text-primary">
                    {functionDetails.metrics.usage}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-card))]">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${functionDetails.metrics.usage}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-light">Performance</span>
                  <span className="font-medium text-primary">
                    {functionDetails.metrics.performance}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-card))]">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${functionDetails.metrics.performance}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-text-light">Reliability</span>
                  <span className="font-medium text-primary">
                    {functionDetails.metrics.reliability}%
                  </span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-card))]">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${functionDetails.metrics.reliability}%` }}
                  />
                </div>
              </div>
            </div>
          </motion.div>

          {/* Related Functions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="card"
          >
            <div className="mb-6 flex items-center gap-3">
              <div className="rounded-xl bg-primary/10 p-3 text-primary">
                <LinkIcon className="h-6 w-6" />
              </div>
              <h2 className="text-lg font-bold">Related Functions</h2>
            </div>

            <div className="space-y-3">
              {functionDetails.relatedFunctions.map((func) => (
                <Link
                  key={func.id}
                  to={`/functions/${func.id}`}
                  className="block rounded-lg border border-[hsl(var(--color-border))] p-4 transition-colors hover:border-primary/50 hover:bg-[hsl(var(--color-card-hover))]"
                >
                  <h3 className="font-mono text-primary">{func.name}</h3>
                  <p className="mt-1 text-sm text-text-light">
                    {func.description}
                  </p>
                </Link>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default FunctionDetailPage;