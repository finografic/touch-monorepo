import type { ReactNode } from 'react';
import type { OrdersKeys } from './OrdersContext';
import type { OrderItem } from 'types/orders.types';

export interface OrdersValues {
  [OrdersKeys.orders]: OrderItem[];
}

type OrdersSetters = {
  [K in keyof OrdersValues as `set${Capitalize<string & K>}`]: (val: OrdersValues[K]) => void;
};

type OrdersActions = OrdersSetters & {
  togglePad: (itemNumber: number) => void;
  selectAllPads: () => void;
};

export interface OrdersProviderProps {
  initialValue?: OrdersStore;
  children: ReactNode;
}

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}
