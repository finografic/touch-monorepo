import type { OrderFieldKey } from 'types/orders.types';
import type { ActionButtonConfig, ActionButtonType, RouteNavigationConfig } from 'types/navigation.types';

// Define all possible navigation button types
export const NAVIGATION_BUTTON_TYPES = {
  RESET: 'reset',
  ALL: 'all',
  BACK: 'back',
  NEXT: 'next',
  START: 'start',
  PROGRAM_TIME: 'program-time',
  PROGRAM_PRODUCT: 'program-product',
  REPEAT_SELECTION: 'repeat-selection',
} as const;

// Base button configurations (UI + behavior definitions)
export const NAVIGATION_BUTTONS_CONFIG: Record<ActionButtonType, ActionButtonConfig> = {
  [NAVIGATION_BUTTON_TYPES.RESET]: {
    id: 'nav-reset',
    type: 'reset',
    label: 'Reset',
    className: 'nav-button',
    icon: undefined,
    actionType: 'clear-completed',
  },
  [NAVIGATION_BUTTON_TYPES.ALL]: {
    id: 'nav-all',
    type: 'all',
    label: 'ALL',
    className: 'nav-button',
    icon: undefined,
    actionType: 'select-all',
  },
  [NAVIGATION_BUTTON_TYPES.BACK]: {
    id: 'nav-back',
    type: 'back',
    label: 'Back',
    className: 'nav-button',
    icon: 'chevron-left',
    actionType: 'navigate-back',
  },
  [NAVIGATION_BUTTON_TYPES.NEXT]: {
    id: 'nav-next',
    type: 'next',
    label: 'Next',
    className: 'nav-button',
    icon: 'chevron-right',
    actionType: 'navigate-next',
  },
  [NAVIGATION_BUTTON_TYPES.START]: {
    id: 'nav-start',
    type: 'start',
    label: 'START',
    className: 'nav-button nav-button-start',
    icon: undefined,
    actionType: 'start-process',
  },
  [NAVIGATION_BUTTON_TYPES.PROGRAM_TIME]: {
    id: 'nav-program-time',
    type: 'program-time',
    label: 'Programar Tiempo',
    className: 'pad-rect',
    icon: undefined,
    actionType: 'program-time',
  },
  [NAVIGATION_BUTTON_TYPES.PROGRAM_PRODUCT]: {
    id: 'nav-program-product',
    type: 'program-product',
    label: 'Programar Producto',
    className: 'pad-rect',
    icon: undefined,
    actionType: 'navigate-next', // Reuses next navigation logic
  },
  [NAVIGATION_BUTTON_TYPES.REPEAT_SELECTION]: {
    id: 'nav-repeat-selection',
    type: 'repeat-selection',
    label: 'Repetir Selección',
    className: 'pad-rect',
    icon: undefined,
    actionType: 'repeat-selection',
  },
};

// Route-specific button configurations
export const ROUTE_NAVIGATION_CONFIG: Record<OrderFieldKey, RouteNavigationConfig> = {
  main: {
    footer: [NAVIGATION_BUTTON_TYPES.RESET, NAVIGATION_BUTTON_TYPES.ALL],
    content: [
      NAVIGATION_BUTTON_TYPES.PROGRAM_TIME,
      NAVIGATION_BUTTON_TYPES.PROGRAM_PRODUCT,
      NAVIGATION_BUTTON_TYPES.REPEAT_SELECTION,
    ],
  },
  drinkType: {
    footer: [NAVIGATION_BUTTON_TYPES.BACK, NAVIGATION_BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkSubtype: {
    footer: [NAVIGATION_BUTTON_TYPES.BACK, NAVIGATION_BUTTON_TYPES.NEXT],
    content: [],
  },
  drinkVolume: {
    footer: [NAVIGATION_BUTTON_TYPES.BACK, NAVIGATION_BUTTON_TYPES.NEXT],
    content: [],
  },
  containerType: {
    footer: [NAVIGATION_BUTTON_TYPES.BACK, NAVIGATION_BUTTON_TYPES.NEXT],
    content: [],
  },
  temperature: {
    footer: [NAVIGATION_BUTTON_TYPES.BACK, NAVIGATION_BUTTON_TYPES.START],
    content: [],
  },
};
