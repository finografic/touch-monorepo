import type { ReactNode } from 'react';
import type { AdminAccessKeys, SETTER_PREFIX } from './AdminAccessContext';

export interface AdminAccessValues {
  [AdminAccessKeys.isAdminToolsVisible]: boolean;
  [AdminAccessKeys.isAdminToolsDialogOpen]: boolean;
  [AdminAccessKeys.isLanguageDialogOpen]: boolean;
  [AdminAccessKeys.isTimerVisible]: boolean;
}

type AdminAccessSetters = {
  [K in keyof AdminAccessValues as AdminAccessValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: AdminAccessValues[K]) => void;
};

type AdminAccessActions = AdminAccessSetters & {};

export interface AdminAccessProviderProps {
  initialValue?: AdminAccessStore;
  children: ReactNode;
}

export interface AdminAccessStore extends AdminAccessValues {
  actions: AdminAccessActions;
}
