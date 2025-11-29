import type { PadActionConfig, ButtonActionType } from 'types/button.types';
import { BUTTON_ACTION } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<ButtonActionType, PadActionConfig> = {
  [BUTTON_ACTION.CLEAR_COMPLETED]: {
    id: 'button-reset',
    type: BUTTON_ACTION.CLEAR_COMPLETED,
    labelKey: 'ui.buttons.reset',
    className: 'small-button button-warning',
    actionType: BUTTON_ACTION.CLEAR_COMPLETED,
  },
  [BUTTON_ACTION.SELECT_ALL]: {
    id: 'button-all',
    type: BUTTON_ACTION.SELECT_ALL,
    labelKey: 'ui.buttons.all',
    className: 'small-button',
    actionType: BUTTON_ACTION.SELECT_ALL,
  },
  [BUTTON_ACTION.NAVIGATE_BACK]: {
    id: 'button-back',
    type: BUTTON_ACTION.NAVIGATE_BACK,
    labelKey: 'ui.buttons.back',
    className: 'small-button',
    icon: 'chevron-left',
    actionType: BUTTON_ACTION.NAVIGATE_BACK,
  },
  [BUTTON_ACTION.NAVIGATE_NEXT]: {
    id: 'button-next',
    type: BUTTON_ACTION.NAVIGATE_NEXT,
    labelKey: 'ui.buttons.next',
    className: 'small-button',
    icon: 'chevron-right',
    actionType: BUTTON_ACTION.NAVIGATE_NEXT,
  },
  [BUTTON_ACTION.START_PROCESS]: {
    id: 'button-start',
    type: BUTTON_ACTION.START_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_ACTION.START_PROCESS,
  },
  [BUTTON_ACTION.FINISH_PRODUCT_PROCESS]: {
    id: 'button-finish-product',
    type: BUTTON_ACTION.FINISH_PRODUCT_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_ACTION.FINISH_PRODUCT_PROCESS,
  },
  [BUTTON_ACTION.CANCEL_COMPLETED]: {
    id: 'button-cancel',
    type: BUTTON_ACTION.CANCEL_COMPLETED,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_ACTION.CANCEL_COMPLETED,
  },
  [BUTTON_ACTION.CANCEL_TIME_SESSION]: {
    id: 'button-cancel-time-session',
    type: BUTTON_ACTION.CANCEL_TIME_SESSION,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_ACTION.CANCEL_TIME_SESSION,
  },
  [BUTTON_ACTION.CANCEL_PRODUCT_SESSION]: {
    id: 'button-cancel-product-session',
    type: BUTTON_ACTION.CANCEL_PRODUCT_SESSION,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_ACTION.CANCEL_PRODUCT_SESSION,
  },
  [BUTTON_ACTION.PROGRAM_TIME]: {
    id: 'button-program-time',
    type: BUTTON_ACTION.PROGRAM_TIME,
    labelKey: 'ui.buttons.programTime',
    className: 'pad-rect',
    actionType: BUTTON_ACTION.PROGRAM_TIME,
  },
  [BUTTON_ACTION.PROGRAM_PRODUCT]: {
    id: 'button-program-product',
    type: BUTTON_ACTION.PROGRAM_PRODUCT,
    labelKey: 'ui.buttons.programProduct',
    className: 'pad-rect',
    actionType: BUTTON_ACTION.PROGRAM_PRODUCT,
  },
  [BUTTON_ACTION.REPEAT_SELECTION]: {
    id: 'button-repeat-selection',
    type: BUTTON_ACTION.REPEAT_SELECTION,
    labelKey: 'ui.buttons.repeatSelection',
    className: 'pad-rect',
    actionType: BUTTON_ACTION.REPEAT_SELECTION,
  },
};

// Alternative route configurations (not part of main FilterKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_ACTION.CANCEL_TIME_SESSION, BUTTON_ACTION.START_PROCESS],
    content: [],
  },
} as const;
