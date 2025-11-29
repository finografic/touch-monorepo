import type { ReactNode } from 'react';
import { createConstUpperEnum } from '@workspace/core/types/utils/enum.utils.types';

const BUTTON_TYPES = [
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

export const BUTTON_TYPE = createConstUpperEnum(BUTTON_TYPES);
export type ButtonActionType = keyof typeof BUTTON_TYPE;

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
