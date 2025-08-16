import React, { createContext, useCallback, useContext, useState } from 'react';
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

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const generateId = useCallback(() => `toast-${Date.now()}-${Math.random()}`, []);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.map((toast) => (toast.id === id ? { ...toast, open: false } : toast)));

    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, 200);
  }, []);

  const toast = useCallback(
    (config: ToastConfig) => {
      const id = generateId();
      const message = config.message || DEFAULT_MESSAGES[config.variant];
      const duration = config.duration || DEFAULT_DURATIONS[config.variant];

      const newToast: Toast = {
        id,
        open: true,
        variant: config.variant,
        message,
        subText: config.subText,
        icon: config.icon,
        duration,
        action: config.action,
      };

      setToasts((prev) => [...prev, newToast]);

      setTimeout(() => {
        dismiss(id);
      }, duration);
    },
    [generateId, dismiss],
  );

  const dismissAll = useCallback(() => {
    setToasts((prev) => prev.map((toast) => ({ ...toast, open: false })));

    setTimeout(() => {
      setToasts([]);
    }, 200);
  }, []);

  const value: ToastContextValue = {
    toasts,
    toast,
    dismiss,
    dismissAll,
  };

  return <ToastContext.Provider value={value}>{children}</ToastContext.Provider>;
};

export const useToast = (): ToastContextValue => {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
