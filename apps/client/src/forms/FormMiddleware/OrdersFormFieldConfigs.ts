import type { FieldConfig } from './FormMiddleware.types';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import {
  DEFAULT_SPANISH_LOCALE,
  DEFAULT_TEMP_MIN,
  MODE_MAX,
  MODE_MIN,
  TEMP_CONSUME_MAX,
} from './FormMiddleware.constants';

// Type for the OrdersForm values (simplified for POC)
export interface OrdersFormValues {
  mode: number;
  drinkType: string;
  drinkSubtype?: string;
  volume: string;
  containerType: string;
  defaultTempConsume: number;
  defaultTempFreeze: number;
  timeRows: Array<{
    temperature?: number;
    time_a?: number;
    time_b?: number;
    time_c?: number;
  }>;
}

// Field configurations for POC
export const ordersFieldConfigs: FieldConfig<OrdersFormValues>[] = [
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

  // Mode field
  {
    name: 'mode',
    type: 'number',
    validation: {
      required: true,
      min: MODE_MIN,
      max: MODE_MAX,
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
  {
    name: 'drinkSubtype',
    type: 'text',
    validation: {
      required: false,
    },
  },
];
