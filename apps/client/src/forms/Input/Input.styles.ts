import { css } from '@emotion/react';

export const styles = {
  input: (variant: 'dark' | 'light') => css`
    width: 100%;
    padding: 12px 16px;
    border: 2px solid ${variant === 'dark' ? '#374151' : '#d1d5db'};
    border-radius: 8px;
    font-size: 16px;
    background-color: ${variant === 'dark' ? '#1f2937' : '#ffffff'};
    color: ${variant === 'dark' ? '#f9fafb' : '#111827'};
    transition: all 0.2s ease;

    &::placeholder {
      color: ${variant === 'dark' ? '#9ca3af' : '#6b7280'};
    }

    &:focus {
      outline: none;
      border-color: ${variant === 'dark' ? '#3b82f6' : '#2563eb'};
      box-shadow: 0 0 0 3px ${variant === 'dark' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(37, 99, 235, 0.1)'};
    }

    &:not(button):disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
};
