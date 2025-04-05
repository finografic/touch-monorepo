import { Navigate } from 'react-router-dom';
import { useAuth } from 'lib/auth/AuthContext';

// Protected route wrapper
export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}
