import type { ScreenClass } from '@finografic/design-system/viewport';

export type SizeUI = Extract<ScreenClass, 'sm' | 'md' | 'lg'>;

export type Theme = 'light' | 'dark';

export type Align = 'left' | 'center' | 'right';

// UI Status and Message Types
export type StatusType = 'success' | 'error' | 'warning' | 'info';

// Radix UI Callout color options
export type CalloutColor = 'green' | 'red' | 'yellow' | 'blue' | 'orange' | 'purple' | 'cyan';

// Mapping from status type to Radix Callout color
export const STATUS_TO_CALLOUT_COLOR: Record<StatusType, CalloutColor> = {
  success: 'green',
  error: 'red',
  warning: 'yellow',
  info: 'blue',
} as const;
