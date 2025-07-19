import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues, TimerActionPayload, TimerActionType } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM, ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { ItemType, OrderFieldKey, OrderStatus } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
import type { FlowTypeValue } from 'types/flow.types';
import { ORDER_FIELD_KEYS } from 'constants/app.config';
import { subscribeWithSelector } from 'zustand/middleware';

export const DISPLAY_NAME = 'Orders';
export const SETTER_PREFIX = '';

export enum OrdersKeys {
  orders = 'orders',
}

export const defaultValue: OrdersValues = {
  orders: [],
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

                // Add/update ids property: all current order ids
                const allIds = orders.map((o) => o.id);
                return { ...order, filters: orderedFilters, ids: allIds };
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
              // Set ids property for all orders
              const allIds = sortedOrders.map((o) => o.id);
              set({ orders: sortedOrders.map((o) => ({ ...o, ids: allIds })) });
            } else {
              // Toggle isSelected for existing order instead of removing it
              const updatedOrders = orders.map((order) => {
                if (order.itemNumber === itemNumber) {
                  return { ...order, isSelected: !order.isSelected };
                }
                return order;
              });
              // Set ids property for all orders
              const allIds = updatedOrders.map((o) => o.id);
              set({ orders: updatedOrders.map((o) => ({ ...o, ids: allIds })) });
            }
          },
          selectAllOrders: () => {
            const newOrders = ORDER_ITEMS_CONFIG.map(({ itemType, number }) => ({
              ...INITIAL_ORDER_ITEM,
              id:
                typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `order-${number}`,
              itemType,
              itemNumber: number,
              isSelected: true,
            }));
            // Set ids property for all orders
            const allIds = newOrders.map((o) => o.id);
            set({ orders: newOrders.map((o) => ({ ...o, ids: allIds })) });
          },
          updateOrderIds: ({ ids }: { ids: string[] }) => {
            const { orders } = get();

            const updatedOrders =
              ids.length > 0
                ? orders.map((order) => ({ ...order, ids, id: ids[0] }))
                : orders.map((order) => ({ ...order, ids }));

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
          // Timer-specific actions
          timerAction: (type: TimerActionType, payload?: TimerActionPayload) => {
            const { orders } = get();

            switch (type) {
              case 'start': {
                if (payload?.itemNumber === undefined || payload?.itemNumber === null) return;
                if (payload?.duration === undefined || payload?.duration === null) return;

                const { itemNumber, duration } = payload;

                // Ensure we're not already processing
                const order = orders.find((o) => o.itemNumber === itemNumber);
                if (order?.process.status === 'processing') return;

                const updatedOrders = orders.map((order) => {
                  if (order.itemNumber === itemNumber) {
                    const estimatedCompletionTime = new Date(Date.now() + duration * 1000).toISOString();
                    return {
                      ...order,
                      isSelected: false,
                      process: {
                        status: 'processing' as OrderStatus,
                        estimatedCompletionTime,
                        timeRemaining: duration,
                      },
                    };
                  }
                  return order;
                });
                set({ orders: updatedOrders });
                break;
              }

              case 'complete': {
                if (payload?.itemNumber === undefined || payload?.itemNumber === null) return;
                const { itemNumber } = payload;

                // Ensure we're actually processing
                const order = orders.find((o) => o.itemNumber === itemNumber);
                if (!order) {
                  console.debug('Timer complete: Order not found', itemNumber);
                  return;
                }
                if (order.process.status !== 'processing') {
                  console.debug('Timer complete: Order not in processing state', {
                    itemNumber,
                    status: order.process.status,
                  });
                  return;
                }

                const updatedOrders = orders.map((order) => {
                  if (order.itemNumber === itemNumber) {
                    return {
                      ...order,
                      isSelected: false,
                      process: {
                        status: 'completed' as OrderStatus,
                        estimatedCompletionTime: undefined,
                        timeRemaining: undefined,
                      },
                    };
                  }
                  return order;
                });
                set({ orders: updatedOrders });
                break;
              }

              case 'reset': {
                if (payload?.itemNumber === undefined || payload?.itemNumber === null) return;
                const { itemNumber } = payload;
                const updatedOrders = orders.map((order) => {
                  if (order.itemNumber === itemNumber) {
                    return {
                      ...order,
                      isSelected: false,
                      process: {
                        status: 'idle' as OrderStatus,
                        estimatedCompletionTime: undefined,
                        timeRemaining: undefined,
                      },
                    };
                  }
                  return order;
                });
                set({ orders: updatedOrders });
                break;
              }

              case 'clear_all': {
                // Reset all orders to initial state instead of clearing them
                const updatedOrders = orders.map((order) => ({
                  ...order,
                  isSelected: false,
                  process: {
                    status: 'idle' as OrderStatus,
                    estimatedCompletionTime: undefined,
                    timeRemaining: undefined,
                  },
                }));
                set({ orders: updatedOrders });
                break;
              }
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

  // Subscribe to order status changes
  store.subscribe(
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

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};

// Optional version that returns null when OrdersProvider is not available
export const useOrdersOptional = (): OrdersReturn | null => {
  const store = OrdersContext.useContext();
  if (!store) {
    return null;
  }

  // Subscribe to order status changes (same as useOrders)
  store.subscribe(
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

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
