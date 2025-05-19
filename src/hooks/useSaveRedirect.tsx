import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';

export default function useSaveRedirect(user: User | null, loading: boolean): void {
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [user, loading, location.pathname]);
}
