import { motion } from 'framer-motion';
import { Target, Plus, Edit, Trash2, CheckCircle } from 'lucide-react';
import { useState } from 'react';

interface Goal {
  id: string;
  name: string;
  progress: number;
  target: string;
}

interface GoalsProgressProps {
  goals: Goal[];
}

const GoalsProgress = ({ goals }: GoalsProgressProps) => {
  const [showAddGoal, setShowAddGoal] = useState(false);
  
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="h-full rounded-xl bg-white p-6 shadow-md"
    >
      <div className="mb-4 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-lg font-bold text-gray-900">
          <Target className="h-5 w-5 text-primary" />
          Health Goals
        </h2>
        <button 
          onClick={() => setShowAddGoal(!showAddGoal)}
          className="flex items-center gap-1 rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary transition-colors hover:bg-primary/20"
        >
          <Plus className="h-3 w-3" />
          {showAddGoal ? 'Cancel' : 'Add Goal'}
        </button>
      </div>
      
      {showAddGoal && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="mb-4 overflow-hidden rounded-lg border border-gray-200 bg-gray-50 p-4"
        >
          <h3 className="mb-3 text-sm font-medium text-gray-900">Add New Health Goal</h3>
          <div className="space-y-3">
            <div>
              <label htmlFor="goal-name" className="mb-1 block text-xs font-medium text-gray-700">
                Goal Name
              </label>
              <input
                id="goal-name"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g., Improve sleep quality"
              />
            </div>
            <div>
              <label htmlFor="goal-target" className="mb-1 block text-xs font-medium text-gray-700">
                Target
              </label>
              <input
                id="goal-target"
                type="text"
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm text-gray-900 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="e.g., 8 hours of sleep per night"
              />
            </div>
            <div className="flex justify-end">
              <button className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark">
                Save Goal
              </button>
            </div>
          </div>
        </motion.div>
      )}
      
      <div className="space-y-4">
        {goals.map((goal) => (
          <div key={goal.id} className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
            <div className="mb-2 flex items-center justify-between">
              <h3 className="font-medium text-gray-900">{goal.name}</h3>
              <div className="flex items-center gap-2">
                <button className="rounded p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600">
                  <Edit className="h-4 w-4" />
                </button>
                <button className="rounded p-1 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <p className="mb-3 text-xs text-gray-500">Target: {goal.target}</p>
            
            <div className="mb-1 flex items-center justify-between text-xs">
              <span className="text-gray-500">Progress</span>
              <span className="font-medium text-gray-700">{goal.progress}%</span>
            </div>
            
            <div className="h-2 overflow-hidden rounded-full bg-gray-100">
              <div 
                className={`h-full transition-all ${
                  goal.progress >= 80 ? 'bg-success' : 
                  goal.progress >= 50 ? 'bg-primary' : 
                  goal.progress >= 25 ? 'bg-amber-500' : 'bg-error'
                }`}
                style={{ width: `${goal.progress}%` }}
              ></div>
            </div>
            
            {goal.progress >= 100 && (
              <div className="mt-2 flex items-center gap-1 text-xs font-medium text-success">
                <CheckCircle className="h-3 w-3" />
                Completed
              </div>
            )}
          </div>
        ))}
        
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-gray-300 p-8 text-center">
            <Target className="mb-2 h-8 w-8 text-gray-400" />
            <h3 className="text-sm font-medium text-gray-900">No goals set yet</h3>
            <p className="mt-1 text-xs text-gray-500">
              Set health goals to track your progress and improve your BW Score
            </p>
            <button 
              onClick={() => setShowAddGoal(true)}
              className="mt-4 flex items-center gap-1 rounded-md bg-primary px-4 py-2 text-xs font-medium text-white"
            >
              <Plus className="h-3 w-3" />
              Add Your First Goal
            </button>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default GoalsProgress;