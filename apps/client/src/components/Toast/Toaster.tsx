import React from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';

import { Toast } from './Toast';
import { useToast } from './ToastContext';
import { toastViewportStyles } from './Toast.styles';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
      <ToastPrimitive.Viewport css={toastViewportStyles} />
    </ToastPrimitive.Provider>
  );
};
