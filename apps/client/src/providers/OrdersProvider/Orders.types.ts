import type { ReactNode } from 'react';
import { OrdersKeys } from './OrdersContext';

// DB Schema types
export type BeverageType = {
  id: string;
  name: string;
  displayName: string;
  hasSubtypes: boolean;
  defaultConsumptionTemp: number;
  defaultFreezeTemp: number;
};

export type BeverageSubtype = {
  id: string;
  beverageTypeId: string;
  name: string;
  displayName: string;
  consumptionTemp: number;
  freezeTemp: number;
};

export type OrderItem = {
  padNumber: number;
  beverageType?: BeverageType;
  beverageSubtype?: BeverageSubtype;
};

export type OrdersValues = {
  [OrdersKeys.activePads]: Record<number, boolean>;
  [OrdersKeys.orders]: Record<number, OrderItem>;
};

type OrdersSetters = {
  [K in keyof OrdersValues as `set${Capitalize<string & K>}`]: (val: OrdersValues[K]) => void;
};

type OrdersActions = OrdersSetters & {
  handleNextStep: () => void;
};

export type OrdersProviderProps = {
  initialValue?: OrdersStore;
  children: ReactNode;
};

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}
