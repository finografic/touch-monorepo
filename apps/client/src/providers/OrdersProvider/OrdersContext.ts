import { createStore, type StoreApi, useStore } from 'zustand';
import { createSetters, createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './OrdersContext.types';
import { INITIAL_ORDER_ITEM } from 'src/config/orders.constants';
import { findOrderByNumber } from 'utils/context.utils';
import type { OrderFilters } from 'types/orders.types';

export const DISPLAY_NAME = 'Orders';
export const SETTER_PREFIX = '';

export enum OrdersKeys {
  orders = 'orders',
}

export const defaultValue: OrdersValues = {
  orders: [],
};

export const OrdersContext = createZustandContext(({ initialValue }) => {
  return createStore<OrdersStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, defaultValue }),
      setOrderFilter: ({ itemNumber, filter }: { itemNumber: number; filter: Partial<OrderFilters> }) => {
        const { orders } = get();
        const updatedOrders = orders.map((order) => {
          if (order.itemNumber === itemNumber) {
            // If filter is an empty object, remove all filters
            if (Object.keys(filter).length === 0) {
              return {
                ...order,
                filters: {},
              };
            }

            // Otherwise merge the new filter
            return {
              ...order,
              filters: {
                ...order.filters,
                ...filter,
              },
            };
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
  }));
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
