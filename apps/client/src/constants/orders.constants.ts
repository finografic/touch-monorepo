import { ItemType, type OrderItem } from 'types/orders.types';

export const INITIAL_ORDER_ITEM: OrderItem = {
  itemType: ItemType.A,
  itemNumber: 0,
  isSelected: false,
  filters: {},
  process: {
    status: 'idle',
    timeRemaining: undefined,
    estimatedCompletionTime: undefined,
  },
};
