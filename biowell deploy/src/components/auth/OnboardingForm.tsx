import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, AlertCircle, ArrowRight, Shield } from 'lucide-react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

interface ValidationErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  mobile?: string;
}

const OnboardingForm = () => {
  const [formData, setFormData] = useState<FormData>({
    firstName: '',
    lastName: '',
    email: '',
    mobile: '',
  });

  const [errors, setErrors] = useState<ValidationErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  // Calculate form completion percentage
  const calculateProgress = () => {
    const fields = ['firstName', 'lastName', 'email'];
    const filledFields = fields.filter(field => formData[field as keyof FormData].trim() !== '');
    return (filledFields.length / fields.length) * 100;
  };

  // Validate form field in real-time
  const validateField = (name: keyof FormData, value: string) => {
    const newErrors = { ...errors };

    switch (name) {
      case 'firstName':
      case 'lastName':
        if (!value.trim()) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is required`;
        } else if (value.length < 2) {
          newErrors[name] = `${name === 'firstName' ? 'First' : 'Last'} name is too short`;
        } else {
          delete newErrors[name];
        }
        break;

      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value.trim()) {
          newErrors.email = 'Email is required';
        } else if (!emailRegex.test(value)) {
          newErrors.email = 'Please enter a valid email address';
        } else {
          delete newErrors.email;
        }
        break;

      case 'mobile':
        const phoneRegex = /^\+?[\d\s-]{10,}$/;
        if (value.trim() && !phoneRegex.test(value)) {
          newErrors.mobile = 'Please enter a valid phone number';
        } else {
          delete newErrors.mobile;
        }
        break;
    }

    setErrors(newErrors);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    validateField(name as keyof FormData, value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all required fields
    const requiredFields: (keyof FormData)[] = ['firstName', 'lastName', 'email'];
    const newErrors: ValidationErrors = {};
    
    requiredFields.forEach(field => {
      if (!formData[field].trim()) {
        newErrors[field] = `${field === 'firstName' ? 'First' : field === 'lastName' ? 'Last' : 'Email'} is required`;
      }
    });
    
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      setSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-md">
      <AnimatePresence mode="wait">
        {submitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center"
          >
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-success/10 text-success">
              <CheckCircle className="h-6 w-6" />
            </div>
            <h2 className="mb-2 text-xl font-bold">Welcome aboard!</h2>
            <p className="mb-6 text-text-light">
              Your account has been created successfully. Check your email to get started.
            </p>
            <button className="btn-primary w-full">
              Continue to Dashboard
              <ArrowRight className="ml-2 h-4 w-4" />
            </button>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
          >
            <div className="mb-6">
              <div className="mb-2 flex items-center justify-between text-sm">
                <span className="font-medium">Complete your profile</span>
                <span className="text-text-light">{Math.round(calculateProgress())}% complete</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-[hsl(var(--color-card))]">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${calculateProgress()}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label htmlFor="firstName" className="label">
                    First Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className={`input ${errors.firstName ? 'border-error' : ''}`}
                    value={formData.firstName}
                    onChange={handleChange}
                    placeholder="John"
                  />
                  {errors.firstName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center gap-1 text-xs text-error"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.firstName}
                    </motion.p>
                  )}
                </div>

                <div>
                  <label htmlFor="lastName" className="label">
                    Last Name <span className="text-error">*</span>
                  </label>
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className={`input ${errors.lastName ? 'border-error' : ''}`}
                    value={formData.lastName}
                    onChange={handleChange}
                    placeholder="Doe"
                  />
                  {errors.lastName && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="mt-1 flex items-center gap-1 text-xs text-error"
                    >
                      <AlertCircle className="h-3 w-3" />
                      {errors.lastName}
                    </motion.p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="email" className="label">
                  Email Address <span className="text-error">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  className={`input ${errors.email ? 'border-error' : ''}`}
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center gap-1 text-xs text-error"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.email}
                  </motion.p>
                )}
              </div>

              <div>
                <label htmlFor="mobile" className="label">
                  Mobile Number <span className="text-text-light">(Optional)</span>
                </label>
                <input
                  id="mobile"
                  name="mobile"
                  type="tel"
                  className={`input ${errors.mobile ? 'border-error' : ''}`}
                  value={formData.mobile}
                  onChange={handleChange}
                  placeholder="+1 (555) 000-0000"
                />
                {errors.mobile && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-1 flex items-center gap-1 text-xs text-error"
                  >
                    <AlertCircle className="h-3 w-3" />
                    {errors.mobile}
                  </motion.p>
                )}
              </div>

              <div className="flex items-start gap-2 rounded-lg bg-[hsl(var(--color-card))] p-4">
                <Shield className="mt-0.5 h-4 w-4 flex-shrink-0 text-text-light" />
                <p className="text-xs text-text-light">
                  By continuing, you agree to our{' '}
                  <a href="/terms" className="text-primary hover:text-primary-dark">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-primary hover:text-primary-dark">
                    Privacy Policy
                  </a>
                  .
                </p>
              </div>

              <button
                type="submit"
                className="btn-primary w-full"
                disabled={loading || Object.keys(errors).length > 0}
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <span className="mr-2 h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></span>
                    Creating account...
                  </span>
                ) : (
                  'Create Account'
                )}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default OnboardingForm;