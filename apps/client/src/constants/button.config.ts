import type { PadActionConfig, PadActionType } from 'types/button.types';
import { BUTTON_TYPES } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<PadActionType, PadActionConfig> = {
  [BUTTON_TYPES.RESET]: {
    id: 'btn-reset',
    type: 'reset',
    labelKey: 'ui.buttons.reset',
    className: 'small-button button-reset',
    actionType: 'clear-completed',
  },
  [BUTTON_TYPES.ALL]: {
    id: 'btn-all',
    type: 'all',
    labelKey: 'ui.buttons.all',
    className: 'small-button',
    actionType: 'select-all',
  },
  [BUTTON_TYPES.BACK]: {
    id: 'btn-back',
    type: 'back',
    labelKey: 'ui.buttons.back',
    className: 'small-button',
    icon: 'chevron-left',
    actionType: 'navigate-back',
  },
  [BUTTON_TYPES.NEXT]: {
    id: 'btn-next',
    type: 'next',
    labelKey: 'ui.buttons.next',
    className: 'small-button',
    icon: 'chevron-right',
    actionType: 'navigate-next',
  },
  [BUTTON_TYPES.START]: {
    id: 'btn-start',
    type: 'start',
    labelKey: 'ui.buttons.start',
    className: 'small-button button-start',
    actionType: 'start-process',
  },
  [BUTTON_TYPES.FINISH_PRODUCT]: {
    id: 'btn-finish-product',
    type: 'finish-product',
    labelKey: 'ui.buttons.start',
    className: 'small-button button-start',
    actionType: 'finish-product-process',
  },
  [BUTTON_TYPES.CANCEL]: {
    id: 'btn-cancel',
    type: 'cancel',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-cancel',
    actionType: 'cancel-completed',
  },
  [BUTTON_TYPES.CANCEL_TIME_SESSION]: {
    id: 'btn-cancel-time-session',
    type: 'cancel-time-session',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-cancel',
    actionType: 'cancel-time-session',
  },
  [BUTTON_TYPES.CANCEL_PRODUCT_SESSION]: {
    id: 'btn-cancel-product-session',
    type: 'cancel-product-session',
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-cancel',
    actionType: 'cancel-product-session',
  },
  [BUTTON_TYPES.PROGRAM_TIME]: {
    id: 'btn-program-time',
    type: 'program-time',
    labelKey: 'ui.buttons.programTime',
    className: 'pad-rect',
    actionType: 'program-time',
  },
  [BUTTON_TYPES.PROGRAM_PRODUCT]: {
    id: 'btn-program-product',
    type: 'program-product',
    labelKey: 'ui.buttons.programProduct',
    className: 'pad-rect',
    actionType: 'program-product',
  },
  [BUTTON_TYPES.REPEAT_SELECTION]: {
    id: 'btn-repeat-selection',
    type: 'repeat-selection',
    labelKey: 'ui.buttons.repeatSelection',
    className: 'pad-rect',
    actionType: 'repeat-selection',
  },
};

// Alternative route configurations (not part of main OrderFieldKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_TYPES.CANCEL_TIME_SESSION, BUTTON_TYPES.START],
    content: [],
  },
} as const;
