import type { ReactNode } from 'react';

export type ToastVariant = 'info' | 'success' | 'error' | 'warning';

export interface ToastConfig {
  variant: ToastVariant;
  message?: string;
  subText?: string;
  icon?: ReactNode;
  duration?: number;
  action?: {
    label: string;
    onClick: () => void;
    altText?: string;
  };
}

export interface Toast extends ToastConfig {
  id: string;
  open: boolean;
}

export interface ToastContextValue {
  toasts: Toast[];
  toast: (config: ToastConfig) => void;
  dismiss: (id: string) => void;
  dismissAll: () => void;
}
