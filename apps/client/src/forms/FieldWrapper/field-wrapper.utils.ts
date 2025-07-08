import type { FieldError } from 'react-hook-form';

// Transform verbose validation messages into concise, user-friendly ones
export const transformValidationMessage = (message: string): string => {
  if (!message) return '';

  // Required field patterns
  if (
    message.includes('required') ||
    message.includes('String must contain at least 1 character') ||
    message.includes('Expected string, received')
  ) {
    return 'Required';
  }

  // Number max patterns
  const maxMatch = message.match(/must be less than or equal to (\d+)/i);
  if (maxMatch) {
    return `Max ${maxMatch[1]}`;
  }

  // Number min patterns
  const minMatch = message.match(/must be greater than or equal to (\d+)/i);
  if (minMatch) {
    return `Min ${minMatch[1]}`;
  }

  // Number range patterns
  const rangeMatch = message.match(/must be between (\d+) and (\d+)/i);
  if (rangeMatch) {
    return `${rangeMatch[1]}-${rangeMatch[2]}`;
  }

  // String length patterns
  const minLengthMatch = message.match(/must be at least (\d+) characters/i);
  if (minLengthMatch) {
    return `Min ${minLengthMatch[1]} chars`;
  }

  const maxLengthMatch = message.match(/must be at most (\d+) characters/i);
  if (maxLengthMatch) {
    return `Max ${maxLengthMatch[1]} chars`;
  }

  // Type validation
  if (message.includes('Expected number, received')) {
    return 'Must be a number';
  }

  if (message.includes('Invalid email')) {
    return 'Invalid email';
  }

  // Temperature constraint (custom message)
  if (message.includes('must be at least') && message.includes('below')) {
    return 'Too close to consumption temp';
  }

  // Default: return first sentence or truncate if too long
  const firstSentence = message.split('.')[0];
  return firstSentence.length > 30 ? `${firstSentence.substring(0, 27)}...` : firstSentence;
};

interface FieldValidationState {
  showError: boolean;
  showWarning: boolean;
  displayMessage: string;
}

interface GetFieldValidationStateParams {
  hasError: FieldError | undefined;
  isSubmitted: boolean;
  isTouched: boolean;
  isDirty: boolean;
}

// Get field validation state with smart error/warning logic
export const getFieldValidationState = ({
  hasError,
  isSubmitted,
  isTouched,
  isDirty,
}: GetFieldValidationStateParams): FieldValidationState => {
  if (!hasError) {
    return {
      showError: false,
      showWarning: false,
      displayMessage: '',
    };
  }

  // Smart state logic:
  // - Error (red): Form submitted + has error + field NOT modified since submit
  // - Warning (orange): Has error + (touched OR dirty after submit) + field modified since submit
  const isFieldModifiedAfterSubmit = isSubmitted && isDirty;
  const showError = isSubmitted && !isFieldModifiedAfterSubmit;
  const showWarning = isTouched || isFieldModifiedAfterSubmit;

  return {
    showError,
    showWarning: showWarning && !showError,
    displayMessage: transformValidationMessage(hasError.message || ''),
  };
};
