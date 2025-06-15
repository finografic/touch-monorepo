import type { ReactNode } from 'react';
import type { OrdersKeys, SETTER_PREFIX } from './OrdersContext';
import type { ItemType, OrderItem } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';

export type TimerActionType = 'start' | 'complete' | 'reset' | 'clear_all';

export interface TimerActionPayload {
  itemNumber: number;
  duration?: number;
}

export interface OrdersValues {
  [OrdersKeys.orders]: OrderItem[];
}

type OrdersSetters = {
  [K in keyof OrdersValues as OrdersValues[K] extends boolean
    ? `set${Capitalize<string & K>}`
    : `set${typeof SETTER_PREFIX}${Capitalize<string & K>}`]: (val: OrdersValues[K]) => void;
};

type OrdersActions = OrdersSetters & {
  setOrdersFilter: ({ itemNumber, filter }: { itemNumber: number; filter: Partial<OrderFilters> }) => void;
  setOrderProcessing: ({
    itemNumber,
    duration,
    preserveSelection,
  }: {
    itemNumber: number;
    duration: number;
    preserveSelection?: boolean;
  }) => void;
  toggleOrder: ({ itemType, itemNumber }: { itemType: ItemType; itemNumber: number }) => void;
  selectAllOrders: () => void;
  // Timer-specific actions
  timerAction: (type: TimerActionType, payload: TimerActionPayload) => void;
};

export interface OrdersProviderProps {
  initialValue?: OrdersStore;
  children: ReactNode;
}

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}
