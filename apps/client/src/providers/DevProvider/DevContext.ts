import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { DevStore, DevValues } from './DevContext.types';

export const DISPLAY_NAME = 'Dev';

export enum DevKeys {
  title = 'title',
  isDevDataVisible = 'isDevDataVisible',
  isDevQueryPanelOpen = 'isDevQueryPanelOpen',
}

export const defaultValue: DevValues = {
  title: '',
  isDevDataVisible: false,
  isDevQueryPanelOpen: false,
};

export const DevContext = createZustandContext(({ initialValue }) => {
  return createStore<DevStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: DISPLAY_NAME, defaultValue }),
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
    // log('__STORE_CHANGE Event', 'grey', 'grey', { state, prev });
  });

  return useStore<StoreApi<DevStore>, DevReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
