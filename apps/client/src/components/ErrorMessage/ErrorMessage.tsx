import type { ErrorResponse } from '@workspace/core/types';
import { getErrorMessage } from '@workspace/shared/utils/api.utils';

import { ExclamationTriangleIcon } from '@workspace/design-system/icons';

interface ErrorMessageProps {
  error: ErrorResponse;
  className?: string;
}

export const ErrorMessage = ({ error, className = '' }: ErrorMessageProps) => {
  return (
    <div
      className={className}
      role="alert"
      aria-live="polite"
      style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#ef4444' }}
    >
      <ExclamationTriangleIcon style={{ width: '1.25rem', height: '1.25rem' }} />
      <span>{getErrorMessage(error)}</span>
    </div>
  );
};
