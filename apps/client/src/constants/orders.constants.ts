import { SlotType, type OrderItem } from 'types/orders.types';
import { getOrderItemsConfig, type SlotItemConfig } from 'utils/slot-config.utils';

export type { SlotItemConfig } from 'utils/slot-config.utils';

// Use the utility function to get the configuration
export const ORDER_ITEMS_CONFIG: SlotItemConfig[] = getOrderItemsConfig();

export const INITIAL_ORDER_ITEM: OrderItem = {
  id: '', // Default empty, will be set when creating new orders
  ids: [], // Default empty, will be set when creating new orders
  slotType: SlotType.A,
  slotNumber: 0,
  isSelected: false,
  filters: {},
  session: undefined,
  process: {
    status: 'idle',
    timeRemaining: undefined,
    estimatedCompletionTime: undefined,
  },
};
