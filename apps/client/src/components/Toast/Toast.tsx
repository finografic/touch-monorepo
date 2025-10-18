import React from 'react';

import * as ToastPrimitive from '@radix-ui/react-toast';

import type { Toast as ToastType } from './Toast.types';
import { ToastIcon } from './ToastIcons';

import {
  getToastDescriptionStyles,
  getToastRootStyles,
  getToastTitleStyles,
  getVariantIconColor,
  toastCloseButtonStyles,
  toastContentStyles,
  toastIconStyles,
  toaststylesPadAction,
} from './Toast.styles';

interface ToastProps {
  toast: ToastType;
  onDismiss: (id: string) => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onDismiss }) => {
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onDismiss(toast.id);
    }
  };

  return (
    <ToastPrimitive.Root
      css={getToastRootStyles(toast.variant)}
      open={toast.open}
      onOpenChange={handleOpenChange}
      duration={toast.duration}
    >
      <div css={toastIconStyles}>
        {toast.icon || <ToastIcon variant={toast.variant} color={getVariantIconColor(toast.variant)} />}
      </div>

      <div css={toastContentStyles}>
        <ToastPrimitive.Title css={getToastTitleStyles(toast.variant)}>{toast.message}</ToastPrimitive.Title>
        {toast.subText && (
          <ToastPrimitive.Description css={getToastDescriptionStyles(toast.variant)}>
            {toast.subText}
          </ToastPrimitive.Description>
        )}
      </div>

      {toast.action && (
        <ToastPrimitive.Action
          css={toaststylesPadAction}
          altText={`${toast.action.label} action`}
          onClick={toast.action.onClick}
        >
          {toast.action.label}
        </ToastPrimitive.Action>
      )}

      <ToastPrimitive.Close css={toastCloseButtonStyles} aria-label="Close notification">
        <svg width="14" height="14" viewBox="0 0 15 15" fill="none">
          <path
            d="M11.7816 4.03157C12.0062 3.80702 12.0062 3.44295 11.7816 3.2184C11.5571 2.99385 11.193 2.99385 10.9685 3.2184L7.50005 6.68682L4.03164 3.2184C3.80708 2.99385 3.44301 2.99385 3.21846 3.2184C2.99391 3.44295 2.99391 3.80702 3.21846 4.03157L6.68688 7.49999L3.21846 10.9684C2.99391 11.193 2.99391 11.557 3.21846 11.7816C3.44301 12.0061 3.80708 12.0061 4.03164 11.7816L7.50005 8.31316L10.9685 11.7816C11.193 12.0061 11.5571 12.0061 11.7816 11.7816C12.0062 11.557 12.0062 11.193 11.7816 10.9684L8.31322 7.49999L11.7816 4.03157Z"
            fill="currentColor"
            fillRule="evenodd"
            clipRule="evenodd"
          />
        </svg>
      </ToastPrimitive.Close>
    </ToastPrimitive.Root>
  );
};
