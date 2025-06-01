import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persists the user's intended destination when they hit a protected route.
 * Stores the current pathname in sessionStorage if unauthenticated.
 */
export function useSaveRedirect() {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, isDemo, location.pathname]);
}

