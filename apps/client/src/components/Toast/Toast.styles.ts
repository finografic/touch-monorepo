import { css } from '@emotion/react';
import { colors } from 'styles/colors.styles';
import type { ToastVariant } from './Toast.types';

// Helper function to get variant-specific colors
const getVariantColor = (variant: ToastVariant): string => {
  switch (variant) {
    case 'success':
      return colors.success;
    case 'error':
      return colors.danger;
    case 'warning':
      return colors.warning;
    case 'info':
    default:
      return colors.info;
  }
};

export const toastViewportStyles = css`
  --viewport-padding: 24px;
  position: fixed;
  bottom: 0;
  right: 0;
  display: flex;
  flex-direction: column;
  padding: var(--viewport-padding);
  gap: 12px;
  width: 420px;
  max-width: 100vw;
  margin: 0;
  list-style: none;
  z-index: 2147483647;
  outline: none;
`;

export const getToastRootStyles = (variant: ToastVariant) => css`
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid ${getVariantColor(variant)};
  box-shadow:
    0 10px 38px -10px rgba(22, 23, 24, 0.35),
    0 10px 20px -15px rgba(22, 23, 24, 0.2);
  padding: 16px 20px;
  display: grid;
  grid-template-areas: 'icon content action';
  grid-template-columns: auto 1fr auto;
  gap: 12px;
  align-items: flex-start;
  min-height: 56px;

  &[data-state='open'] {
    animation: slideIn 200ms cubic-bezier(0.16, 1, 0.3, 1);
  }

  &[data-state='closed'] {
    animation: hide 150ms ease-in;
  }

  &[data-swipe='move'] {
    transform: translateX(var(--radix-toast-swipe-move-x));
  }

  &[data-swipe='cancel'] {
    transform: translateX(0);
    transition: transform 200ms ease-out;
  }

  &[data-swipe='end'] {
    animation: swipeOut 150ms ease-out;
  }

  @keyframes hide {
    from {
      opacity: 1;
    }
    to {
      opacity: 0;
    }
  }

  @keyframes slideIn {
    from {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
    to {
      transform: translateX(0);
    }
  }

  @keyframes swipeOut {
    from {
      transform: translateX(var(--radix-toast-swipe-end-x));
    }
    to {
      transform: translateX(calc(100% + var(--viewport-padding)));
    }
  }
`;

export const toastIconStyles = css`
  grid-area: icon;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  height: 20px;
  margin-top: 2px;
`;

export const toastContentStyles = css`
  grid-area: content;
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

export const toastTitleStyles = css`
  margin: 0;
  font-weight: 600;
  font-size: 14px;
  line-height: 1.4;
  color: ${colors.text};
`;

export const toastDescriptionStyles = css`
  margin: 0;
  font-size: 13px;
  line-height: 1.4;
  color: ${colors.grey};
`;

export const toastActionStyles = css`
  grid-area: action;
  display: flex;
  gap: 8px;
  align-items: flex-start;
`;

export const toastCloseButtonStyles = css`
  all: unset;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  color: ${colors.grey};
  cursor: pointer;
  transition: all 150ms ease;

  &:hover {
    background-color: ${colors.backgroundLight};
    color: ${colors.text};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${colors.primary};
  }
`;

export const toastActionButtonStyles = css`
  all: unset;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 4px;
  font-weight: 500;
  font-size: 12px;
  padding: 6px 12px;
  height: 28px;
  cursor: pointer;
  transition: all 150ms ease;
  background-color: ${colors.backgroundLight};
  color: ${colors.text};
  border: 1px solid ${colors.grey};

  &:hover {
    background-color: ${colors.backgroundXLight};
  }

  &:focus {
    box-shadow: 0 0 0 2px ${colors.primary};
  }
`;

export const getVariantIconColor = (variant: ToastVariant): string => {
  return getVariantColor(variant);
};
