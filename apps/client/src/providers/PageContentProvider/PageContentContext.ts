import { createStore, useStore, type StoreApi } from 'zustand';
import { createZustandContext } from 'utils/zustand';
import type { PageContentStore, PageContentValues } from './PageContent.types';
import { createSetters } from 'utils/zustand';

export const DISPLAY_NAME = 'PageContent';

export enum PageContentKeys {
  title = 'title',
}

export const defaultValue: PageContentValues = {
  title: '',
};

export const PageContentContext = createZustandContext(({ initialValue }) => {
  return createStore<PageContentStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: 'PageContent', defaultValue }),
    },
  }));
});

type PageContentReturn = Omit<PageContentStore, 'actions'> & PageContentStore['actions'];

export const usePageContent = (): PageContentReturn => {
  const store = PageContentContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // log('__STORE_CHANGE Event', 'grey', 'grey', { state, prev });
  });

  return useStore<StoreApi<PageContentStore>, PageContentReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
