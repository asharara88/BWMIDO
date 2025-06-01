import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading } = useAuthGuard();
  useSaveRedirect(isAuthenticated);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading...</div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;