import { createStore, useStore, type StoreApi } from 'zustand';
import { createZustandContext } from 'utils/zustand';
import type { PaginationStore, PaginationValues } from './Pagination.types';
import { createSetters } from 'utils/zustand';

export const DISPLAY_NAME = 'Pagination';

export enum PaginationKeys {
  total = 'total',
  current = 'current',
}

export const defaultValue: PaginationValues = {
  total: 5,
  current: 0,
};

export const PaginationContext = createZustandContext(({ initialValue }) => {
  return createStore<PaginationStore>((set, _get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, prefix: 'Page', defaultValue }),
    },
  }));
});

type PaginationReturn = Omit<PaginationStore, 'actions'> & PaginationStore['actions'];

export const usePagination = (): PaginationReturn => {
  const store = PaginationContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((state, prev) => {
    log('__STRORE_CHANGE Event', 'grey', 'grey', { state, prev });
  });

  return useStore<StoreApi<PaginationStore>, PaginationReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
