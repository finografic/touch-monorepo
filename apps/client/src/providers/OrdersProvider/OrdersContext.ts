import { api } from 'api';
import { createStore, type StoreApi, useStore } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { useShallow } from 'zustand/react/shallow';

import { findOrderByNumber } from 'utils/context.utils';
import type { SlotItemConfig } from 'utils/slot-config.utils';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import type { OrderReadableModel } from 'types/models/order-readable.model';
import type { FilterKey, SlotType } from 'types/slots.types';
import { INITIAL_SLOT_ITEM, ORDER_FIELD_KEYS, SLOT_ITEMS_CONFIG } from 'config/app';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';

export const DISPLAY_NAME = 'Orders';
export const SETTER_PREFIX = '';

export enum OrdersKeys {
  orders = 'orders',
  profile = 'profile',
  ordersReadable = 'ordersReadable',
  filters = 'filters',
}

export const defaultValue: OrdersValues = {
  orders: [],
  profile: null,
  ordersReadable: [],
  filters: {},
};

export const OrdersContext = createZustandContext(({ initialValue }) => {
  return createStore<OrdersStore>()(
    subscribeWithSelector(
      (set, get): OrdersStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),

          setProfile: (profile: OrderReadableModel | null) => {
            set({ profile });
          },

          fetchOrderWithProfiles: async (orderId: string): Promise<OrderReadableModel> => {
            try {
              const response = await api.get(`/orders-readable/${orderId}`);
              const fullOrder = response.data as OrderReadableModel;
              set({ profile: fullOrder }); // This will have temperatureProfiles + timeRows

              return fullOrder;
            } catch (error) {
              console.error('Failed to fetch order with profiles:', error);
            }
          },

          setFilters: (filters: OrderFilters) => {
            set({ filters });
          },

          setOrdersFilter: ({
            slotNumber,
            filter,
          }: {
            slotNumber: number;
            filter: Partial<OrderFilters>;
          }) => {
            const { orders } = get();

            // Update the specific order's filters
            const updatedOrders = orders.map((order) => {
              if (order.slotNumber === slotNumber) {
                const updatedFilters: OrderFilters = { ...order.filters };

                (Object.entries(filter) as [FilterKey, unknown][]).forEach(([key, value]) => {
                  if (value === undefined) {
                    delete updatedFilters[key as FilterKey];
                  } else {
                    (updatedFilters as Partial<Record<FilterKey, unknown>>)[key as FilterKey] = value;
                  }
                });

                const orderedFilters: OrderFilters = {} as OrderFilters;
                for (const key of ORDER_FIELD_KEYS) {
                  if (key in updatedFilters) {
                    (orderedFilters as Partial<Record<FilterKey, unknown>>)[key] = (
                      updatedFilters as Partial<Record<FilterKey, unknown>>
                    )[key];
                  }
                }

                return { ...order, filters: orderedFilters };
              }
              return order;
            });
            set({ orders: updatedOrders });
          },
          toggleSlot: ({ slotType, slotNumber }: { slotType: SlotType; slotNumber: number }) => {
            const { orders } = get();
            const existingOrder = findOrderByNumber(orders, slotNumber);

            if (!existingOrder) {
              // Create new order if it doesn't exist
              const newOrders = [
                ...orders,
                {
                  ...INITIAL_SLOT_ITEM,
                  id:
                    typeof crypto !== 'undefined' && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `order-${slotNumber}`,
                  slotType,
                  slotNumber,
                  isSelected: true,
                },
              ];
              const sortedOrders = [...newOrders].sort((a, b) => a.slotNumber - b.slotNumber);
              set({ orders: sortedOrders });
            } else {
              // Toggle isSelected for existing order instead of removing it
              const updatedOrders = orders.map((order) => {
                if (order.slotNumber === slotNumber) {
                  return { ...order, isSelected: !order.isSelected };
                }
                return order;
              });

              set({ orders: updatedOrders });
            }
          },
          selectAllOrders: (config: SlotItemConfig[] = SLOT_ITEMS_CONFIG) => {
            const newOrders = config.map(({ slotType, slotNumber }) => ({
              ...INITIAL_SLOT_ITEM,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID
                  ? crypto.randomUUID()
                  : `order-${slotNumber}`,
              slotType,
              slotNumber,
              isSelected: true,
            }));
            set({ orders: newOrders });
          },
          setOrdersSession: ({
            slotNumbers,
            session,
          }: {
            slotNumbers: number[];
            session: { id: string; flowType: FlowTypeValue };
          }) => {
            const { orders } = get();

            const updatedOrders = orders.map((order) => {
              if (slotNumbers.includes(order.slotNumber)) {
                return { ...order, session };
              }
              return order;
            });

            set({ orders: updatedOrders });
          },
          fetchOrdersReadable: async () => {
            try {
              const response = await api.get<{ data: OrderReadableModel[] }>('/orders-readable');
              // const readableOrders = response.data.data || response.data;
              // NEW: Ensure we always get an array, handling both response formats
              const readableOrders = Array.isArray(response.data.data)
                ? response.data.data
                : Array.isArray(response.data)
                  ? response.data
                  : [];
              set({ ordersReadable: readableOrders });
            } catch (error) {
              console.error('Failed to fetch orders readable data:', error);
              set({ ordersReadable: [] });
            }
          },
        },
      }),
    ),
  );
});

type OrdersReturn = Omit<OrdersStore, 'actions'> & OrdersStore['actions'];

export const useOrders = (): OrdersReturn => {
  const store = OrdersContext.useContext();
  if (!store) {
    throw new Error(`use${SETTER_PREFIX} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
