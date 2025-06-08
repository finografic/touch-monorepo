import type { OrderItem } from 'types/orders.types';

export const INITIAL_ORDER_ITEM: OrderItem = {
  itemType: 'A',
  itemNumber: 0,
  // drinkSubtype: undefined,
  isSelected: false,
  isLocked: false,
  filters: {},
  processStatus: {
    status: 'idle',
    timeRemaining: undefined,
    estimatedCompletionTime: undefined,
  },
};
