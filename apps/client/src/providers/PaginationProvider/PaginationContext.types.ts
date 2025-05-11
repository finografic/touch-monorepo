import type { ReactNode } from 'react';
import type { PaginationKeys, SETTER_PREFIX } from './PaginationContext';

export interface PaginationValues {
  [PaginationKeys.total]: number;
  [PaginationKeys.current]: number;
  [PaginationKeys.isPrevDisabled]: boolean;
  [PaginationKeys.isNextDisabled]: boolean;
}

type PaginationSetters = {
  [K in keyof PaginationValues as PaginationValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: PaginationValues[K]) => void;
};

type PaginationActions = PaginationSetters & {
  setIsPrevDisabled: (isPrevDisabled: boolean) => void;
  setIsNextDisabled: (isNextDisabled: boolean) => void;
};

export interface PaginationProviderProps {
  initialValue?: PaginationStore;
  children: ReactNode;
}

export interface PaginationStore extends PaginationValues {
  actions: PaginationActions;
}
