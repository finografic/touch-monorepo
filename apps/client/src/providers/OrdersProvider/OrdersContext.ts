import { useEffect } from 'react';
import { createStore, type StoreApi, useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM, ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { ItemType, OrderFieldKey, OrderStatus } from 'types/orders.types';
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
}

export const defaultValue: OrdersValues = {
  orders: [],
  profile: null,
  ordersReadable: [],
};

export const OrdersContext = createZustandContext(({ initialValue }) => {
  log('__DEV: OrdersContext', 'cyan', initialValue);
  return createStore<OrdersStore>()(
    subscribeWithSelector(
      (set, get): OrdersStore => ({
        ...defaultValue,
        ...initialValue,
        actions: {
          ...createSetters({ set, defaultValue, prefix: SETTER_PREFIX }),
          setOrdersFilter: ({
            itemNumber,
            filter,
          }: {
            itemNumber: number;
            filter: Partial<OrderFilters>;
          }) => {
            const { orders } = get();

            // Update the specific order's filters
            const updatedOrders = orders.map((order) => {
              if (order.itemNumber === itemNumber) {
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
          setOrderProcessing: ({
            itemNumber,
            duration,
            preserveSelection = false,
          }: {
            itemNumber: number;
            duration: number;
            preserveSelection?: boolean;
          }) => {
            const { orders } = get();
            const updatedOrders = orders.map((order) => {
              if (order.itemNumber === itemNumber) {
                const estimatedCompletionTime = new Date(Date.now() + duration * 1000).toISOString();
                return {
                  ...order,
                  isSelected: preserveSelection ? order.isSelected : false,
                  process: {
                    status: duration > 0 ? ('processing' as OrderStatus) : ('completed' as OrderStatus),
                    estimatedCompletionTime: duration > 0 ? estimatedCompletionTime : undefined,
                    timeRemaining: duration > 0 ? duration : undefined,
                  },
                };
              }
              return order;
            });
            set({ orders: updatedOrders });
          },
          toggleOrder: ({ itemType, itemNumber }: { itemType: ItemType; itemNumber: number }) => {
            const { orders } = get();
            const existingOrder = findOrderByNumber(orders, itemNumber);

            if (!existingOrder) {
              // Create new order if it doesn't exist
              const newOrders = [
                ...orders,
                {
                  ...INITIAL_ORDER_ITEM,
                  id:
                    typeof crypto !== 'undefined' && crypto.randomUUID
                      ? crypto.randomUUID()
                      : `order-${itemNumber}`,
                  itemType,
                  itemNumber,
                  isSelected: true,
                },
              ];
              const sortedOrders = [...newOrders].sort((a, b) => a.itemNumber - b.itemNumber);
              set({ orders: sortedOrders });
            } else {
              // Toggle isSelected for existing order instead of removing it
              const updatedOrders = orders.map((order) => {
                if (order.itemNumber === itemNumber) {
                  return { ...order, isSelected: !order.isSelected };
                }
                return order;
              });

              set({ orders: updatedOrders });
            }
          },
          selectAllOrders: (config: OrderItemConfig[] = ORDER_ITEMS_CONFIG) => {
            const newOrders = config.map(({ itemType, number }) => ({
              ...INITIAL_ORDER_ITEM,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order-${number}`,
              itemType,
              itemNumber: number,
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
            orderNumbers,
            session,
          }: {
            orderNumbers: number[];
            session: { id: string; flowType: FlowTypeValue };
          }) => {
            const { orders } = get();

            const updatedOrders = orders.map((order) => {
              if (orderNumbers.includes(order.itemNumber)) {
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

  // Subscribe to order status changes using useEffect to avoid infinite loops
  useEffect(() => {
    const unsubscribe = store.subscribe(
      (state) =>
        // Only track minimal necessary data
        state.orders.map((order) => ({
          number: order.itemNumber,
          status: order.process.status,
        })),
      (current, prev) => {
        if (typeof window === 'undefined') return;

        // Find orders that have changed status
        current.forEach((curr) => {
          const previous = prev.find((p) => p.number === curr.number);

          if (previous && curr.status !== previous.status) {
            // Only log status changes
            // console.debug(`Order ${curr.number}: ${previous.status} -> ${curr.status}`);

            // If changed from processing, handle cleanup
            if (previous.status === 'processing' && window.__timerIntervals) {
              const timerId = window.__timerIntervals[curr.number];
              if (timerId) {
                clearInterval(timerId);
                delete window.__timerIntervals[curr.number];
                console.debug(`Cleaned up timer for order ${curr.number}`);
              }
            }
          }
        });

        // Handle removed orders
        prev.forEach((previous) => {
          if (
            !current.some((c) => c.number === previous.number) &&
            previous.status === 'processing' &&
            window.__timerIntervals?.[previous.number]
          ) {
            clearInterval(window.__timerIntervals[previous.number]);
            delete window.__timerIntervals[previous.number];
            console.debug(`Cleaned up timer for removed order ${previous.number}`);
          }
        });
      },
    );

    return unsubscribe;
  }, [store]);

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

  // Subscribe to order status changes using useEffect to avoid infinite loops
  useEffect(() => {
    const unsubscribe = store.subscribe(
      (state) =>
        state.orders.map((order) => ({
          number: order.itemNumber,
          status: order.process.status,
        })),
      (current, prev) => {
        if (typeof window === 'undefined') return;

        current.forEach((curr) => {
          const previous = prev.find((p) => p.number === curr.number);

          if (previous && curr.status !== previous.status) {
            if (previous.status === 'processing' && window.__timerIntervals) {
              const timerId = window.__timerIntervals[curr.number];
              if (timerId) {
                clearInterval(timerId);
                delete window.__timerIntervals[curr.number];
                console.debug(`Cleaned up timer for order ${curr.number}`);
              }
            }
          }
        });

        prev.forEach((previous) => {
          if (
            !current.some((c) => c.number === previous.number) &&
            previous.status === 'processing' &&
            window.__timerIntervals?.[previous.number]
          ) {
            clearInterval(window.__timerIntervals[previous.number]);
            delete window.__timerIntervals[previous.number];
            console.debug(`Cleaned up timer for removed order ${previous.number}`);
          }
        });
      },
    );

    return unsubscribe;
  }, [store]);

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(
    store,
    useShallow(({ actions, ...state }) => ({
      ...state,
      ...actions,
    })),
  );
};
