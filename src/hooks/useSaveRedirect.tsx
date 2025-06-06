import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persists the user's intended destination when they hit a protected route.
 * Stores the current pathname (and query string) in sessionStorage if unauthenticated.
 */
const useSaveRedirect = () => {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    }
  }, [user, loading, isDemo, location.pathname, location.search]);
};

export default useSaveRedirect;