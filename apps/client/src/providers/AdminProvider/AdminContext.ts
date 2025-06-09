import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { AdminStore } from 'providers/AdminProvider/AdminContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Admin';
export const SETTER_PREFIX = '';

export enum AdminKeys {
  isAdminToolsVisible = 'isAdminToolsVisible',
  isTimerVisible = 'isTimerVisible',
}

export const defaultValue = {
  isAdminToolsVisible: true,
  isTimerVisible: true,
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

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<AdminStore>, AdminReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
