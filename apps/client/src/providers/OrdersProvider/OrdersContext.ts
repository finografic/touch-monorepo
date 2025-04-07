import { createStore, useStore, type StoreApi } from 'zustand';
import { createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './Orders.types';
import { createSetters } from 'utils/zustand';
import { INITIAL_ORDER_ITEM } from 'constants/orders.constants';
import { findOrderByNumber } from 'utils/orders.utils';

export const DISPLAY_NAME = 'Orders';

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
      togglePad: (itemNumber: number) => {
        const { orders } = get();
        const draftOrder = findOrderByNumber(orders, itemNumber);
        set({
          orders: !draftOrder
            ? [...orders, { ...INITIAL_ORDER_ITEM, itemNumber, isSelected: true }]
            : [...orders].filter((order) => order.itemNumber !== itemNumber),
        });
      },
      selectAllPads: () => {
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
