import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Activity, Clock, Heart, Brain, Zap, TrendingUp, TrendingDown } from 'lucide-react';
import { Line } from 'react-chartjs-2';

interface InsightCardProps {
  insight: {
    id: string;
    title: string;
    description: string;
    category: string;
    date: string;
    impact: 'high' | 'medium' | 'low';
    metrics?: {
      name: string;
      value: string;
      change?: {
        value: string;
        positive: boolean;
      };
    }[];
    glucoseData?: {
      times: string[];
      values: number[];
      ranges?: {
        optimal: [number, number];
        warning: [number, number];
      };
      events?: {
        time: string;
        type: string;
        description: string;
        impact: number;
      }[];
      stats?: {
        timeInRange: number;
        averageGlucose: number;
        variability: number;
      };
    };
  };
}

const InsightCard = ({ insight }: InsightCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'sleep':
        return <Clock className="h-5 w-5" />;
      case 'activity':
        return <Activity className="h-5 w-5" />;
      case 'recovery':
        return <Heart className="h-5 w-5" />;
      case 'nutrition':
        return <Zap className="h-5 w-5" />;
      case 'metabolic':
        return <Brain className="h-5 w-5" />;
      default:
        return <Activity className="h-5 w-5" />;
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high':
        return 'text-error';
      case 'medium':
        return 'text-warning';
      case 'low':
        return 'text-success';
      default:
        return 'text-text-light';
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
    }).format(date);
  };

  const getGlucoseChartOptions = (ranges?: { optimal: [number, number]; warning: [number, number] }) => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        titleColor: '#111827',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        padding: 10,
        callbacks: {
          label: (context: any) => `Glucose: ${context.parsed.y} mg/dL`,
        },
      },
    },
    scales: {
      y: {
        min: ranges ? ranges.warning[0] - 10 : 60,
        max: ranges ? ranges.warning[1] + 10 : 180,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          callback: (value: number) => `${value}`,
          color: '#6b7280',
        },
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
        },
      },
    },
  });

  const getGlucoseChartData = (data: { times: string[]; values: number[]; ranges?: { optimal: [number, number]; warning: [number, number] } }) => ({
    labels: data.times,
    datasets: [
      // Target range
      ...(data.ranges ? [{
        label: 'Target Range',
        data: Array(data.times.length).fill(null),
        backgroundColor: 'rgba(34, 197, 94, 0.1)', // Success color
        borderColor: 'transparent',
        fill: true,
        pointRadius: 0,
        yAxisID: 'y',
        segment: {
          backgroundColor: (ctx: any) => {
            const yStart = ctx.p0.parsed.y;
            const yEnd = ctx.p1.parsed.y;
            if (yStart >= data.ranges.optimal[0] && yEnd <= data.ranges.optimal[1]) {
              return 'rgba(34, 197, 94, 0.1)';
            }
            return 'rgba(234, 179, 8, 0.1)';
          },
        },
      }] : []),
      // Glucose line
      {
        label: 'Glucose',
        data: data.values,
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        borderWidth: 2,
        fill: true,
        tension: 0.4,
        pointRadius: 3,
        pointHoverRadius: 5,
      },
    ],
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="overflow-hidden rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] shadow-sm transition-shadow hover:shadow-md"
    >
      {/* Card Header - Always Visible */}
      <div className="p-4">
        <div className="mb-2 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-primary/10 p-2 text-primary">
              {getCategoryIcon(insight.category)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium capitalize text-text-light">
                  {insight.category}
                </span>
                <span className="h-1 w-1 rounded-full bg-text-light"></span>
                <span className="text-xs text-text-light">
                  {formatDate(insight.date)}
                </span>
              </div>
            </div>
          </div>
          <div
            className={`rounded-full px-2 py-1 text-xs font-medium ${getImpactColor(
              insight.impact
            )}`}
          >
            {insight.impact.charAt(0).toUpperCase() + insight.impact.slice(1)}
          </div>
        </div>

        <h3 className="mb-2 text-base font-bold">{insight.title}</h3>
        <p className="text-sm text-text-light">{insight.description}</p>

        {/* Metrics Preview - Always Visible */}
        {insight.metrics && insight.metrics.length > 0 && (
          <div className="mt-3 grid grid-cols-2 gap-2">
            {insight.metrics.slice(0, 2).map((metric, index) => (
              <div
                key={index}
                className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-background))] p-2"
              >
                <div className="text-xs text-text-light">{metric.name}</div>
                <div className="flex items-end justify-between">
                  <div className="text-sm font-bold">{metric.value}</div>
                  {metric.change && (
                    <div
                      className={`flex items-center text-xs ${
                        metric.change.positive
                          ? 'text-success'
                          : 'text-error'
                      }`}
                    >
                      {metric.change.positive ? (
                        <TrendingUp className="mr-1 h-3 w-3" />
                      ) : (
                        <TrendingDown className="mr-1 h-3 w-3" />
                      )}
                      {metric.change.value}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Expand/Collapse Button */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-3 flex w-full items-center justify-center gap-1 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] px-3 py-2 text-xs text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="h-3.5 w-3.5" />
            </>
          ) : (
            <>
              View Details <ChevronDown className="h-3.5 w-3.5" />
            </>
          )}
        </button>
      </div>

      {/* Expanded Content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] p-4"
          >
            {/* Additional Metrics */}
            {insight.metrics && insight.metrics.length > 2 && (
              <div className="mb-4 grid grid-cols-2 gap-2">
                {insight.metrics.slice(2).map((metric, index) => (
                  <div
                    key={index}
                    className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-2"
                  >
                    <div className="text-xs text-text-light">{metric.name}</div>
                    <div className="flex items-end justify-between">
                      <div className="text-sm font-bold">{metric.value}</div>
                      {metric.change && (
                        <div
                          className={`flex items-center text-xs ${
                            metric.change.positive
                              ? 'text-success'
                              : 'text-error'
                          }`}
                        >
                          {metric.change.positive ? (
                            <TrendingUp className="mr-1 h-3 w-3" />
                          ) : (
                            <TrendingDown className="mr-1 h-3 w-3" />
                          )}
                          {metric.change.value}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Glucose Chart */}
            {insight.glucoseData && (
              <div className="mb-4 space-y-3 rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3">
                <div>
                  <h4 className="mb-2 text-xs font-medium">Glucose Trend</h4>
                  <div className="h-40 sm:h-48">
                    <Line
                      data={getGlucoseChartData(insight.glucoseData)}
                      options={getGlucoseChartOptions(insight.glucoseData.ranges)}
                    />
                  </div>
                </div>

                {insight.glucoseData.stats && (
                  <div className="grid grid-cols-3 gap-2 border-t border-[hsl(var(--color-border))] pt-3">
                    <div>
                      <div className="text-xs text-text-light">Time in Range</div>
                      <div className="text-sm font-semibold">{insight.glucoseData.stats.timeInRange}%</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-light">Average</div>
                      <div className="text-sm font-semibold">{insight.glucoseData.stats.averageGlucose} mg/dL</div>
                    </div>
                    <div>
                      <div className="text-xs text-text-light">Variability</div>
                      <div className="text-sm font-semibold">±{insight.glucoseData.stats.variability} mg/dL</div>
                    </div>
                  </div>
                )}

                {insight.glucoseData.events && insight.glucoseData.events.length > 0 && (
                  <div className="space-y-2 border-t border-[hsl(var(--color-border))] pt-3">
                    <h5 className="text-xs font-medium">Events</h5>
                    {insight.glucoseData.events.map((event, index) => (
                      <div key={index} className="flex items-center justify-between rounded-lg bg-[hsl(var(--color-surface-1))] p-2 text-xs">
                        <div>
                          <span className="font-medium">{event.time}:</span> {event.description}
                        </div>
                        <div className={`font-medium ${event.impact > 0 ? 'text-error' : 'text-success'}`}>
                          {event.impact > 0 ? '+' : ''}{event.impact} mg/dL
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Action Button */}
            <button className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-dark">
              Get Personalized Advice
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default InsightCard;