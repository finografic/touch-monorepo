import React from 'react';
import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from 'utils/zustand';

import type { DevGuidesStore, DevGuidesValues } from './DevGuides.types';

export const DISPLAY_NAME = 'DevGuides';
export const SETTER_PREFIX = '';

export enum DevGuidesKeys {
  isDevGuidesVisibile = 'isDevGuidesVisibile',
}

const defaultValue: DevGuidesValues = {
  isDevGuidesVisibile: false,
};

export const DevGuidesContext = createZustandContext(({ initialValue }) => {
  return createStore<DevGuidesStore>()(
    subscribeWithSelector((set, get) => ({
      ...defaultValue,
      ...initialValue,
      actions: {
        ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
      },
    })),
  );
});

// Define return type that includes all state and actions
type DevGuidesReturn = Omit<DevGuidesStore, 'actions'> & DevGuidesStore['actions'];

export const useDevGuides = (): DevGuidesReturn => {
  const store = DevGuidesContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((state, prev) => {
    // log('__PAGE_CHANGE - DevLayer.hooks Event', 'grey', { state, prev });
  });

  return useStore<StoreApi<DevGuidesStore>, DevGuidesReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
