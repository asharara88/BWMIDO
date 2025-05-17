import { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { Search, Clock, Activity, Heart, Brain, Zap, AlertCircle } from 'lucide-react';
import InsightCard from '../../components/insights/InsightCard';

const InsightsPage = () => {
  const { isDemo } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [insights, setInsights] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading insights
    setLoading(true);
    setTimeout(() => {
      setInsights([
        {
          id: '1',
          title: 'Post-Meal Glucose Response',
          description: 'Your blood sugar shows significant variability after meals. Consider implementing pre-bolusing and adding more fiber to your meals to flatten the curve.',
          category: 'metabolic',
          date: '2025-04-18',
          impact: 'high',
          metrics: [
            {
              name: 'Time in Range',
              value: '65%',
              change: {
                value: '-15%',
                positive: false,
              },
            },
            {
              name: 'Glucose Variability',
              value: '35 mg/dL',
              change: {
                value: '+8 mg/dL',
                positive: false,
              },
            },
          ],
          glucoseData: {
            times: ['6:00', '7:00', '8:00', '9:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'],
            values: [85, 88, 95, 145, 165, 142, 110, 95, 92, 140, 158, 132, 98],
            ranges: {
              optimal: [70, 140],
              warning: [60, 180],
            },
            events: [
              {
                time: '8:30',
                type: 'meal',
                description: 'Breakfast: High-carb meal (bagel + orange juice)',
                impact: 70,
              },
              {
                time: '14:30',
                type: 'meal',
                description: 'Lunch: Mixed meal with refined carbs',
                impact: 65,
              },
            ],
            stats: {
              timeInRange: 65,
              averageGlucose: 118,
              variability: 35,
            },
          },
        },
        {
          id: '2',
          title: 'Sleep Quality Declining',
          description: 'Your deep sleep has decreased by 15% over the past week. This may be affecting your recovery and cognitive function.',
          category: 'sleep',
          date: '2025-04-18',
          impact: 'high',
          metrics: [
            {
              name: 'Deep Sleep',
              value: '1.2 hrs',
              change: {
                value: '-15%',
                positive: false,
              },
            },
            {
              name: 'Sleep Score',
              value: '68',
              change: {
                value: '-8',
                positive: false,
              },
            },
          ],
        },
        {
          id: '3',
          title: 'Improved Cardiovascular Fitness',
          description: 'Your resting heart rate has decreased by 5 BPM over the past month, indicating improved cardiovascular fitness.',
          category: 'recovery',
          date: '2025-04-16',
          impact: 'medium',
          metrics: [
            {
              name: 'Resting HR',
              value: '58 BPM',
              change: {
                value: '-5 BPM',
                positive: true,
              },
            },
            {
              name: 'Recovery Score',
              value: '85',
              change: {
                value: '+12',
                positive: true,
              },
            },
          ],
        },
        {
          id: '4',
          title: 'Activity Consistency',
          description: 'You\'ve maintained consistent activity levels for 14 consecutive days, which is great for establishing healthy habits.',
          category: 'activity',
          date: '2025-04-15',
          impact: 'medium',
          metrics: [
            {
              name: 'Daily Steps',
              value: '9,245',
              change: {
                value: '+8%',
                positive: true,
              },
            },
            {
              name: 'Active Minutes',
              value: '42 min',
              change: {
                value: '+5 min',
                positive: true,
              },
            },
          ],
        },
        {
          id: '5',
          title: 'Nutrition Impact on Sleep',
          description: 'Late evening meals appear to be negatively affecting your sleep quality. Consider eating dinner at least 3 hours before bedtime.',
          category: 'nutrition',
          date: '2025-04-14',
          impact: 'high',
          metrics: [
            {
              name: 'Sleep Latency',
              value: '32 min',
              change: {
                value: '+12 min',
                positive: false,
              },
            },
            {
              name: 'Evening Meals',
              value: '8:45 PM',
              change: {
                value: '+45 min',
                positive: false,
              },
            },
          ],
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const filteredInsights = insights.filter(insight => {
    const matchesSearch = searchQuery === '' || 
      insight.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      insight.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCategory = !activeCategory || insight.category === activeCategory;
    
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: null, name: 'All Insights', icon: <Activity className="h-4 w-4" /> },
    { id: 'metabolic', name: 'Metabolic', icon: <Brain className="h-4 w-4" /> },
    { id: 'sleep', name: 'Sleep', icon: <Clock className="h-4 w-4" /> },
    { id: 'activity', name: 'Activity', icon: <Activity className="h-4 w-4" /> },
    { id: 'recovery', name: 'Recovery', icon: <Heart className="h-4 w-4" /> },
    { id: 'nutrition', name: 'Nutrition', icon: <Zap className="h-4 w-4" /> },
  ];

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">Smart Insights</h1>
          <p className="mt-2 text-text-light">
            AI-powered analysis of your health data to help you optimize your wellbeing
          </p>
        </div>

        {isDemo && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-primary">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>
              You're viewing demo insights. Connect your devices to get personalized insights based on your own data.
            </p>
          </div>
        )}

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-text-light" />
          <input
            type="text"
            placeholder="Search insights..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-lg border border-[hsl(var(--color-border))] bg-[hsl(var(--color-surface-1))] pl-10 pr-4 py-2 text-text placeholder:text-text-light focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {/* Category filters - Horizontal scrollable on mobile */}
        <div className="mb-6 -mx-4 px-4 overflow-x-auto">
          <div className="flex space-x-2 pb-2 min-w-max">
            {categories.map((category) => (
              <button
                key={category.id || 'all'}
                onClick={() => setActiveCategory(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  activeCategory === category.id
                    ? 'bg-primary text-white'
                    : 'bg-[hsl(var(--color-card))] text-text-light hover:bg-[hsl(var(--color-card-hover))]'
                }`}
              >
                {category.icon}
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex h-64 items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
          </div>
        ) : (
          <>
            {/* Insights Grid */}
            {filteredInsights.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {filteredInsights.map((insight) => (
                  <InsightCard key={insight.id} insight={insight} />
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-8 text-center sm:p-12">
                <Brain className="mb-4 h-12 w-12 text-text-light" />
                <h3 className="mb-2 text-xl font-bold">No insights found</h3>
                <p className="mb-6 text-text-light">
                  We don't have any insights in this category yet. Connect more devices or check back later.
                </p>
                <button
                  onClick={() => setActiveCategory(null)}
                  className="rounded-lg bg-primary px-4 py-2 font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  View All Insights
                </button>
              </div>
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default InsightsPage;