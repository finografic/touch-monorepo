import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { createSetters, createZustandContext } from '@finografic/zustand-context-creator';
import type { OrderFilters } from 'types/filters.types';
import type { FilterKey } from 'types/slots.types';
import type { FiltersStore, FiltersValues } from './FiltersContext.types';

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
          setFilter: (key: keyof OrderFilters | FilterKey, value: unknown) => {
            set((state) => ({
              filters: { ...state.filters, [key]: value },
            }));
          },
          clearFilter: (key: keyof OrderFilters | FilterKey) => {
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
