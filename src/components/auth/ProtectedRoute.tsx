import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import useSaveRedirect from '../../hooks/useSaveRedirect';

interface Props {
  children: JSX.Element;
}

const ProtectedRoute = ({ children }: Props): JSX.Element => {
  const { user, loading, isDemo } = useAuth();

  useSaveRedirect(user, loading);

  if (loading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!user && !isDemo) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
