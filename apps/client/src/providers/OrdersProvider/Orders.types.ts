import type { ReactNode } from 'react';
import { OrdersKeys } from './OrdersContext';
import { OrderItem } from '../../types/orders.types';

export type OrdersValues = {
  [OrdersKeys.orders]: OrderItem[];
};

type OrdersSetters = {
  [K in keyof OrdersValues as `set${Capitalize<string & K>}`]: (val: OrdersValues[K]) => void;
};

type OrdersActions = OrdersSetters & {
  togglePad: (itemNumber: number) => void;
  selectAllPads: () => void;
  handleNextStep: () => void;
};

export type OrdersProviderProps = {
  initialValue?: OrdersStore;
  children: ReactNode;
};

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}
