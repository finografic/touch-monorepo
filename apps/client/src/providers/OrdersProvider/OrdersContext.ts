import { createStore, useStore, type StoreApi } from 'zustand';
import { createZustandContext } from 'utils/zustand';
import type { OrdersStore, OrdersValues } from './Orders.types';
import { createSetters } from 'utils/zustand';
import { OrderItem } from 'types/orders.types';

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
        const draftOrder = orders.find((order: OrderItem) => order.itemNumber === itemNumber);
        console.log('%c __TOGGLE', 'color:grey', itemNumber);
        set({
          orders: draftOrder
            ? [...orders, { ...draftOrder, isSelected: false }]
            : [...orders, { itemNumber, isSelected: true, isLocked: false }],
        });
      },
      selectAllPads: () => {
        // set({
        //   activePads: {
        //     ...defaultValue.activePads,
        //     1: true,
        //     2: true,
        //     3: true,
        //     4: true,
        //     5: true,
        //     6: true,
        //     7: true,
        //     8: true,
        //   },
        // });
      },
      handleNextStep: () => {
        const { orders } = get();
        const draftOrders = { ...orders };

        // Object.entries(activePads).forEach(([itemNumber, isActive]) => {
        //   if (isActive) {
        //     const padNum = parseInt(itemNumber);
        //     if (!newOrders[padNum]) {
        //       newOrders[padNum] = {
        //         itemNumber: padNum,
        //       };
        //     }
        //   }
        // });

        // set({ orders: newOrders });
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
