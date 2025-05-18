import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useSupabase } from '../../contexts/SupabaseContext';
import { useAuth } from '../../contexts/AuthContext';
import { Activity, ArrowLeft, ArrowRight } from 'lucide-react';

import steps from './steps/config';

const OnboardingPage = () => {
  const [stepIndex, setStepIndex] = useState(0);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    goals: [] as string[],
    sleepHours: '',
    exerciseFrequency: '',
    dietPreference: '',
    stressLevel: '',
    existingConditions: [] as string[],
    medications: [] as string[],
    wearables: [] as string[],
  });
  const [loading, setLoading] = useState(false);
  
  const { supabase } = useSupabase();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const updateFormData = (data: Partial<typeof formData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  };
  
  const nextStep = () => {
    if (stepIndex < steps.length - 1) {
      setStepIndex((prev) => prev + 1);
    }
  };
  
  const prevStep = () => {
    if (stepIndex > 0) {
      setStepIndex((prev) => prev - 1);
    }
  };
  
  const completeOnboarding = async () => {
    if (!user) return;
    
    setLoading(true);
    
    try {
      // Update user profile
      await supabase
        .from('profiles')
        .update({
          first_name: formData.firstName,
          last_name: formData.lastName,
          onboarding_completed: true,
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);
      
      // Store quiz responses
      await supabase.from('quiz_responses').insert({
        user_id: user.id,
        age: parseInt(formData.age) || null,
        gender: formData.gender,
        height_cm: parseFloat(formData.height) || null,
        weight_kg: parseFloat(formData.weight) || null,
        health_goals: formData.goals,
        sleep_hours: parseFloat(formData.sleepHours) || null,
        exercise_frequency: formData.exerciseFrequency,
        diet_preference: formData.dietPreference,
        stress_level: formData.stressLevel,
        existing_conditions: formData.existingConditions,
        medications: formData.medications,
        created_at: new Date().toISOString(),
      });
      
      // Navigate to dashboard
      navigate('/dashboard');
    } catch (error) {
      console.error('Error completing onboarding:', error);
    } finally {
      setLoading(false);
    }
  };
  
  const StepComponent = steps[stepIndex].component;
  
  return (
    <div className="min-h-[calc(100vh-64px)] bg-background-alt py-10">
      <div className="container mx-auto max-w-3xl px-4">
        <div className="mb-6 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Activity className="h-6 w-6" />
          </div>
          <h1 className="text-2xl font-bold text-text md:text-3xl">Welcome to Biowell</h1>
          <p className="mt-2 text-text-light">
            Let's set up your account to provide personalized health insights
          </p>
        </div>
        
        {/* Progress bar */}
        {stepIndex < steps.length - 1 && (
          <div className="mb-8">
            <div className="mb-2 flex justify-between text-sm text-text-light">
              <span>Step {stepIndex + 1} of {steps.length - 1}</span>
              <span>{steps[stepIndex].title}</span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
              <div
                className="h-full bg-primary transition-all"
                style={{ width: `${(stepIndex / (steps.length - 2)) * 100}%` }}
              ></div>
            </div>
          </div>
        )}
        
        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={stepIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <div className="rounded-xl bg-white p-6 shadow-lg md:p-8">
              <StepComponent
                formData={formData}
                updateFormData={updateFormData}
                nextStep={nextStep}
                prevStep={prevStep}
                completeOnboarding={completeOnboarding}
                loading={loading}
              />
            </div>
          </motion.div>
        </AnimatePresence>
        
        {/* Navigation buttons */}
        {stepIndex > 0 && stepIndex < steps.length - 1 && (
          <div className="mt-6 flex justify-between">
            <button onClick={prevStep} className="btn-outline flex items-center gap-1">
              <ArrowLeft className="h-4 w-4" />
              Back
            </button>
            <button onClick={nextStep} className="btn-primary flex items-center gap-1">
              Next
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default OnboardingPage;
