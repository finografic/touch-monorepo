import type { PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { SlotType, OrderItem, OrderStatus } from 'types/orders.types';
import type { OrderFilters } from 'types/filters.types';

interface TransformedPad {
  id: string;
  name: PadUI['name'];
  type: PadUI['type'];
  isChecked: boolean;
  disabled?: boolean;
  metadata?: DataEntry;
  status: OrderStatus;
  timeRemaining?: number;
  estimatedCompletionTime?: string;
}

/**
 * Transforms pad items into a flattened structure with specific props.
 * Maintains reactivity by creating new objects only for transformed properties.
 */
export const transformPadData = (pads: PadUI[]): TransformedPad[] => {
  if (!pads?.length) return [];

  return pads.map((pad) => {
    // Cast to unknown first to avoid type mismatch
    const order = pad.value as unknown as OrderItem | undefined;
    return {
      id: pad.id,
      name: pad.name,
      type: pad.type,
      isChecked: pad.isChecked,
      disabled: pad.disabled,
      metadata: pad.metadata,
      status: order?.process?.status || 'idle',
      timeRemaining: order?.process?.timeRemaining,
      estimatedCompletionTime: order?.process?.estimatedCompletionTime,
    };
  });
};

/**
 * Type guard to check if an object is a TransformedPad
 */
export const isValidPadData = (pad: unknown): pad is TransformedPad => {
  return (
    typeof pad === 'object' &&
    pad !== null &&
    'id' in pad &&
    'name' in pad &&
    'type' in pad &&
    'isChecked' in pad &&
    'status' in pad
  );
};

interface FlattenedOrder {
  id: number; // from itemNumber
  isSelected: boolean;
  status: OrderStatus;
  timeRemaining?: number;
  estimatedCompletion?: string; // ISO date string

  // Flattened selection fields
  drinkTypeId?: string;
  drinkTypeName?: string;
  drinkSubtypeId?: string;
  drinkSubtypeName?: string;
  containerTypeId?: string;
  containerTypeName?: string;

  // Simplified measurements
  volumeAmount?: number;
  volumeUnit?: string;
  initialTemp?: number;
  initialTempUnit?: string;
  finalTemp?: number;
  finalTempUnit?: string;
}

/**
 * Transforms order items into a flattened structure for easier consume.
 * Maintains reactivity by avoiding deep cloning of objects.
 * @param orders Array of OrderItem objects to flatten
 * @returns Array of FlattenedOrder objects
 */
export const flattenOrders = (orders: OrderItem[]): FlattenedOrder[] => {
  if (!orders?.length) return [];

  return orders.map((order) => ({
    // Base properties
    id: order.itemNumber,
    isSelected: order.isSelected,
    status: order.process?.status || 'idle',
    timeRemaining: order.process?.timeRemaining,
    estimatedCompletion: order.process?.estimatedCompletionTime,
  }));
};

/**
 * Type guard to check if an object is a FlattenedOrder
 */
export const isFlattenedOrder = (obj: unknown): obj is FlattenedOrder => {
  if (!obj || typeof obj !== 'object') return false;

  const order = obj as Partial<FlattenedOrder>;
  return (
    typeof order.id === 'number' && typeof order.isSelected === 'boolean' && typeof order.status === 'string'
  );
};

export const transformOrderData = (order: OrderItem) => ({
  slotType: order.slotType,
  itemNumber: order.itemNumber,
  isSelected: order.isSelected,
  status: order.process?.status || 'idle',
  filters: order.filters,
});

export const flattenOrder = (order: OrderItem) => ({
  ...order,
  status: order.process?.status || 'idle',
  timeRemaining: order.process?.timeRemaining,
  estimatedCompletionTime: order.process?.estimatedCompletionTime,
});
