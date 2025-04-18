import { OrderItem } from 'types/orders.types';

export const MOCK_ORDERS_DATA: OrderItem[] = [
  {
    itemNumber: 3,
    drinkType: {
      id: 'cerveza',
      name: 'Cerveza',
      display_name: 'Cerveza',
      has_subtypes: 0,
      default_consumption_time: 0,
      default_freeze_temp: 0,
      is_active: 1,
    },
    isSelected: true,
    isLocked: false,
    processStatus: {
      isProcessing: true,
      timeRemaining: 60,
    },
    volume: {
      amount: 75,
      unit: 'cl',
    },
    containerType: {
      id: 'glass',
      name: 'Glass',
    },
    initialTemperature: {
      value: 23.5,
      unit: '°C',
    },
    finalTemperature: {
      value: 7,
      unit: '°C',
    },
  },
  {
    itemNumber: 2,
    drinkType: {
      id: 'cerveza',
      name: 'Cerveza',
      display_name: 'Cerveza',
      has_subtypes: 0,
      default_consumption_time: 0,
      default_freeze_temp: 0,
      is_active: 1,
    },
    isSelected: true,
    isLocked: false,
    processStatus: {
      isProcessing: true,
      timeRemaining: 60,
    },
    volume: {
      amount: 75,
      unit: 'cl',
    },
    containerType: {
      id: 'glass',
      name: 'Glass',
    },
    initialTemperature: {
      value: 23.5,
      unit: '°C',
    },
    finalTemperature: {
      value: 7,
      unit: '°C',
    },
  },
  {
    itemNumber: 6,
    drinkType: {
      id: 'cerveza',
      name: 'Cerveza',
      display_name: 'Cerveza',
      has_subtypes: 0,
      default_consumption_time: 0,
      default_freeze_temp: 0,
      is_active: 1,
    },
    isSelected: true,
    isLocked: false,
    processStatus: {
      isProcessing: true,
      timeRemaining: 60,
    },
    volume: {
      amount: 75,
      unit: 'cl',
    },
    containerType: {
      id: 'glass',
      name: 'Glass',
    },
    initialTemperature: {
      value: 23.5,
      unit: '°C',
    },
    finalTemperature: {
      value: 7,
      unit: '°C',
    },
  },
];
