import type { OrderFieldKey } from 'types/orders.types';
import type { ActionButtonConfig, ActionButtonType, RouteButtonConfig } from 'types/button.types';
import { BUTTON_TYPES } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<ActionButtonType, ActionButtonConfig> = {
  [BUTTON_TYPES.RESET]: {
    id: 'btn-reset',
    type: 'reset',
    label: 'Reset',
    className: 'nav-button',
    actionType: 'clear-completed',
  },
  [BUTTON_TYPES.ALL]: {
    id: 'btn-all',
    type: 'all',
    label: 'ALL',
    className: 'nav-button',
    actionType: 'select-all',
  },
  [BUTTON_TYPES.BACK]: {
    id: 'btn-back',
    type: 'back',
    label: 'Back',
    className: 'nav-button',
    icon: 'chevron-left',
    actionType: 'navigate-back',
  },
  [BUTTON_TYPES.NEXT]: {
    id: 'btn-next',
    type: 'next',
    label: 'Next',
    className: 'nav-button',
    icon: 'chevron-right',
    actionType: 'navigate-next',
  },
  [BUTTON_TYPES.START]: {
    id: 'btn-start',
    type: 'start',
    label: 'START',
    className: 'nav-button nav-button-start',
    actionType: 'start-process',
  },
  [BUTTON_TYPES.PROGRAM_TIME]: {
    id: 'btn-program-time',
    type: 'program-time',
    label: 'Programar Tiempo',
    className: 'pad-rect',
    actionType: 'program-time',
  },
  [BUTTON_TYPES.PROGRAM_PRODUCT]: {
    id: 'btn-program-product',
    type: 'program-product',
    label: 'Programar Producto',
    className: 'pad-rect',
    actionType: 'navigate-next', // Reuses next navigation logic
  },
  [BUTTON_TYPES.REPEAT_SELECTION]: {
    id: 'btn-repeat-selection',
    type: 'repeat-selection',
    label: 'Repetir Selección',
    className: 'pad-rect',
    actionType: 'repeat-selection',
  },
};

// Route-specific button configurations
export const ROUTE_BUTTON_CONFIG: Record<OrderFieldKey, RouteButtonConfig> = {
  main: {
    footer: [BUTTON_TYPES.RESET, BUTTON_TYPES.ALL],
    content: [BUTTON_TYPES.PROGRAM_TIME, BUTTON_TYPES.PROGRAM_PRODUCT, BUTTON_TYPES.REPEAT_SELECTION],
  },
  drinkType: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkSubtype: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkVolume: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  containerType: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
    content: [],
  },
  temperature: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.START],
    content: [],
  },
};

// Alternative route configurations (not part of main OrderFieldKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.START],
    content: [],
  },
} as const;
