import type { PadActionConfig, ButtonType } from 'types/button.types';
import { BUTTON_TYPE } from 'types/button.types';

// Base button configurations (UI + behavior definitions)
export const BUTTON_CONFIGS: Record<ButtonType, PadActionConfig> = {
  [BUTTON_TYPE.CLEAR_COMPLETED]: {
    id: 'button-reset',
    type: BUTTON_TYPE.CLEAR_COMPLETED,
    labelKey: 'ui.buttons.reset',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.CLEAR_COMPLETED,
  },
  [BUTTON_TYPE.SELECT_ALL]: {
    id: 'button-all',
    type: BUTTON_TYPE.SELECT_ALL,
    labelKey: 'ui.buttons.all',
    className: 'small-button',
    actionType: BUTTON_TYPE.SELECT_ALL,
  },
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
  [BUTTON_TYPE.START_PROCESS]: {
    id: 'button-start',
    type: BUTTON_TYPE.START_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_TYPE.START_PROCESS,
  },
  [BUTTON_TYPE.FINISH_PRODUCT_PROCESS]: {
    id: 'button-finish-product',
    type: BUTTON_TYPE.FINISH_PRODUCT_PROCESS,
    labelKey: 'ui.buttons.start',
    className: 'small-button button-success',
    actionType: BUTTON_TYPE.FINISH_PRODUCT_PROCESS,
  },
  [BUTTON_TYPE.CANCEL_COMPLETED]: {
    id: 'button-cancel',
    type: BUTTON_TYPE.CANCEL_COMPLETED,
    labelKey: 'ui.buttons.cancel',
    className: 'small-button button-warning',
    actionType: BUTTON_TYPE.CANCEL_COMPLETED,
  },
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
  [BUTTON_TYPE.REPEAT_SELECTION]: {
    id: 'button-repeat-selection',
    type: BUTTON_TYPE.REPEAT_SELECTION,
    labelKey: 'ui.buttons.repeatSelection',
    className: 'pad-rect',
    actionType: BUTTON_TYPE.REPEAT_SELECTION,
  },
};

// Alternative route configurations (not part of main FilterKey flow)
export const ALTERNATIVE_ROUTE_BUTTON_CONFIG = {
  time: {
    footer: [BUTTON_TYPE.CANCEL_TIME_SESSION, BUTTON_TYPE.START_PROCESS],
    content: [],
  },
} as const;
