import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM } from 'constants/orders.constants';
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
                    status: 'processing' as OrderStatus,
                    estimatedCompletionTime,
                    timeRemaining: duration,
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
            const newOrders = [];
            for (let i = 0; i <= 9; i++) {
              const itemType = (i === 0 ? 'A' : i < 9 ? 'B' : 'C') as ItemType;
              newOrders.push({
                ...INITIAL_ORDER_ITEM,
                itemType,
                itemNumber: i,
                isSelected: true,
              });
            }
            set({ orders: newOrders });
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

  store.subscribe((_state, _prev) => {
    // store change
  });

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
