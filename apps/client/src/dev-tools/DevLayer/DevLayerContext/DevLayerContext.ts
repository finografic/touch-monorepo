import React from 'react';
import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createZustandContext } from 'utils/zustand';
import type { DevLayerStore, DevLayerValues } from './DevLayer.types';

export enum DevLayerKeys {
  isToolbarOpen = 'isToolbarOpen',
}

const defaultValue: DevLayerValues = {
  isToolbarOpen: true,
};

export const DevLayer = createZustandContext(({ initialValue }) => {
  return createStore<DevLayerStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      resetHeader: () => {
        set((state) => ({
          ...state,
          headerButton: null,
          isHiddenBreadcrumbs: false,
        }));
      },
      setIsToolbarOpen: (value: boolean) => {
        set({ isToolbarOpen: value });
      },
    },
  }));
});

// Define return type that includes all state and actions
type DevLayerReturn = Omit<DevLayerStore, 'actions'> & DevLayerStore['actions'];

export const useDevLayer = (): DevLayerReturn => {
  const store = DevLayer.useContext();
  if (!store) {
    throw new Error('useDevLayer must be used within a DevLayerProvider');
  }

  store.subscribe((state, prev) => {
    // log('__PAGE_CHANGE - DevLayer.hooks Event', 'grey', { state, prev });
  });

  return useStore<StoreApi<DevLayerStore>, DevLayerReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
