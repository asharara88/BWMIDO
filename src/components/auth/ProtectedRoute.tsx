import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * Wrapper component to guard authenticated routes.
 */
const ProtectedRoute = ({ children }: ProtectedRouteProps): JSX.Element => {
  const { user, loading, isDemo } = useAuth();

  useSaveRedirect(user, loading, isDemo);

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
