import type { ConstEnumOf } from '@workspace/core/types/utils';

// Define the flow type union as source of truth
type FlowType = 'program-time' | 'program-product';

// Derive the const object from the union
export const FLOW_TYPES: ConstEnumOf<FlowType> = {
  PROGRAM_TIME: 'program-time',
  PROGRAM_PRODUCT: 'program-product',
} as const;

// Export the derived type
export type FlowTypeValue = FlowType;
