import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues, TimerActionPayload, TimerActionType } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM, ORDER_ITEMS_CONFIG } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { ItemType, OrderFieldKey, OrderStatus } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';
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
          setOrderProcessing: ({ itemNumber, duration }: { itemNumber: number; duration: number }) => {
            const { orders } = get();
            const updatedOrders = orders.map((order) => {
              if (order.itemNumber === itemNumber) {
                const estimatedCompletionTime = new Date(Date.now() + duration * 1000).toISOString();
                return {
                  ...order,
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
            const draftOrder = findOrderByNumber(orders, itemNumber);
            const newOrders = !draftOrder
              ? [...orders, { ...INITIAL_ORDER_ITEM, itemType, itemNumber, isSelected: true }]
              : [...orders].filter((order) => order.itemNumber !== itemNumber);

            const sortedOrders = [...newOrders].sort((a, b) => a.itemNumber - b.itemNumber);
            set({ orders: sortedOrders });
          },
          selectAllOrders: () => {
            const newOrders = ORDER_ITEMS_CONFIG.map(({ itemType, number }) => ({
              ...INITIAL_ORDER_ITEM,
              itemType,
              itemNumber: number,
              isSelected: true,
            }));
            set({ orders: newOrders });
          },
          // Timer-specific actions
          timerAction: (type: TimerActionType, payload?: TimerActionPayload) => {
            const { orders } = get();

            switch (type) {
              case 'start': {
                if (!payload?.itemNumber || !payload?.duration) return;
                const { itemNumber, duration } = payload;
                const updatedOrders = orders.map((order) => {
                  if (order.itemNumber === itemNumber) {
                    const estimatedCompletionTime = new Date(Date.now() + duration * 1000).toISOString();
                    return {
                      ...order,
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
                if (!payload?.itemNumber) return;
                const { itemNumber } = payload;
                const updatedOrders = orders.map((order) => {
                  if (order.itemNumber === itemNumber) {
                    return {
                      ...order,
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
                if (!payload?.itemNumber) return;
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
                // Clear all orders (both timers and selection)
                set({ orders: [] });
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
      state.orders.map((order) => ({
        number: order.itemNumber,
        status: order.process.status,
      })),
    (current, prev) => {
      if (typeof window === 'undefined') return;

      // Find orders that have changed status
      current.forEach((curr, idx) => {
        const previous = prev[idx];
        if (previous && curr.status !== previous.status) {
          console.debug(`Order ${curr.number} status changed from ${previous.status} to ${curr.status}`);

          // If status changed from 'processing' to something else, ensure timer is cleaned up
          if (previous.status === 'processing' && window.__timerIntervals) {
            // Clear any existing intervals for this order
            const timerId = window.__timerIntervals[curr.number];
            if (timerId) {
              console.debug(`Cleaning up interval for order ${curr.number}`);
              clearInterval(timerId);
              delete window.__timerIntervals[curr.number];
            }
          }
        }
      });
    },
  );

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
