import type { ReactNode } from 'react';
import { PaginationKeys } from './PaginationContext';

export type PaginationValues = {
  [PaginationKeys.total]: number;
  [PaginationKeys.current]: number;
  [PaginationKeys.isNextDisabled]: boolean;
};

type PaginationSetters = {
  [K in keyof PaginationValues as `setPage${Capitalize<string & K>}`]: (val: PaginationValues[K]) => void;
};

type PaginationActions = PaginationSetters & {
  setIsNextDisabled: (isNextDisabled: boolean) => void;
};

export type PaginationProviderProps = {
  initialValue?: PaginationStore;
  children: ReactNode;
};

export interface PaginationStore extends PaginationValues {
  actions: PaginationActions;
}
