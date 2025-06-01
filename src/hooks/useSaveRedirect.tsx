import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Saves the current path so we can redirect the user back after login.
 * It only runs when the user is unauthenticated and not loading.
 */
export default function useSaveRedirect(
  user: unknown,
  loading: boolean,
  isDemo: boolean
) {
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, isDemo, location.pathname]);
}
