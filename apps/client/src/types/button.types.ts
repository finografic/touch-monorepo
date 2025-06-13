import type { ReactNode } from 'react';
import type { ConstEnumOf } from '@workspace/types/utils';

// 1. Define the button type union as source of truth (what the buttons represent)
type ButtonType =
  | 'reset'
  | 'all'
  | 'back'
  | 'next'
  | 'start'
  | 'program-time'
  | 'program-product'
  | 'repeat-selection';

// 2. Derive the const object from the union using your enhanced utility
export const BUTTON_TYPES: ConstEnumOf<ButtonType> = {
  RESET: 'reset',
  ALL: 'all',
  BACK: 'back',
  NEXT: 'next',
  START: 'start',
  PROGRAM_TIME: 'program-time',
  PROGRAM_PRODUCT: 'program-product',
  REPEAT_SELECTION: 'repeat-selection',
} as const;

// 3. Export the derived type
export type ActionButtonType = ButtonType;

// Action types that buttons can trigger (what they do when clicked)
export type ButtonActionType =
  | 'clear-completed'
  | 'select-all'
  | 'navigate-back'
  | 'navigate-next'
  | 'start-process'
  | 'program-time'
  | 'repeat-selection';

// 2. Derive the const object from the union using your enhanced utility
export const BUTTON_ACTIONS: ConstEnumOf<ButtonActionType> = {
  CLEAR_COMPLETED: 'clear-completed',
  SELECT_ALL: 'select-all',
  NAVIGATE_BACK: 'navigate-back',
  NAVIGATE_NEXT: 'navigate-next',
  START_PROCESS: 'start-process',
  PROGRAM_TIME: 'program-time',
  REPEAT_SELECTION: 'repeat-selection',
} as const;

export interface ActionButtonConfig {
  id: string;
  type: ActionButtonType;
  label: string;
  className?: string;
  icon?: 'chevron-left' | 'chevron-right';
  actionType: ButtonActionType;
}

export interface RouteButtonConfig {
  footer: ActionButtonType[];
  content: ActionButtonType[];
}

export interface ActionButtonProps extends ActionButtonConfig {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
