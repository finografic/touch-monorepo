import type { PadUI } from 'types/ui.types';
import type { DataEntry } from 'types/data.types';
import type { OrderItem } from 'types/orders.types';

interface TransformedPad {
  index?: number;
  id: string;
  name: string;
  type: PadUI['type'];
  isChecked: boolean;
  hasSubtypes?: boolean;
  value: PadUI['value'];
  metadata?: PadUI['metadata'];
}

/**
 * Transforms pad items into a flattened structure with specific props.
 * Maintains reactivity by creating new objects only for transformed properties.
 */
export const transformPadData = (pads: PadUI[]): TransformedPad[] => {
  if (!pads?.length) return [];

  return pads.map((pad, _index) => {
    // Keep reference to original metadata to maintain reactivity
    const metadata = pad.metadata as DataEntry & {
      name: string;
      displayName: string;
      hasSubtypes: boolean;
    };

    return {
      id: pad.id,
      name: pad.name,
      type: pad.type,
      isChecked: pad.isChecked,
      value: pad.value,
      metadata: {
        ...metadata,
      },
      // hasSubtypes: !!metadata?.hasSubtypes,
      // ...('hasSubtypes' in metadata && { hasSubtypes: !!metadata?.hasSubtypes }),
    };
  });
};

/**
 * Type guard to check if an object is a TransformedPad
 */
export const isTransformedPad = (obj: unknown): obj is TransformedPad => {
  if (!obj || typeof obj !== 'object') return false;

  const pad = obj as Partial<TransformedPad>;
  return (
    typeof pad.id === 'string' &&
    typeof pad.name === 'string' &&
    typeof pad.type === 'string' &&
    typeof pad.isChecked === 'boolean' &&
    typeof pad.hasSubtypes === 'boolean'
  );
};

interface FlattenedOrder {
  id: number; // from itemNumber
  isSelected: boolean;
  isLocked: boolean;
  isProcessing: boolean;
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
 * Transforms order items into a flattened structure for easier consumption.
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
    isLocked: order.isLocked,
    isProcessing: order.processStatus?.isProcessing || false,
    timeRemaining: order.processStatus?.timeRemaining,
    estimatedCompletion: order.processStatus?.estimatedCompletionTime,

    /*
    // Drink type info
    drinkTypeId: order.drinkType?.id,
    drinkTypeName: order.drinkType?.displayName,

    // Subtype info
    drinkSubtypeId: order.drinkSubtype?.id,
    drinkSubtypeName: order.drinkSubtype?.displayName,

    // Container info
    containerTypeId: order.containerType?.id,
    containerTypeName: order.containerType?.displayName,

    // Volume measurements
    volumeAmount: order.volume?.amount,
    volumeUnit: order.volume?.unit,

    // Temperature measurements
    initialTemp: order.initialTemperature?.value,
    initialTempUnit: order.initialTemperature?.unit,
    finalTemp: order.finalTemperature?.value,
    finalTempUnit: order.finalTemperature?.unit,
    */
  }));
};

/**
 * Type guard to check if an object is a FlattenedOrder
 */
export const isFlattenedOrder = (obj: unknown): obj is FlattenedOrder => {
  if (!obj || typeof obj !== 'object') return false;

  const order = obj as Partial<FlattenedOrder>;
  return (
    typeof order.id === 'number' &&
    typeof order.isSelected === 'boolean' &&
    typeof order.isLocked === 'boolean' &&
    typeof order.isProcessing === 'boolean'
  );
};
