import { SlotType, type OrderItem } from 'types/orders.types';
import { getOrderItemsConfig, type OrderItemConfig } from 'utils/slot-config.utils';

export type { OrderItemConfig } from 'utils/slot-config.utils';

// Use the utility function to get the configuration
export const ORDER_ITEMS_CONFIG: OrderItemConfig[] = getOrderItemsConfig();

export const INITIAL_ORDER_ITEM: OrderItem = {
  id: '', // Default empty, will be set when creating new orders
  ids: [], // Default empty, will be set when creating new orders
  slotType: SlotType.A,
  itemNumber: 0,
  isSelected: false,
  filters: {},
  session: undefined,
  process: {
    status: 'idle',
    timeRemaining: undefined,
    estimatedCompletionTime: undefined,
  },
};
