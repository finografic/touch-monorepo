import { AdminContext as Admin, DISPLAY_NAME } from './AdminContext';
import { AdminTools } from 'components/AdminTools/AdminTools';
import type { AdminProviderProps } from 'providers/AdminProvider/AdminContext.types';

export const AdminProvider = ({ initialValue, children }: AdminProviderProps) => {
  return (
    <Admin.Provider initialValue={initialValue}>
      {children}
      <AdminTools />
    </Admin.Provider>
  );
};

AdminProvider.displayName = `${DISPLAY_NAME}Provider`;
