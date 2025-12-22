import type { AdminRouteConfig, AuthRoles } from 'admin/config/admin.routes.map';
import { useAuth } from 'providers/AuthProvider';
import { Navigate, Outlet } from 'react-router-dom';

export const AdminRouteRenderer: React.FC<{ entry: AdminRouteConfig }> = ({ entry }) => {
  const { isAuthenticated } = useAuth();
  const role: AuthRoles = isAuthenticated ? 'admin' : 'public';

  const Component = entry.element[role];

  // No access at all
  if (!Component) {
    return <Navigate to="/admin" replace />;
  }

  // Feature parent — let router continue
  if (Component === Outlet) {
    return <Outlet />;
  }

  // Leaf page — render it
  return <Component />;
};
