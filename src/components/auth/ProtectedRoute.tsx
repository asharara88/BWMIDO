import { ReactNode, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

function useSaveRedirect(path: string, shouldSave: boolean) {
  useEffect(() => {
    if (shouldSave) {
      sessionStorage.setItem('redirectUrl', path);
    }
  }, [path, shouldSave]);
}

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { user, loading, isDemo } = useAuth();
  const location = useLocation();

  useSaveRedirect(location.pathname, !user && !loading && !isDemo);

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
