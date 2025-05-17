import { useState } from 'react';
import { motion } from 'framer-motion';
import { Target, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: Date;
}

const GoalTracker = () => {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Daily Steps',
      description: 'Reach daily step goal for better cardiovascular health',
      target: 10000,
      current: 8432,
      unit: 'steps',
      deadline: new Date('2025-12-31'),
    },
    {
      id: '2',
      title: 'Sleep Duration',
      description: 'Achieve optimal sleep duration for better recovery',
      target: 8,
      current: 6.5,
      unit: 'hours',
      deadline: new Date('2025-12-31'),
    },
  ]);

  const calculateProgress = (goal: Goal) => {
    return Math.min(100, (goal.current / goal.target) * 100);
  };

  const getProgressColor = (progress: number) => {
    if (progress >= 100) return 'bg-success';
    if (progress >= 75) return 'bg-primary';
    if (progress >= 50) return 'bg-warning';
    return 'bg-error';
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold">Goal Tracker</h2>
        <button className="btn-primary flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Add Goal
        </button>
      </div>

      <div className="grid gap-4">
        {goals.map((goal) => {
          const progress = calculateProgress(goal);
          const progressColor = getProgressColor(progress);

          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded-xl border border-[hsl(var(--color-border))] bg-[hsl(var(--color-card))] p-6"
            >
              <div className="mb-4 flex items-start justify-between">
                <div>
                  <h3 className="text-lg font-medium">{goal.title}</h3>
                  <p className="text-sm text-text-light">{goal.description}</p>
                </div>
                <div className="flex gap-2">
                  <button className="rounded-lg p-2 text-text-light transition-colors hover:bg-[hsl(var(--color-card-hover))] hover:text-text">
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button className="rounded-lg p-2 text-text-light transition-colors hover:bg-error/10 hover:text-error">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              <div className="mb-2 flex items-center justify-between text-sm">
                <div className="font-medium">
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()} {goal.unit}
                </div>
                <div className={progress >= 100 ? 'text-success' : 'text-text-light'}>
                  {Math.round(progress)}%
                  {progress >= 100 && <CheckCircle className="ml-1 inline-block h-4 w-4" />}
                </div>
              </div>

              <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-surface-1))]">
                <motion.div
                  className={`h-full ${progressColor}`}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-sm text-text-light">
                <div>
                  <Target className="mr-1 inline-block h-4 w-4" />
                  Target Date
                </div>
                <div>
                  {new Date(goal.deadline).toLocaleDateString()}
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default GoalTracker;