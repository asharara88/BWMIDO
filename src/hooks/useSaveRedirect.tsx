import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSaveRedirect(isAuthenticated: boolean): void {
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      sessionStorage.setItem('redirectUrl', location.pathname);
    }
  }, [isAuthenticated, location]);
}
