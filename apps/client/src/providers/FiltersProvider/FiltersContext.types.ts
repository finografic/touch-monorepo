import type { ReactNode } from 'react';
import type { FiltersKeys, SETTER_PREFIX } from './FiltersContext';
import type { CreateSettersType } from 'utils/zustand';
import type { OrderFilters } from 'types/filters.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';

export interface FiltersValues {
  [FiltersKeys.filters]: OrderFilters;
}

type FiltersSetters = CreateSettersType<FiltersValues, typeof SETTER_PREFIX>;

type FiltersActions = FiltersSetters & {
  setFilter: (key: keyof OrderFilters, value: unknown) => void;
  clearFilter: (key: keyof OrderFilters) => void;
  clearFilters: () => void;
  // Filtering logic methods
  getDataPool: () => OrderReadableModel[];
  getDataFiltered: () => OrderReadableModel[];
  getServerFieldMap: () => Record<string, string>;
  getUniqueValues: () => Record<string, string[]>;
  getData: () => OrderReadableModel[];
};

export interface FiltersProviderProps {
  initialValue?: FiltersStore;
  children: ReactNode;
}

export interface FiltersStore extends FiltersValues {
  actions: FiltersActions;
}
