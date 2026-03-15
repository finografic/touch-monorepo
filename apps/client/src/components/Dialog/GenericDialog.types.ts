import type React from 'react';

import type { DialogSize } from '@finografic/design-system/forms';

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
    primaryButton?: {
      label: string;
      onClick: () => void;
      variant?: 'solid' | 'subtle' | 'outline' | 'ghost' | 'link';
      colorScheme?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'grey';
    };
    secondaryButton?: {
      label: string;
      onClick: () => void;
      variant?: 'solid' | 'subtle' | 'outline' | 'ghost' | 'link';
      colorScheme?: 'default' | 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info' | 'grey';
    };
  };
}
