import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export default function useSaveRedirect(active: boolean, path?: string): void {
  const location = useLocation();
  const target = path ?? location.pathname;

  useEffect(() => {
    if (active) {
      sessionStorage.setItem('redirectUrl', target);
    }
  }, [active, target]);
}
