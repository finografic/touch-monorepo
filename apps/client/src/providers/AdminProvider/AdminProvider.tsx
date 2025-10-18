import type { AdminProviderProps } from 'providers/AdminProvider/AdminContext.types';
import { AdminContext as Admin, DISPLAY_NAME } from './AdminContext';

export const AdminProvider = ({ initialValue, children }: AdminProviderProps) => {
  return <Admin.Provider initialValue={initialValue}>{children}</Admin.Provider>;
};

AdminProvider.displayName = `${DISPLAY_NAME}Provider`;
