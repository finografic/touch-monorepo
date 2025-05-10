import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { DevStore, DevValues } from './DevContext.types';

export const DISPLAY_NAME = 'Dev';
export const SETTER_PREFIX = '';

export enum DevKeys {
  isDevToolsVisible = 'isDevToolsVisible',
  isDevQueryPanelOpen = 'isDevQueryPanelOpen',
  isDevDialogOpen = 'isDevDialogOpen',
  isDevDataVisible = 'isDevDataVisible',
}

export const defaultValue: DevValues = {
  isDevToolsVisible: process.env.NODE_ENV === 'development',
  isDevQueryPanelOpen: false,
  isDevDataVisible: true,
  isDevDialogOpen: false,
};

export const DevContext = createZustandContext(({ initialValue }) => {
  return createStore<DevStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: SETTER_PREFIX, defaultValue }),
    },
  }));
});

type DevReturn = Omit<DevStore, 'actions'> & DevStore['actions'];

export const useDev = (): DevReturn => {
  const store = DevContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<DevStore>, DevReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
