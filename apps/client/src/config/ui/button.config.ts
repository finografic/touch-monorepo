import type { PadActionConfig, ButtonType } from 'types/button.types';
import { BUTTON_TYPE } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<ButtonType, PadActionConfig> = {
  // NAVIGATION BUTTONS
  [BUTTON_TYPE.NAVIGATE_BACK]: {
    id: 'button-back',
    type: BUTTON_TYPE.NAVIGATE_BACK,
    labelKey: 'ui.buttons.back',
    className: 'small-button',
    icon: 'chevron-left',
    actionType: BUTTON_TYPE.NAVIGATE_BACK,
  },
  [BUTTON_TYPE.NAVIGATE_NEXT]: {
    id: 'button-next',
    type: BUTTON_TYPE.NAVIGATE_NEXT,
    labelKey: 'ui.buttons.next',
    className: 'small-button',
    icon: 'chevron-right',
    actionType: BUTTON_TYPE.NAVIGATE_NEXT,
  },
  // MAIN PAGE BUTTONS - BOTTOM
  [BUTTON_TYPE.RESET_COMPLETED]: {
    id: 'button-reset',
    type: BUTTON_TYPE.RESET_COMPLETED,
    labelKey: 'ui.buttons.reset',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.RESET_COMPLETED,
  },
  [BUTTON_TYPE.SELECT_ALL_SLOTS]: {
    id: 'button-all',
    type: BUTTON_TYPE.SELECT_ALL_SLOTS,
    labelKey: 'ui.buttons.all',
    className: 'small-button',
    actionType: BUTTON_TYPE.SELECT_ALL_SLOTS,
  },
  [BUTTON_TYPE.CANCEL_SELECTED]: {
    id: 'button-cancel',
    type: BUTTON_TYPE.CANCEL_SELECTED,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.CANCEL_SELECTED,
  },
  // MAIN PAGE BUTTONS - RIGHT
  [BUTTON_TYPE.REPEAT_SELECTION]: {
    id: 'button-repeat-selection',
    type: BUTTON_TYPE.REPEAT_SELECTION,
    labelKey: 'ui.buttons.repeatSelection',
    className: 'pad-rect',
    actionType: BUTTON_TYPE.REPEAT_SELECTION,
  },
  [BUTTON_TYPE.PROGRAM_TIME]: {
    id: 'button-program-time',
    type: BUTTON_TYPE.PROGRAM_TIME,
    labelKey: 'ui.buttons.programTime',
    className: 'pad-rect',
    actionType: BUTTON_TYPE.PROGRAM_TIME,
  },
  [BUTTON_TYPE.PROGRAM_PRODUCT]: {
    id: 'button-program-product',
    type: BUTTON_TYPE.PROGRAM_PRODUCT,
    labelKey: 'ui.buttons.programProduct',
    className: 'pad-rect',
    actionType: BUTTON_TYPE.PROGRAM_PRODUCT,
  },
  // IN-FLOW BUTTONS
  [BUTTON_TYPE.CANCEL_TIME_SESSION]: {
    id: 'button-cancel-time-session',
    type: BUTTON_TYPE.CANCEL_TIME_SESSION,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.CANCEL_TIME_SESSION,
  },
  [BUTTON_TYPE.CANCEL_PRODUCT_SESSION]: {
    id: 'button-cancel-product-session',
    type: BUTTON_TYPE.CANCEL_PRODUCT_SESSION,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.CANCEL_PRODUCT_SESSION,
  },
  [BUTTON_TYPE.START_TIME_PROCESS]: {
    id: 'button-start-time-process',
    type: BUTTON_TYPE.START_TIME_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_TYPE.START_TIME_PROCESS,
  },

  [BUTTON_TYPE.START_PRODUCT_PROCESS]: {
    id: 'button-start',
    type: BUTTON_TYPE.START_PRODUCT_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_TYPE.START_PRODUCT_PROCESS,
  },
};

// Alternative route configurations (not part of main FilterKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_TYPE.CANCEL_TIME_SESSION, BUTTON_TYPE.START_TIME_PROCESS],
    content: [],
  },
} as const;
