import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import useSaveRedirect from '../hooks/useSaveRedirect';

export interface ProtectedRouteProps {
  /**
   * Element visible only to authenticated users. Typically a page
   * component passed via the router's `element` prop.
   */
  element: ReactElement;
  /** Optional path to store for redirect handling */
  pathname?: string;
}

/**
 * Wrapper component that ensures its children are rendered only
 * when the user is authenticated or in demo mode. Otherwise it
 * redirects to the login page.
 */
const ProtectedRoute = ({ element, pathname }: ProtectedRouteProps): ReactElement => {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();
  // Save the requested path if the user is not authenticated.
  useSaveRedirect(pathname ?? location.pathname);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return element;
};

export default ProtectedRoute;
