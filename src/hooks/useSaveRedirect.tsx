import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

/**
 * Persist the intended redirect URL for unauthenticated users.
 */
export default function useSaveRedirect(
  user: User | null,
  loading: boolean,
  isDemo: boolean
) {
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, isDemo, location]);
}
