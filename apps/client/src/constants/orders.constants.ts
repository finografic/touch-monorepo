import type { OrderItem } from 'types/orders.types';

export const INITIAL_ORDER_ITEM: OrderItem = {
  itemType: 'B',
  itemNumber: 0,
  // drinkSubtype: undefined,
  isSelected: false,
  isLocked: false,
  filters: {},
  processStatus: {
    isProcessing: false,
  },
};
