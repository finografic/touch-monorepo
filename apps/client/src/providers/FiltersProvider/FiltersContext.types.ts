import type { ReactNode } from 'react';
import type { FiltersKeys, SETTER_PREFIX } from './FiltersContext';
import type { CreateSettersType } from 'utils/zustand';
import type { OrderFilters } from 'types/filters.types';

export interface FiltersValues {
  [FiltersKeys.filters]: OrderFilters;
}

type FiltersSetters = CreateSettersType<FiltersValues, typeof SETTER_PREFIX>;

type FiltersActions = FiltersSetters & {
  setFilter: (key: keyof OrderFilters, value: unknown) => void;
  clearFilter: (key: keyof OrderFilters) => void;
  clearFilters: () => void;
};

export interface FiltersProviderProps {
  initialValue?: FiltersStore;
  children: ReactNode;
}

export interface FiltersStore extends FiltersValues {
  actions: FiltersActions;
}
