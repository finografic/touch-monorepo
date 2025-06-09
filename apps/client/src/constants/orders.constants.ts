import { ItemType, type OrderItem } from 'types/orders.types';

export interface OrderItemConfig {
  itemType: ItemType;
  number: number;
}

export const ORDER_ITEMS_CONFIG: OrderItemConfig[] = [
  // First row
  { itemType: ItemType.A, number: 0 },
  { itemType: ItemType.B, number: 1 },
  { itemType: ItemType.B, number: 2 },

  // Second row
  { itemType: ItemType.B, number: 3 },
  { itemType: ItemType.B, number: 4 },
  { itemType: ItemType.B, number: 5 },

  // Third row
  { itemType: ItemType.B, number: 6 },
  { itemType: ItemType.B, number: 7 },
  { itemType: ItemType.B, number: 8 },

  // Special pad
  { itemType: ItemType.C, number: 9 },
];

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
