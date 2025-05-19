import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/**
 * Persists the current location so the user can be redirected
 * after successful authentication.
 */

export default function useSaveRedirect(shouldSave: boolean, pathname?: string) {
  const location = useLocation();

  useEffect(() => {
    if (shouldSave) {
      const target = pathname || location.pathname;
      sessionStorage.setItem('redirectUrl', target);
    }
  }, [shouldSave, pathname, location]);
}
