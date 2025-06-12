import type { ReactNode } from 'react';
import type { NAVIGATION_BUTTON_TYPES } from 'constants/navigation.config';

export type ActionButtonType = (typeof NAVIGATION_BUTTON_TYPES)[keyof typeof NAVIGATION_BUTTON_TYPES];

export type NavigationActionType =
  | 'clear-completed'
  | 'select-all'
  | 'navigate-back'
  | 'navigate-next'
  | 'start-process'
  | 'program-time'
  | 'repeat-selection';

export interface ActionButtonConfig {
  id: string;
  type: ActionButtonType;
  label: string;
  className?: string;
  icon?: 'chevron-left' | 'chevron-right';
  actionType: NavigationActionType;
}

export interface RouteNavigationConfig {
  footer: ActionButtonType[];
  content: ActionButtonType[];
}

export interface ActionButtonProps extends ActionButtonConfig {
  disabled?: boolean;
  onClick?: () => void;
  children?: ReactNode;
}
