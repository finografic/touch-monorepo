import type { FieldConfig } from './FormMiddleware.types';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';

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
      max: 40,
    },
    localization: {
      locale: 'es-ES',
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
      min: -50,
      max: 40,
    },
    localization: {
      locale: 'es-ES',
      formatOnDisplay: true,
      parseOnInput: true,
    },
    constraints: {
      // Dynamic max based on consume temperature
      dynamicMax: (formValues) => {
        const consumeTemp = formValues.defaultTempConsume;
        return consumeTemp ? consumeTemp - MIN_TEMP_DIFFERENCE : 40;
      },
    },
  },

  // Mode field
  {
    name: 'mode',
    type: 'number',
    validation: {
      required: true,
      min: 1,
      max: 5,
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
