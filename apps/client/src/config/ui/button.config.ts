import type { PadActionConfig, PadActionType } from 'types/button.types';
import { BUTTON_TYPES } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<PadActionType, PadActionConfig> = {
  [BUTTON_TYPES.RESET]: {
    id: 'button-reset',
    type: 'reset',
    labelKey: 'ui.buttons.reset',
    className: 'small-button button-warning',
    actionType: 'clear-completed',
  },
  [BUTTON_TYPES.ALL]: {
    id: 'button-all',
    type: 'all',
    labelKey: 'ui.buttons.all',
    className: 'small-button',
    actionType: 'select-all',
  },
  [BUTTON_TYPES.BACK]: {
    id: 'button-back',
    type: 'back',
    labelKey: 'ui.buttons.back',
    className: 'small-button',
    icon: 'chevron-left',
    actionType: 'navigate-back',
  },
  [BUTTON_TYPES.NEXT]: {
    id: 'button-next',
    type: 'next',
    labelKey: 'ui.buttons.next',
    className: 'small-button',
    icon: 'chevron-right',
    actionType: 'navigate-next',
  },
  [BUTTON_TYPES.START]: {
    id: 'button-start',
    type: 'start',
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: 'start-process',
  },
  [BUTTON_TYPES.FINISH_PRODUCT]: {
    id: 'button-finish-product',
    type: 'finish-product',
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: 'finish-product-process',
  },
  [BUTTON_TYPES.CANCEL]: {
    id: 'button-cancel',
    type: 'cancel',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: 'cancel-completed',
  },
  [BUTTON_TYPES.CANCEL_TIME_SESSION]: {
    id: 'button-cancel-time-session',
    type: 'cancel-time-session',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: 'cancel-time-session',
  },
  [BUTTON_TYPES.CANCEL_PRODUCT_SESSION]: {
    id: 'button-cancel-product-session',
    type: 'cancel-product-session',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: 'cancel-product-session',
  },
  [BUTTON_TYPES.PROGRAM_TIME]: {
    id: 'button-program-time',
    type: 'program-time',
    labelKey: 'ui.buttons.programTime',
    className: 'pad-rect',
    actionType: 'program-time',
  },
  [BUTTON_TYPES.PROGRAM_PRODUCT]: {
    id: 'button-program-product',
    type: 'program-product',
    labelKey: 'ui.buttons.programProduct',
    className: 'pad-rect',
    actionType: 'program-product',
  },
  [BUTTON_TYPES.REPEAT_SELECTION]: {
    id: 'button-repeat-selection',
    type: 'repeat-selection',
    labelKey: 'ui.buttons.repeatSelection',
    className: 'pad-rect',
    actionType: 'repeat-selection',
  },
};

// Alternative route configurations (not part of main FilterKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_TYPES.CANCEL_TIME_SESSION, BUTTON_TYPES.START],
    content: [],
  },
} as const;
