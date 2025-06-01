import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persist the path a user attempted to access before authentication.
 * Stores the current location in sessionStorage when no user is logged in.
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
