import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { FiltersStore, FiltersValues } from './FiltersContext.types';
import { subscribeWithSelector } from 'zustand/middleware';
import type { OrderFilters } from 'types/filters.types';
import type { FilterFieldKey } from 'types/orders.types';

export const DISPLAY_NAME = 'Filters';
export const SETTER_PREFIX = 'Filters';

export enum FiltersKeys {
  filters = 'filters',
}

export const defaultValue: FiltersValues = {
  filters: {},
};

export const FiltersContext = createZustandContext(({ initialValue }) => {
  return createStore<FiltersStore>()(
    subscribeWithSelector(
      (set, get): FiltersStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setFilter: (key: keyof OrderFilters | FilterFieldKey, value: unknown) => {
            set((state) => ({
              filters: { ...state.filters, [key]: value },
            }));
          },
          clearFilter: (key: keyof OrderFilters | FilterFieldKey) => {
            set((state) => {
              const { [key]: _, ...rest } = state.filters;
              return { filters: rest };
            });
          },
          clearFilters: () => {
            set({ filters: {} });
          },
        },
      }),
    ),
  );
});

type FiltersReturn = Omit<FiltersStore, 'actions'> & FiltersStore['actions'];

export const useFiltersContext = (): FiltersReturn => {
  const store = FiltersContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<FiltersStore>, FiltersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
