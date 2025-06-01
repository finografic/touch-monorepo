import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { OrderFieldKey } from 'types/orders.types';
import type { OrderFilters } from 'types/filers.types';
import { ORDER_FIELD_KEYS } from 'constants/app.config';

export const DISPLAY_NAME = 'Orders';
export const SETTER_PREFIX = '';

export enum OrdersKeys {
  orders = 'orders',
}

export const defaultValue: OrdersValues = {
  orders: [],
};

export const OrdersContext = createZustandContext(({ initialValue }) => {
  return createStore<OrdersStore>(
    (set, get): OrdersStore => ({
      ...defaultValue,
      ...initialValue,
      actions: {
        ...createSetters({ set, prefix: SETTER_PREFIX, defaultValue }),
        setOrdersFilter: ({ itemNumber, filter }: { itemNumber: number; filter: Partial<OrderFilters> }) => {
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
        toggleOrder: (itemNumber: number) => {
          const { orders } = get();
          const draftOrder = findOrderByNumber(orders, itemNumber);
          set({
            orders: !draftOrder
              ? [...orders, { ...INITIAL_ORDER_ITEM, itemNumber, isSelected: true }]
              : [...orders].filter((order) => order.itemNumber !== itemNumber),
          });
        },
        selectAllOrders: () => {
          const newOrders = [];
          for (let i = 1; i <= 8; i++) {
            newOrders.push({
              ...INITIAL_ORDER_ITEM,
              itemNumber: i,
              isSelected: true,
            });
          }
          set({ orders: newOrders });
        },
      },
    }),
  );
});

type OrdersReturn = Omit<OrdersStore, 'actions'> & OrdersStore['actions'];

export const useOrders = (): OrdersReturn => {
  const store = OrdersContext.useContext();
  if (!store) {
    throw new Error(`use${DISPLAY_NAME} must be used within a ${DISPLAY_NAME}Provider`);
  }

  return useStore<StoreApi<OrdersStore>, OrdersReturn>(store, ({ actions, ...state }) => ({
    ...state,
    ...actions,
  }));
};
