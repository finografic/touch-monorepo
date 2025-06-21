import { useLocation } from 'react-router-dom';
import { AdminContext as Admin, DISPLAY_NAME } from './AdminContext';
import { FrontEndAdminTools } from 'admin-tools/FrontEndAdminTools';
import { AdminTools } from 'admin-tools/AdminTools';
import type { AdminProviderProps } from 'providers/AdminProvider/AdminContext.types';

export const AdminProvider = ({ initialValue, children }: AdminProviderProps) => {
  const location = useLocation();

  return (
    <Admin.Provider initialValue={initialValue}>
      {children}
      {location.pathname.startsWith('/admin') ? <AdminTools /> : <FrontEndAdminTools />}
    </Admin.Provider>
  );
};

AdminProvider.displayName = `${DISPLAY_NAME}Provider`;
