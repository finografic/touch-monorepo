import type { ReactNode } from 'react';
import { createConstUpperEnum } from '@workspace/core/types/utils/enum.utils.types';

const BUTTON_TYPES = [
  'NAVIGATE_BACK',
  'NAVIGATE_NEXT',
  'CANCEL_SELECTED',
  'RESET_COMPLETED',
  'SELECT_ALL_SLOTS',
  'REPEAT_SELECTION',
  'PROGRAM_TIME',
  'PROGRAM_PRODUCT',
  'CANCEL_TIME_SESSION',
  'CANCEL_PRODUCT_SESSION',
  'START_TIME_PROCESS',
  'START_PRODUCT_PROCESS',
] as const;

export const BUTTON_TYPE = createConstUpperEnum(BUTTON_TYPES);
export type ButtonType = keyof typeof BUTTON_TYPE;

export interface PadActionConfig {
  id: string;
  type: ButtonType;
  labelKey: `ui.buttons.${string}`;
  className?: string;
  icon?: 'chevron-left' | 'chevron-right';
  actionType: ButtonType;
}

export interface RouteButtonConfig {
  footer: ButtonType[];
  content: ButtonType[];
}

export interface PadActionProps extends Omit<PadActionConfig, 'labelKey'> {
  label: string; // Translated label for actual display
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
