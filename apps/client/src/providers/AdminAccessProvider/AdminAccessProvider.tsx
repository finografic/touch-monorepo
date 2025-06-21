import { AdminAccessContext as AdminAccess, DISPLAY_NAME } from './AdminAccessContext';
import { AdminAccessTools } from '../../admin-tools/AdminAccessTools';
import type { AdminAccessProviderProps } from 'providers/AdminAccessProvider/AdminAccessContext.types';

export const AdminAccessProvider = ({ initialValue, children }: AdminAccessProviderProps) => {
  return (
    <AdminAccess.Provider initialValue={initialValue}>
      {children}
      <AdminAccessTools />
    </AdminAccess.Provider>
  );
};

AdminAccessProvider.displayName = `${DISPLAY_NAME}Provider`;
