import type { ReactElement } from 'react';
import { loadingSpinnerStyles } from './ButtonV2.styles';

interface LoadingSpinnerProps {
  size?: number;
}

/**
 * Simple loading spinner component for buttons
 */
export function LoadingSpinner({ size = 16 }: LoadingSpinnerProps): ReactElement {
  return (
    <svg
      css={loadingSpinnerStyles}
      data-loading-spinner
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 11-6.219-8.56" />
    </svg>
  );
}
