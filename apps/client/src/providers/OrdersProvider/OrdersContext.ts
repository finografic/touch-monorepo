import { createStore, useStore, type StoreApi } from 'zustand';
import { createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './Orders.types';
import { createSetters } from 'utils/zustand';

export const DISPLAY_NAME = 'Orders';

export enum OrdersKeys {
  activePads = 'activePads',
  orders = 'orders',
}

export const defaultValue: OrdersValues = {
  activePads: {
    1: false,
    2: false,
    3: false,
    4: false,
    5: false,
    6: false,
    7: false,
    8: false,
  },
  orders: {},
};

export const OrdersContext = createZustandContext(({ initialValue }) => {
  return createStore<OrdersStore>((set, get) => ({
    ...defaultValue,
    ...initialValue,
    actions: {
      ...createSetters({ set, defaultValue }),
      togglePad: (padNumber: number) => {
        const { activePads } = get();
        set({
          activePads: {
            ...activePads,
            [padNumber]: !activePads[padNumber],
          },
        });
      },
      selectAllPads: () => {
        set({
          activePads: {
            ...defaultValue.activePads,
            1: true,
            2: true,
            3: true,
            4: true,
            5: true,
            6: true,
            7: true,
            8: true,
          },
        });
      },
      handleNextStep: () => {
        const { activePads, orders } = get();
        const newOrders = { ...orders };

        Object.entries(activePads).forEach(([padNumber, isActive]) => {
          if (isActive) {
            const padNum = parseInt(padNumber);
            if (!newOrders[padNum]) {
              newOrders[padNum] = {
                padNumber: padNum,
              };
            }
          }
        });

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
