import type React from 'react';
import type { ButtonProps, DialogSize } from '@finografic/design-system/components';

export interface TabConfig {
  id: string;
  label: string;
  icon?: React.ReactNode;
  content: React.ReactNode;
  disabled?: boolean;
}

export interface DialogConfig {
  title: string;
  subtitle?: string;
  description?: string;
  tabs: TabConfig[];
  /** Panel size. @default 'md' */
  size?: DialogSize;
  maxWidth?: string;
  maxHeight?: string;
  minWidth?: string;
  minHeight?: string;
  footer?: {
    isRTL: boolean;
    isFilled?: boolean;
    buttons?: ButtonProps[];
  } | null;
}
