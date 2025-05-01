import type { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from 'auth/AuthContext';

export function RequireAuth({ children }: { children: ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
