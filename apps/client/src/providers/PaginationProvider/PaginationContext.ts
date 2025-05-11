import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { PaginationStore, PaginationValues } from './PaginationContext.types';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Pagination';
export const SETTER_PREFIX = 'Page';

export enum PaginationKeys {
  total = 'total',
  current = 'current',
  isPrevDisabled = 'isPrevDisabled',
  isNextDisabled = 'isNextDisabled',
}

export const defaultValue: PaginationValues = {
  total: 5,
  current: 0,
  isPrevDisabled: true,
  isNextDisabled: true,
};

export const PaginationContext = createZustandContext(({ initialValue }) => {
  return createStore<PaginationStore>()(
    subscribeWithSelector((set, get) => ({
      ...defaultValue,
      ...initialValue,
      actions: {
        ...createSetters({ set, prefix: SETTER_PREFIX, defaultValue }),
        setIsPrevDisabled: (isPrevDisabled: boolean) => {
          if (get().isPrevDisabled !== isPrevDisabled) {
            setTimeout(() => {
              set({ isPrevDisabled });
            }, 0);
          }
        },
        setIsNextDisabled: (isNextDisabled: boolean) => {
          if (get().isNextDisabled !== isNextDisabled) {
            setTimeout(() => {
              set({ isNextDisabled });
            }, 0);
          }
        },
        // onBeforeNavigateNext: (fn?: () => void) => {
        //   fn?.();
        // },
      },
    })),
  );
});

type PaginationReturn = Omit<PaginationStore, 'actions'> & PaginationStore['actions'];

export const usePagination = (): PaginationReturn => {
  const store = PaginationContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  store.subscribe((_state, _prev) => {
    // log('__STORE_CHANGE Event', 'grey', 'grey', { _state, _prev });
  });

  return useStore<StoreApi<PaginationStore>, PaginationReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
