import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
codex/implement-usesaveredirect-and-usesupplementfilter-hooks
 * Persist the current path so the user can be redirected
 * after successful authentication.
 */
export default function useSaveRedirect() {

 * Persists the user's intended destination when they hit a protected route.
 * Stores the current pathname (and query string) in sessionStorage if unauthenticated.
 */
const useSaveRedirect = () => {
main
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useEffect(() => {
    if (!user && !loading && !isDemo) {
      sessionStorage.setItem('redirectUrl', location.pathname + location.search);
    }
  }, [user, loading, isDemo, location.pathname, location.search]);
codex/implement-usesaveredirect-and-usesupplementfilter-hooks
}

};

export default useSaveRedirect;
main
