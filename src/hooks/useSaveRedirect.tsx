import { useEffect } from "react";
import { useLocation } from "react-router-dom";

/**
 * Persists the user's intended destination when they hit a protected route.
 * Stores the current pathname (and query string) in sessionStorage if unauthenticated.
 */
export default function useSaveRedirect() {
  const location = useLocation();

  useEffect(() => {
    const currentPath = location.pathname + location.search;
    sessionStorage.setItem("redirectPath", currentPath);
  }, [location]);
}
