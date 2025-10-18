import type { ErrorResponse } from '@workspace/core/types';
import { getErrorMessage } from '@workspace/shared/utils/api.utils';

import { ExclamationTriangleIcon } from '@radix-ui/react-icons';

interface ErrorMessageProps {
  error: ErrorResponse;
  className?: string;
}

export const ErrorMessage = ({ error, className = '' }: ErrorMessageProps) => {
  return (
    <div className={`flex items-center gap-2 text-red-500 ${className}`} role="alert" aria-live="polite">
      <ExclamationTriangleIcon className="h-5 w-5" />
      <span>{getErrorMessage(error)}</span>
    </div>
  );
};
