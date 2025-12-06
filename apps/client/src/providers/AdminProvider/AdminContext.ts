import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import type { AdminStore, AdminValues } from 'providers/AdminProvider/AdminContext.types';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';

export const DISPLAY_NAME = 'Admin';
export const SETTER_PREFIX = '';

export enum AdminKeys {
  isAdminToolsVisible = 'isAdminToolsVisible',
  isAdminToolsDialogOpen = 'isAdminToolsDialogOpen',
  isLanguageDialogOpen = 'isLanguageDialogOpen',
}

export const defaultValue: AdminValues = {
  isAdminToolsVisible: true,
  isAdminToolsDialogOpen: false,
  isLanguageDialogOpen: false,
};

export const AdminContext = createZustandContext(({ initialValue }) => {
  return createStore<AdminStore>()(
    subscribeWithSelector(
      (set, _get): AdminStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
        },
      }),
    ),
  );
});

type AdminReturn = Omit<AdminStore, 'actions'> & AdminStore['actions'];

export const useAdmin = (): AdminReturn => {
  const store = AdminContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<AdminStore>, AdminReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
