import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

/**
 * Component to handle authentication errors globally
 * This component should be mounted at the app level to catch and handle auth errors
 */
const AuthErrorHandler = () => {
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Function to handle API response errors
    const handleApiResponse = async (response: Response) => {
      // Check if the response is from Supabase auth endpoint
      if (response.url.includes('/auth/v1/') && !response.ok) {
        try {
          const errorData = await response.clone().json();
          
          // Handle specific auth errors
          if (response.status === 400 && 
              (errorData.error?.includes('Invalid Refresh Token') || 
               errorData.error?.includes('Refresh Token Not Found'))) {
            console.error('Auth error detected:', errorData.error);
            
            // Try to refresh the session
            try {
              await refreshSession();
            } catch (refreshError) {
              // If refresh fails, redirect to login
              console.error('Session refresh failed:', refreshError);
              navigate('/login', { replace: true });
            }
          }
        } catch (parseError) {
          console.error('Error parsing API response:', parseError);
        }
      }
    };

    // Create a fetch interceptor
    const originalFetch = window.fetch;
    window.fetch = async function(input, init) {
      const response = await originalFetch(input, init);
      await handleApiResponse(response);
      return response;
    };

    // Cleanup function to restore original fetch
    return () => {
      window.fetch = originalFetch;
    };
  }, [refreshSession, navigate]);

  // This component doesn't render anything
  return null;
};

export default AuthErrorHandler;