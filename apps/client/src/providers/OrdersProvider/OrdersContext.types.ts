import type { ReactNode } from 'react';
import type { OrdersKeys, SETTER_PREFIX } from './OrdersContext';
import type { SlotType, OrderItem } from 'types/orders.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import type { CreateSettersType } from 'utils/zustand';
import type { OrderItemConfig } from 'utils/slot-config.utils';

export interface OrdersValues {
  [OrdersKeys.orders]: OrderItem[];
  [OrdersKeys.profile]: OrderReadableModel | null;
  [OrdersKeys.ordersReadable]: OrderReadableModel[];
  [OrdersKeys.filters]: OrderFilters;
}

// Auto-generated setters for OrdersValues
type OrdersSetters = CreateSettersType<OrdersValues, typeof SETTER_PREFIX>;

// The single source of truth for Orders actions
// This type must match the actions implemented in OrdersContext.ts
// If you add/remove actions in the context, update this type accordingly
export type OrdersActions = OrdersSetters & {
  setProfile: (profile: OrderReadableModel | null) => void;
  fetchOrderWithProfiles: (orderId: string) => Promise<OrderReadableModel>;
  setFilters: (filters: OrderFilters) => void;
  // setOrderFilters: (filters: OrderFilters) => void;
  setOrdersFilter: ({ itemNumber, filter }: { itemNumber: number; filter: Partial<OrderFilters> }) => void;
  toggleOrder: ({ slotType, itemNumber }: { slotType: SlotType; itemNumber: number }) => void;
  selectAllOrders: (config?: OrderItemConfig[]) => void;
  updateOrderIds: ({ ids }: { ids: string[] }) => void;
  setOrdersSession: ({
    slotNumbers,
    session,
  }: {
    slotNumbers: number[];
    session: { id: string; flowType: FlowTypeValue };
  }) => void;
  fetchOrdersReadable: () => Promise<void>;
};

export interface OrdersStore extends OrdersValues {
  actions: OrdersActions;
}

export interface OrdersProviderProps {
  initialValue?: OrdersStore;
  children: ReactNode;
}
