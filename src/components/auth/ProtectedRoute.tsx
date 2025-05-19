import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isDemo } = useAuth();
  useSaveRedirect();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading...</div>
    );
  }

  if (!user && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;

