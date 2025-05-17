import { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import HealthDashboard from '../../components/dashboard/HealthDashboard';

const DashboardPage = () => {
  const { user, isDemo } = useAuth();

  return (
    <div className="container mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="mb-6">
          <h1 className="text-2xl font-bold md:text-3xl">
            Welcome back{user?.email ? `, ${user.email.split('@')[0]}` : ''}
          </h1>
          <p className="text-text-light">Here's an overview of your health today</p>
        </div>

        {isDemo && (
          <div className="mb-6 flex items-center gap-3 rounded-xl bg-primary/10 p-4 text-primary">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            <p>You're viewing demo data. Connect your devices to see your actual health metrics.</p>
          </div>
        )}

        <HealthDashboard />
      </motion.div>
    </div>
  );
}

export default DashboardPage;