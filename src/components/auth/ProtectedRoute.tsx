import { Navigate, useLocation } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isDemo } = useAuthGuard(); // Make sure your hook returns isDemo if needed
  const location = useLocation();

  // Save redirect URL if not authenticated and not in demo mode
  useSaveRedirect(isAuthenticated);
  // If your useSaveRedirect hook does not handle isDemo, you can use this effect instead:
  // useEffect(() => {
  //   if (!isAuthenticated && !isLoading && !isDemo) {
  //     sessionStorage.setItem('redirectUrl', location.pathname);
  //   }
  // }, [isAuthenticated, isLoading, isDemo, location]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">Loading...</div>
    );
  }

  if (!isAuthenticated && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
