import { MAX_TIME_SECONDS, TIME_STEP } from './FormMiddleware.constants';
import type { FieldConfig } from './FormMiddleware.types';

/**
 * OrdersForm Field Configurations - Middleware Configuration
 *
 * NOTE: This middleware configuration is now LEAN and focused!
 * - Temperature inputs: Handled by PrimeReact InputNumber (no middleware needed)
 * - Time inputs: Still use middleware for mm:ss conversion logic
 *
 * The middleware now only handles time inputs in the timeRows field array.
 */

// Complete type for the production OrdersForm values
export interface OrdersFormValues {
  modeId: string;
  drinkType: string;
  drinkSubtype?: string;
  volume: string;
  containerType: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  timeRows: Array<{
    temperature?: number;
    timeA?: number;
    timeB?: number;
    timeC?: number;
  }>;
}

// Minimal field configurations - only for fields that need middleware
// Currently: Only time inputs in the timeRows array use middleware
export const ordersFormFieldConfigs: FieldConfig<OrdersFormValues>[] = [
  // Mode field (basic validation only)
  {
    name: 'modeId',
    type: 'text',
    validation: {
      required: true,
    },
  },

  // Text fields (basic validation only)
  {
    name: 'drinkType',
    type: 'text',
    validation: {
      required: true,
    },
  },
  {
    name: 'drinkSubtype',
    type: 'text',
    validation: {
      required: false,
    },
  },
  {
    name: 'volume',
    type: 'text',
    validation: {
      required: true,
    },
  },
  {
    name: 'containerType',
    type: 'text',
    validation: {
      required: true,
    },
  },

  // NOTE: Temperature fields (defaultTempConsume, defaultTempFreeze, timeRows.*.temperature)
  // are now handled by PrimeReact InputNumber components and don't need middleware configs!

  // Time fields in timeRows still use middleware for mm:ss conversion
  // Pattern-based configuration matches: timeRows.0.timeA, timeRows.1.timeB, etc.
  {
    name: 'timeRows.*.timeA' as any,
    type: 'time',
    validation: {
      required: false,
      min: 0,
      max: MAX_TIME_SECONDS,
    },
  },
  {
    name: 'timeRows.*.timeB' as any,
    type: 'time',
    validation: {
      required: false,
      min: 0,
      max: MAX_TIME_SECONDS,
    },
  },
  {
    name: 'timeRows.*.timeC' as any,
    type: 'time',
    validation: {
      required: false,
      min: 0,
      max: MAX_TIME_SECONDS,
    },
  },
];

// Legacy export name for backward compatibility
export const ordersFieldConfigs = ordersFormFieldConfigs;
