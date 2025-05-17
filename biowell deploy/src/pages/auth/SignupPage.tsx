import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { AlertCircle, Check } from 'lucide-react';
import Logo from '../../components/common/Logo';
import SignUpCard from '../../components/auth/SignUpCard';

const SignupPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();
  const navigate = useNavigate();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    try {
      const { error: signUpError } = await signUp(email, password);
      
      if (signUpError) {
        if (signUpError.message === 'User already registered') {
          setError('This email is already registered. Please sign in instead.');
          return;
        }
        throw new Error(signUpError.message);
      }
      
      navigate('/dashboard');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center bg-background-alt px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex justify-center">
            <Logo className="h-8" />
          </div>
          <h1 className="text-2xl font-bold text-text">Create your account</h1>
          <p className="mt-2 text-text-light">
            Start your health optimization journey today
          </p>
        </div>
        
        {error && (
          <div className="mb-6 flex items-center gap-2 rounded-lg bg-error/10 p-3 text-sm text-error">
            <AlertCircle className="h-5 w-5" />
            <span>
              {error}
              {error === 'This email is already registered. Please sign in instead.' && (
                <Link to="/login" className="ml-1 font-medium text-primary hover:text-primary-dark">
                  Sign in here
                </Link>
              )}
            </span>
          </div>
        )}
        
        <SignUpCard />
        
        <div className="mt-6 text-center text-sm text-text-light">
          Already have an account?{' '}
          <Link to="/login" className="font-medium text-primary hover:text-primary-dark">
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;