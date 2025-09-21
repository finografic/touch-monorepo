import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM, ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { OrderFieldKey, SlotType } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import { ORDER_FIELD_KEYS } from 'constants/app.config';
import { subscribeWithSelector } from 'zustand/middleware';
import type { OrderItemConfig } from 'utils/slot-config.utils';
import { api } from 'api';
import type { OrderReadableModel } from 'types/models/order-readable.model';

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

                (Object.entries(filter) as [OrderFieldKey, unknown][]).forEach(([key, value]) => {
                  if (value === undefined) {
                    delete updatedFilters[key as OrderFieldKey];
                  } else {
                    (updatedFilters as Partial<Record<OrderFieldKey, unknown>>)[key as OrderFieldKey] = value;
                  }
                });

                const orderedFilters: OrderFilters = {} as OrderFilters;
                for (const key of ORDER_FIELD_KEYS) {
                  if (key in updatedFilters) {
                    (orderedFilters as Partial<Record<OrderFieldKey, unknown>>)[key] = (
                      updatedFilters as Partial<Record<OrderFieldKey, unknown>>
                    )[key];
                  }
                }

                return { ...order, filters: orderedFilters };
              }
              return order;
            });
            set({ orders: updatedOrders });
          },
          toggleOrder: ({ slotType, slotNumber }: { slotType: SlotType; slotNumber: number }) => {
            const { orders } = get();
            const existingOrder = findOrderByNumber(orders, slotNumber);

            if (!existingOrder) {
              // Create new order if it doesn't exist
              const newOrders = [
                ...orders,
                {
                  ...INITIAL_ORDER_ITEM,
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
          selectAllOrders: (config: OrderItemConfig[] = ORDER_ITEMS_CONFIG) => {
            const newOrders = config.map(({ slotType, slotNumber }) => ({
              ...INITIAL_ORDER_ITEM,
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
          updateOrderIds: ({ ids }: { ids: string[] }) => {
            const { orders } = get();

            const updatedOrders =
              ids.length > 0
                ? orders.map((order) => ({ ...order, id: ids[0] })) // set "id" of order entry (first, if series)
                : orders.map((order) => ({ ...order }));

            set({ orders: updatedOrders });
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

// Optional version that returns null when OrdersProvider is not available
export const useOrdersOptional = (): OrdersReturn | null => {
  const store = OrdersContext.useContext();
  if (!store) {
    return null;
  }

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
