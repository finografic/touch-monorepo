import type { ReactNode } from 'react';
import type { OrdersKeys, SETTER_PREFIX } from './OrdersContext';
import type { ItemType, OrderItem } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import type { CreateSettersType } from 'utils/zustand';

export type TimerActionType = 'start' | 'complete' | 'reset' | 'clear_all';

export interface TimerActionPayload {
  itemNumber: number;
  duration?: number;
}

export interface OrdersValues {
  [OrdersKeys.orders]: OrderItem[];
}

type OrdersSetters = CreateSettersType<OrdersValues, typeof SETTER_PREFIX>;

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
  updateOrderIds: ({ ids }: { ids: string[] }) => void;
  setOrdersSession: ({
    orderNumbers,
    session,
  }: {
    orderNumbers: number[];
    session: { id: string; flowType: FlowTypeValue };
  }) => void;
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
