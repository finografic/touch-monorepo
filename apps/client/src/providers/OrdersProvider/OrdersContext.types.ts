import type { ReactNode } from 'react';
import type { OrdersKeys, SETTER_PREFIX } from './OrdersContext';
import type { OrderItem } from 'types/orders.types';

export interface OrdersValues {
  [OrdersKeys.orders]: OrderItem[];
}

type OrdersSetters = {
  [K in keyof OrdersValues as OrdersValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: OrdersValues[K]) => void;
};

type OrdersActions = OrdersSetters & {
  toggleItem: (itemNumber: number) => void;
  selectAllPads: () => void;
};

export interface OrdersProviderProps {
  initialValue?: OrdersStore;
  children: ReactNode;
}

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}
