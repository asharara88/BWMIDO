import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persist the desired navigation path for unauthenticated users.
 * Stores the current pathname in sessionStorage so that after login
 * the user can be redirected back to the original route.
 */
export default function useSaveRedirect() {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, isDemo, location.pathname]);
}

