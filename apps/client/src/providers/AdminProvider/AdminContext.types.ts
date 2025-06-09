import type { ReactNode } from 'react';
import type { AdminKeys, SETTER_PREFIX } from './AdminContext';

export interface AdminValues {
  [AdminKeys.isAdminToolsVisible]: boolean;
  [AdminKeys.isAdminDialogOpen]: boolean;
  [AdminKeys.isTimerVisible]: boolean;
}

type AdminSetters = {
  [K in keyof AdminValues as AdminValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: AdminValues[K]) => void;
};

type AdminActions = AdminSetters & {};

export interface AdminProviderProps {
  initialValue?: AdminStore;
  children: ReactNode;
}

export interface AdminStore extends AdminValues {
  actions: AdminActions;
}
