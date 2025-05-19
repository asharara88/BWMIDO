import { Routes, Route, Navigate } from 'react-router-dom';
import { SupabaseProvider } from './contexts/SupabaseContext';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';

import Layout from './components/layout/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import OnboardingPage from './pages/auth/OnboardingPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ChatPage from './pages/chat/ChatPage';
import SupplementsPage from './pages/supplements/SupplementsPage';
import CheckoutPage from './pages/checkout/CheckoutPage';
import ProfilePage from './pages/profile/ProfilePage';
import PricingPage from './pages/PricingPage';
import HowItWorksPage from './pages/HowItWorksPage';
import ProtectedRoute from './components/ProtectedRoute';

/**
 * Root application component.
 * Wraps routes with providers and applies authentication guards
 * where necessary.
 */
const protectedRoutes = [
  { path: 'dashboard', element: <DashboardPage /> },
  { path: 'chat', element: <ChatPage /> },
  { path: 'supplements', element: <SupplementsPage /> },
  { path: 'checkout', element: <CheckoutPage /> },
  { path: 'profile', element: <ProfilePage /> },
] as const;

function App(): JSX.Element {
  return (
    <SupabaseProvider>
      <ThemeProvider>
        <AuthProvider>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route index element={<HomePage />} />
              <Route path="login" element={<LoginPage />} />
              <Route path="signup" element={<SignupPage />} />
              <Route path="onboarding" element={<OnboardingPage />} />
              <Route path="pricing" element={<PricingPage />} />
              <Route path="how-it-works" element={<HowItWorksPage />} />
              {protectedRoutes.map(({ path, element }) => (
                <Route
                  key={path}
                  path={path}
                  element={<ProtectedRoute element={element} pathname={`/${path}`} />}
                />
              ))}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Route>
          </Routes>
        </AuthProvider>
      </ThemeProvider>
    </SupabaseProvider>
  );
}

export default App;

