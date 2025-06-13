import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { DevStore, DevValues } from './DevContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Dev';
export const SETTER_PREFIX = '';

export enum DevKeys {
  isDevToolsVisible = 'isDevToolsVisible',
  isDevQueryPanelOpen = 'isDevQueryPanelOpen',
  isDevDataVisible = 'isDevDataVisible',
  isDevScreenSizeVisible = 'isDevScreenSizeVisible',
}

export const defaultValue: DevValues = {
  isDevToolsVisible: process.env.NODE_ENV === 'development',
  isDevQueryPanelOpen: false,
  isDevDataVisible: false,
  isDevScreenSizeVisible: false,
};

export const DevContext = createZustandContext(({ initialValue }) => {
  return createStore<DevStore>()(
    subscribeWithSelector(
      (set, _get): DevStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
        },
      }),
    ),
  );
});

type DevReturn = Omit<DevStore, 'actions'> & DevStore['actions'];

export const useDev = (): DevReturn => {
  const store = DevContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<DevStore>, DevReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
