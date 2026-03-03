import React from 'react';

import { Toast } from './Toast';
import { useToast } from './ToastContext';
import { toastViewportStyles } from './Toast.styles';

export const Toaster: React.FC = () => {
  const { toasts, dismiss } = useToast();

  return (
    <ol css={toastViewportStyles} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onDismiss={dismiss} />
      ))}
    </ol>
  );
};
