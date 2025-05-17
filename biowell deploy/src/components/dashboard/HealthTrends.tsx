import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
  ChartOptions,
  ChartData
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Activity, TrendingUp, TrendingDown, Clock, Coffee, Utensils, Moon, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

interface HealthTrendsProps {
  userId: string;
}

const HealthTrends = ({ userId }: HealthTrendsProps) => {
  const [timeRange, setTimeRange] = useState<'24h' | '7d' | '30d'>('24h');
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showChartDetails, setShowChartDetails] = useState(false);
  const [showInsightDetails, setShowInsightDetails] = useState(false);
  const [chartData, setChartData] = useState<ChartData<'line'> | null>(null);
  const chartRef = useRef<ChartJS | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Create chart data
        const newChartData = {
          labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          datasets: [
            {
              label: 'Activity Score',
              data: [65, 78, 82, 75, 85, 88, 85],
              borderColor: 'hsl(var(--color-primary))',
              backgroundColor: 'hsla(var(--color-primary), 0.1)',
              fill: true,
              tension: 0.4,
            },
          ],
        };
        
        setChartData(newChartData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching health data:', error);
        setLoading(false);
      }
    };

    fetchData();
    
    // Cleanup function to destroy chart instance when component unmounts
    return () => {
      if (chartRef.current) {
        chartRef.current.destroy();
      }
    };
  }, [userId, timeRange]);

  const chartOptions: ChartOptions<'line'> = {
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
        displayColors: false,
        callbacks: {
          label: (context) => `Score: ${context.parsed.y}`,
        },
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6b7280',
          font: {
            size: 10,
          },
        },
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        ticks: {
          stepSize: 20,
          color: '#6b7280',
          font: {
            size: 10,
          },
        },
      },
    },
  };

  return (
    <div className="space-y-4">
      {/* Primary Metrics - Always Visible */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3">
          <div className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Activity Score</span>
          </div>
          <p className="mt-2 text-lg font-bold sm:text-2xl">85%</p>
        </div>
        <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Active Hours</span>
          </div>
          <p className="mt-2 text-lg font-bold sm:text-2xl">6.5h</p>
        </div>
        <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3">
          <div className="flex items-center gap-2">
            <Moon className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Sleep Quality</span>
          </div>
          <p className="mt-2 text-lg font-bold sm:text-2xl">92%</p>
        </div>
        <div className="rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-3">
          <div className="flex items-center gap-2">
            <Utensils className="h-4 w-4 text-primary sm:h-5 sm:w-5" />
            <span className="text-xs font-medium sm:text-sm">Nutrition</span>
          </div>
          <p className="mt-2 text-lg font-bold sm:text-2xl">78%</p>
        </div>
      </div>

      {/* Primary Insight - Always Visible */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-lg border border-warning/20 bg-warning/5 p-3 sm:p-4"
      >
        <div className="flex items-start gap-3">
          <AlertCircle className="h-4 w-4 shrink-0 text-warning sm:h-5 sm:w-5" />
          <div>
            <h3 className="text-sm font-medium text-warning sm:text-base">Attention Needed</h3>
            <p className="mt-1 text-xs text-text-light sm:text-sm">
              Your caffeine intake has increased by 40% this week. Consider reducing afternoon coffee consumption for better sleep quality.
            </p>
          </div>
        </div>
      </motion.div>

      {/* Expandable Chart Section */}
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]">
        <button
          onClick={() => setShowChartDetails(!showChartDetails)}
          className="flex w-full items-center justify-between p-4"
        >
          <h3 className="text-sm font-semibold sm:text-base">Health Trends</h3>
          {showChartDetails ? (
            <ChevronUp className="h-5 w-5 text-text-light" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-light" />
          )}
        </button>

        {showChartDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-[hsl(var(--color-border))] p-4"
          >
            <div className="space-y-4">
              <div className="flex gap-2">
                {(['24h', '7d', '30d'] as const).map((range) => (
                  <button
                    key={range}
                    onClick={() => setTimeRange(range)}
                    className={`min-h-[32px] rounded-lg px-3 py-1 text-xs font-medium transition-colors sm:min-h-[36px] ${
                      timeRange === range
                        ? 'bg-primary text-white'
                        : 'bg-[hsl(var(--color-card-hover))] text-text-light hover:text-text'
                    }`}
                  >
                    {range}
                  </button>
                ))}
              </div>
              <div className="h-48 sm:h-64">
                {loading ? (
                  <div className="flex h-full items-center justify-center">
                    <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
                  </div>
                ) : (
                  chartData && (
                    <Line 
                      data={chartData} 
                      options={chartOptions}
                      ref={(ref) => {
                        if (ref) {
                          chartRef.current = ref.chart;
                        }
                      }}
                    />
                  )
                )}
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {/* Expandable Additional Insights */}
      <div className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))]">
        <button
          onClick={() => setShowInsightDetails(!showInsightDetails)}
          className="flex w-full items-center justify-between p-4"
        >
          <h3 className="text-sm font-semibold sm:text-base">Additional Insights</h3>
          {showInsightDetails ? (
            <ChevronUp className="h-5 w-5 text-text-light" />
          ) : (
            <ChevronDown className="h-5 w-5 text-text-light" />
          )}
        </button>

        {showInsightDetails && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3 border-t border-[hsl(var(--color-border))] p-4"
          >
            <div className="flex items-center gap-3">
              <TrendingUp className="h-4 w-4 text-success sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm">Your activity level has improved by 15% compared to last week</p>
            </div>
            <div className="flex items-center gap-3">
              <Coffee className="h-4 w-4 text-warning sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm">Caffeine intake peaks between 2-4 PM, which may affect sleep quality</p>
            </div>
            <div className="flex items-center gap-3">
              <TrendingDown className="h-4 w-4 text-error sm:h-5 sm:w-5" />
              <p className="text-xs sm:text-sm">Sleep duration has decreased by 45 minutes on average</p>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HealthTrends;