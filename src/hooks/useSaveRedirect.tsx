import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Persist the current path so the user can be redirected
 * after successful authentication.
 */
export default function useSaveRedirect() {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    }
  }, [user, loading, isDemo, location.pathname, location.search]);
}
