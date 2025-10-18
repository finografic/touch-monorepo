import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from 'utils/zustand';

import type { ContentStore, ContentValues } from './ContentContext.types';

export const DISPLAY_NAME = 'Content';
export const SETTER_PREFIX = 'Content';

export enum ContentKeys {
  title = 'title',
}

export const defaultValue: ContentValues = {
  title: '',
};

export const ContentContext = createZustandContext(({ initialValue }) => {
  return createStore<ContentStore>()(
    subscribeWithSelector(
      (set, _get): ContentStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
        },
      }),
    ),
  );
});

type ContentReturn = Omit<ContentStore, 'actions'> & ContentStore['actions'];

export const useContent = (): ContentReturn => {
  const store = ContentContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<ContentStore>, ContentReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
