import { ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: ReactNode;
  pathname?: string;
}

/**
 * Guard routes based on authentication state.
 * Stores the attempted path for redirect after login.
 */
export default function ProtectedRoute({ children, pathname }: ProtectedRouteProps) {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useSaveRedirect(!user && !loading && !isDemo, pathname || location.pathname);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
