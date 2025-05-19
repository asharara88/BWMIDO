import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persists the desired navigation target when an unauthenticated
 * user attempts to access a protected route. The value is stored
 * in session storage so it can be used after login.
 */
const useSaveRedirect = (path?: string): void => {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();
  const target = path ?? location.pathname;

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', target);
    }
  }, [user, loading, isDemo, target]);
};

export default useSaveRedirect;
