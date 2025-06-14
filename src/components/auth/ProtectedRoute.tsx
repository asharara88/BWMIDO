import { Navigate } from 'react-router-dom';
import { useAuthGuard } from '../../hooks/useAuthGuard';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface ProtectedRouteProps {
  children: React.ReactNode;
  /**
   * Path to redirect unauthenticated users to. Defaults to "/login".
   */
  redirectPath?: string;
}

const ProtectedRoute = ({
  children,
  redirectPath = '/login',
}: ProtectedRouteProps) => {
  const { isAuthenticated, isLoading, isDemo } = useAuthGuard(redirectPath);

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
    // Log redirect for debugging purposes
    if (process.env.NODE_ENV !== 'production') {
      console.debug('ProtectedRoute redirect:', redirectPath);
    }
    return <Navigate to={redirectPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
