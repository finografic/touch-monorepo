import { css } from '@emotion/react';

export const styles = {
  container: (variant: 'dark' | 'light') => css`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    background-color: ${variant === 'dark' ? '#111827' : '#f9fafb'};
  `,

  formWrapper: (variant: 'dark' | 'light') => css`
    width: 100%;
    max-width: 400px;
    padding: 2rem;
    background-color: ${variant === 'dark' ? '#1f2937' : '#ffffff'};
    border-radius: 12px;
    box-shadow: ${variant === 'dark' ? '0 10px 25px rgba(0, 0, 0, 0.3)' : '0 10px 25px rgba(0, 0, 0, 0.1)'};
    border: 1px solid ${variant === 'dark' ? '#374151' : '#e5e7eb'};
  `,

  header: (variant: 'dark' | 'light') => css`
    text-align: center;
    margin-bottom: 2rem;
  `,

  title: (variant: 'dark' | 'light') => css`
    font-size: 2rem;
    font-weight: 700;
    color: ${variant === 'dark' ? '#f9fafb' : '#111827'};
    margin: 0 0 0.5rem 0;
  `,

  subtitle: (variant: 'dark' | 'light') => css`
    font-size: 1rem;
    color: ${variant === 'dark' ? '#9ca3af' : '#6b7280'};
    margin: 0;
  `,

  form: css`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
  `,

  inputGroup: css`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  `,

  label: (variant: 'dark' | 'light') => css`
    font-size: 0.875rem;
    font-weight: 500;
    color: ${variant === 'dark' ? '#f3f4f6' : '#374151'};
  `,

  error: (variant: 'dark' | 'light') => css`
    padding: 0.75rem;
    background-color: ${variant === 'dark' ? '#dc2626' : '#fef2f2'};
    color: ${variant === 'dark' ? '#fecaca' : '#dc2626'};
    border: 1px solid ${variant === 'dark' ? '#f87171' : '#fecaca'};
    border-radius: 6px;
    font-size: 0.875rem;
  `,

  submitButton: (variant: 'dark' | 'light') => css`
    width: 100%;
    padding: 12px 16px;
    background-color: ${variant === 'dark' ? '#3b82f6' : '#2563eb'};
    color: white;
    border: none;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s ease;

    &:hover:not(:disabled) {
      background-color: ${variant === 'dark' ? '#2563eb' : '#1d4ed8'};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,

  switchMode: (variant: 'dark' | 'light') => css`
    margin-top: 1.5rem;
    text-align: center;
    padding-top: 1.5rem;
    border-top: 1px solid ${variant === 'dark' ? '#374151' : '#e5e7eb'};
  `,

  switchText: (variant: 'dark' | 'light') => css`
    font-size: 0.875rem;
    color: ${variant === 'dark' ? '#9ca3af' : '#6b7280'};
    margin: 0 0 0.5rem 0;
  `,

  switchButton: (variant: 'dark' | 'light') => css`
    background: none;
    border: none;
    color: ${variant === 'dark' ? '#3b82f6' : '#2563eb'};
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    text-decoration: underline;

    &:hover:not(:disabled) {
      color: ${variant === 'dark' ? '#60a5fa' : '#1d4ed8'};
    }

    &:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `,
};
