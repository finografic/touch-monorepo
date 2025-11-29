import type { ReactNode } from 'react';
import type { ConstEnumOf, ConstUpperEnumOf } from '@workspace/core/types/utils';
import { createConstUpperEnum } from '@workspace/core/types/utils';

// Button translation key type - for now using string literal pattern
type ButtonTranslationKey = `ui.buttons.${string}`;

// 1. Define the button type union as source of truth (what the buttons represent)
type ButtonType =
  | 'reset'
  | 'all'
  | 'back'
  | 'next'
  | 'start'
  | 'finish-product'
  | 'cancel'
  | 'cancel-time-session'
  | 'cancel-product-session'
  | 'program-product'
  | 'program-time'
  | 'repeat-selection';

// 2. Derive the const object from the union using your enhanced utility
export const BUTTON_TYPES: ConstEnumOf<ButtonType> = {
  RESET: 'reset',
  ALL: 'all',
  BACK: 'back',
  NEXT: 'next',
  START: 'start',
  FINISH_PRODUCT: 'finish-product',
  CANCEL: 'cancel',
  CANCEL_TIME_SESSION: 'cancel-time-session',
  CANCEL_PRODUCT_SESSION: 'cancel-product-session',
  PROGRAM_PRODUCT: 'program-product',
  PROGRAM_TIME: 'program-time',
  REPEAT_SELECTION: 'repeat-selection',
} as const;

// 3. Export the derived type
export type PadActionType = ButtonType;

// Action types that buttons can trigger (what they do when clicked)
// export type ButtonActionType =
//   | 'clear-completed'
//   | 'cancel-completed'
//   | 'select-all'
//   | 'navigate-back'
//   | 'navigate-next'
//   | 'start-process'
//   | 'finish-product-process'
//   | 'program-product'
//   | 'program-time'
//   | 'repeat-selection'
//   | 'cancel-time-session'
//   | 'cancel-product-session';

// 2. Derive the const object from the union using your enhanced utility
// export const BUTTON_ACTION: ConstUpperEnumOf<ButtonActionType> = {

const BUTTON_ACTIONS = [
  'CLEAR_COMPLETED',
  'CANCEL_COMPLETED',
  'SELECT_ALL',
  'NAVIGATE_BACK',
  'NAVIGATE_NEXT',
  'START_PROCESS',
  'FINISH_PRODUCT_PROCESS',
  'PROGRAM_PRODUCT',
  'PROGRAM_TIME',
  'REPEAT_SELECTION',
  'CANCEL_TIME_SESSION',
  'CANCEL_PRODUCT_SESSION',
] as const;

export const BUTTON_ACTION = createConstUpperEnum(BUTTON_ACTIONS);

export type ButtonActionType = keyof typeof BUTTON_ACTION;

// Mapping from SCREAMING_SNAKE_CASE keys to kebab-case values (for runtime use)
export const BUTTON_ACTION_VALUES = {
  CLEAR_COMPLETED: 'clear-completed',
  CANCEL_COMPLETED: 'cancel-completed',
  SELECT_ALL: 'select-all',
  NAVIGATE_BACK: 'navigate-back',
  NAVIGATE_NEXT: 'navigate-next',
  START_PROCESS: 'start-process',
  FINISH_PRODUCT_PROCESS: 'finish-product-process',
  PROGRAM_PRODUCT: 'program-product',
  PROGRAM_TIME: 'program-time',
  REPEAT_SELECTION: 'repeat-selection',
  CANCEL_TIME_SESSION: 'cancel-time-session',
  CANCEL_PRODUCT_SESSION: 'cancel-product-session',
} as const satisfies Record<ButtonActionType, string>;

// Type for the kebab-case action values (used in configs and runtime)
export type ButtonActionValue = (typeof BUTTON_ACTION_VALUES)[ButtonActionType];

export interface PadActionConfig {
  id: string;
  type: PadActionType;
  labelKey: ButtonTranslationKey;
  className?: string;
  icon?: 'chevron-left' | 'chevron-right';
  actionType: ButtonActionValue;
}

export interface RouteButtonConfig {
  footer: PadActionType[];
  content: PadActionType[];
}

export interface PadActionProps extends Omit<PadActionConfig, 'labelKey'> {
  label: string; // Translated label for actual display
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
