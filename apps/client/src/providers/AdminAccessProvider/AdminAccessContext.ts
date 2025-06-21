import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { AdminAccessStore } from 'providers/AdminAccessProvider/AdminAccessContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'AdminAccess';
export const SETTER_PREFIX = '';

export enum AdminAccessKeys {
  isAdminToolsVisible = 'isAdminToolsVisible',
  isAdminToolsDialogOpen = 'isAdminToolsDialogOpen',
  isLanguageDialogOpen = 'isLanguageDialogOpen',
  isTimerVisible = 'isTimerVisible',
}

export const defaultValue = {
  isAdminToolsVisible: true,
  isAdminToolsDialogOpen: false,
  isLanguageDialogOpen: false,
  isTimerVisible: true,
};

export const AdminAccessContext = createZustandContext(({ initialValue }) => {
  return createStore<AdminAccessStore>()(
    subscribeWithSelector(
      (set, _get): AdminAccessStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
        },
      }),
    ),
  );
});

type AdminAccessReturn = Omit<AdminAccessStore, 'actions'> & AdminAccessStore['actions'];

export const useAdminAccess = (): AdminAccessReturn => {
  const store = AdminAccessContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<AdminAccessStore>, AdminAccessReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
