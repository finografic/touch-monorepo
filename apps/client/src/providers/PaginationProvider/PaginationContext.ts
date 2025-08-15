import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/shallow';
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
    subscribeWithSelector(
      (set, get): PaginationStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setIsPrevDisabled: (isPrevDisabled: boolean) => {
            if (get().isPrevDisabled !== isPrevDisabled) {
              set({ isPrevDisabled });
            }
          },
          setIsNextDisabled: (isNextDisabled: boolean) => {
            if (get().isNextDisabled !== isNextDisabled) {
              set({ isNextDisabled });
            }
          },
        },
      }),
    ),
  );
});

type PaginationReturn = Omit<PaginationStore, 'actions'> & PaginationStore['actions'];

export const usePagination = (): PaginationReturn => {
  const store = PaginationContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<PaginationStore>, PaginationReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
