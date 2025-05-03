import type { OrderItem } from 'types/orders.types';

export const INITIAL_ORDER_ITEM: OrderItem = {
  itemNumber: 0,
  drinkType: undefined,
  drinkSubtype: undefined,
  isSelected: false,
  isLocked: false,
  processStatus: {
    isProcessing: false,
  },
};
