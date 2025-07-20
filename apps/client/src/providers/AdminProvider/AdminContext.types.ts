import type { ReactNode } from 'react';
import type { AdminKeys, SETTER_PREFIX } from './AdminContext';
import type { CreateSettersType } from 'utils/zustand';

export interface AdminValues {
  [AdminKeys.isAdminToolsVisible]: boolean;
  [AdminKeys.isAdminToolsDialogOpen]: boolean;
  [AdminKeys.isLanguageDialogOpen]: boolean;
  [AdminKeys.isTimerVisible]: boolean;
}

type AdminSetters = CreateSettersType<AdminValues, typeof SETTER_PREFIX>;

type AdminActions = AdminSetters & {};

export interface AdminProviderProps {
  initialValue?: AdminStore;
  children: ReactNode;
}

export interface AdminStore extends AdminValues {
  actions: AdminActions;
}
