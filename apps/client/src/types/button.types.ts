import type { ReactNode } from 'react';
import { createConstUpperEnum } from '@workspace/core/types/utils';

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

// Legacy mapping: old button types → actions (for migration)
// RESET → CLEAR_COMPLETED
// ALL → SELECT_ALL
// BACK → NAVIGATE_BACK
// NEXT → NAVIGATE_NEXT
// START → START_PROCESS
// FINISH_PRODUCT → FINISH_PRODUCT_PROCESS
// CANCEL → CANCEL_COMPLETED
// Others map 1:1

export interface PadActionConfig {
  id: string;
  type: ButtonActionType;
  labelKey: `ui.buttons.${string}`;
  className?: string;
  icon?: 'chevron-left' | 'chevron-right';
  actionType: ButtonActionType;
}

export interface RouteButtonConfig {
  footer: ButtonActionType[];
  content: ButtonActionType[];
}

export interface PadActionProps extends Omit<PadActionConfig, 'labelKey'> {
  label: string; // Translated label for actual display
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
