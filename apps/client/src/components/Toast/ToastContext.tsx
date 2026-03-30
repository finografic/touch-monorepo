import React, { createContext, useCallback, useContext, useMemo } from 'react';

import type { ReactNode } from 'react';

import { appToaster } from './app-toaster';
import type { Toast, ToastConfig, ToastContextValue } from './Toast.types';

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

const DEFAULT_MESSAGES = {
  success: 'Operation completed successfully',
  error: 'An error occurred',
  warning: 'Please review and try again',
  info: 'Information updated',
} as const;

const DEFAULT_DURATIONS = {
  success: 1500,
  error: 3000,
  warning: 3000,
  info: 1500,
} as const;

function toArkType(variant: ToastConfig['variant']): 'success' | 'error' | 'warning' | 'info' {
  return variant;
}

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const toast = useCallback((config: ToastConfig) => {
    const message = config.message || DEFAULT_MESSAGES[config.variant];
    const duration = config.duration ?? DEFAULT_DURATIONS[config.variant];

    const title: ReactNode = config.icon ? (
      <span style={{ display: 'inline-flex', gap: 8, alignItems: 'center' }}>
        {config.icon}
        <span>{message}</span>
      </span>
    ) : (
      message
    );

    appToaster.create({
      title,
      description: config.subText,
      duration,
      type: toArkType(config.variant),
      closable: true,
      action: config.action
        ? {
            label: config.action.label,
            onClick: config.action.onClick,
          }
        : undefined,
    });
  }, []);

  const dismiss = useCallback((id: string) => {
    appToaster.dismiss(id);
  }, []);

  const dismissAll = useCallback(() => {
    appToaster.dismiss();
  }, []);

  const value: ToastContextValue = useMemo(
    () => ({
      toasts: [],
      toast,
      dismiss,
      dismissAll,
    }),
    [toast, dismiss, dismissAll],
  );

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export type { Toast };
