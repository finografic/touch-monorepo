import { MIN_TEMP_DIFFERENCE } from 'config/app';
import type { FieldConfig, ProgressiveFieldConfig } from './FormMiddleware.types';

// Example of how OrdersForm would be configured with the middleware system
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
    timeA?: number;
    timeB?: number;
    timeC?: number;
  }>;
}

// Field configurations for the middleware
export const ordersFieldConfigs: FieldConfig<OrdersFormValues>[] = [
  // Temperature fields with localization and dependencies
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
    dependencies: {
      affects: [
        {
          targetField: 'defaultTempFreeze',
          effect: 'constrainMax',
          calculate: (consumeTemp: number) => consumeTemp - MIN_TEMP_DIFFERENCE,
        },
      ],
    },
  },
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
    dependencies: {
      dependsOn: ['defaultTempConsume'],
    },
    constraints: {
      dynamicMax: (formValues) => formValues.defaultTempConsume - MIN_TEMP_DIFFERENCE,
    },
  },

  // Mode selection
  {
    name: 'mode',
    type: 'number',
    validation: {
      required: true,
      min: 1,
      max: 5,
    },
  },

  // Required text fields
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

  // Optional subtype
  {
    name: 'drinkSubtype',
    type: 'text',
    validation: {
      required: false,
    },
  },
];

// Progressive configuration for the time table
export const ordersProgressiveConfigs: ProgressiveFieldConfig<OrdersFormValues>[] = [
  {
    name: 'timeRows',
    itemValidation: (item, formValues) => {
      if (!item) return false;

      const defaultTempFreeze = formValues.defaultTempFreeze || -50;

      const tempValid =
        typeof item.temperature === 'number' &&
        item.temperature >= defaultTempFreeze &&
        item.temperature <= 50;
      const timeAValid = typeof item.timeA === 'number' && item.timeA >= 0 && item.timeA <= 3600;
      const timeBValid = typeof item.timeB === 'number' && item.timeB >= 0 && item.timeB <= 3600;
      const timeCValid = typeof item.timeC === 'number' && item.timeC >= 0 && item.timeC <= 3600;

      return tempValid && timeAValid && timeBValid && timeCValid;
    },
    itemCompletion: (item) => {
      return (
        item?.temperature !== undefined &&
        item?.timeA !== undefined &&
        item?.timeB !== undefined &&
        item?.timeC !== undefined
      );
    },
    enableNextWhen: 'completeAndValid',
    allowEditCompleted: true,
  },
];

// Example usage:
// The simplified OrdersForm component would wrap its form with FormMiddlewareProvider,
// passing these configurations. Individual input components would then use
// useFormMiddleware() to access centralized field logic, validation, and localization.
