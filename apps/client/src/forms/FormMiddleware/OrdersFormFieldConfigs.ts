import { MIN_TEMP_DIFFERENCE } from 'config/app';

import {
  DEFAULT_SPANISH_LOCALE,
  DEFAULT_TEMP_MAX,
  DEFAULT_TEMP_MIN,
  MAX_TIME_SECONDS,
  TEMP_CONSUME_MAX,
  TEMP_STEP,
  TIME_STEP,
} from './FormMiddleware.constants';
import type { FieldConfig } from './FormMiddleware.types';

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

// Complete field configurations for production OrdersForm
export const ordersFormFieldConfigs: FieldConfig<OrdersFormValues>[] = [
  // Mode field
  {
    name: 'modeId',
    type: 'text',
    validation: {
      required: true,
    },
  },

  // Text fields
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

  // Temperature consume field
  {
    name: 'defaultTempConsume',
    type: 'temperature',
    validation: {
      required: true,
      min: -40,
      max: TEMP_CONSUME_MAX,
    },
    localization: {
      locale: DEFAULT_SPANISH_LOCALE,
      formatOnDisplay: true,
      parseOnInput: true,
    },
  },

  // Temperature freeze field with dynamic constraint
  {
    name: 'defaultTempFreeze',
    type: 'temperature',
    validation: {
      required: true,
      min: DEFAULT_TEMP_MIN,
      max: TEMP_CONSUME_MAX,
    },
    localization: {
      locale: DEFAULT_SPANISH_LOCALE,
      formatOnDisplay: true,
      parseOnInput: true,
    },
    constraints: {
      // Dynamic max based on consume temperature
      dynamicMax: (formValues) => {
        const consumeTemp = formValues.defaultTempConsume;
        return consumeTemp ? consumeTemp - MIN_TEMP_DIFFERENCE : TEMP_CONSUME_MAX;
      },
    },
  },

  // TimeRows temperature fields (pattern-based configuration)
  // This will match any field like "timeRows.0.temperature", "timeRows.1.temperature", etc.
  {
    name: 'timeRows.*.temperature' as any, // Pattern matching for dynamic field names
    type: 'temperature',
    validation: {
      required: false, // Individual table rows are optional
      min: DEFAULT_TEMP_MIN,
      max: DEFAULT_TEMP_MAX,
    },
    localization: {
      locale: DEFAULT_SPANISH_LOCALE,
      formatOnDisplay: true,
      parseOnInput: true,
    },
    constraints: {
      // Dynamic min based on freeze temperature
      dynamicMin: (formValues) => {
        return formValues.defaultTempFreeze ?? DEFAULT_TEMP_MIN;
      },
    },
  },
];

// Legacy export name for backward compatibility
export const ordersFieldConfigs = ordersFormFieldConfigs;
