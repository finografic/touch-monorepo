import React, { useEffect, useState } from 'react';
import { Box, Text } from '@radix-ui/themes';
import { useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import type { FieldError } from 'react-hook-form';
import { Cross2Icon, ExclamationTriangleIcon } from 'styles/icons';
import { getFieldValidationState } from './field-wrapper.utils';
import { styles } from './FieldWrapper.styles';
import clsx from 'clsx';

interface FieldWrapperProps {
  name?: string; // Field name for RHF integration
  label?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: FieldError; // Legacy prop - will be overridden by RHF state if name provided
}

export const FieldWrapper: React.FC<FieldWrapperProps> = ({
  name,
  label,
  required = false,
  children,
  className,
  error: externalError,
}) => {
  const formContext = useFormContext();
  const [showDebouncedWarning, setShowDebouncedWarning] = useState(false);

  // Get field state if name is provided and form context exists
  const fieldState = formContext && name ? formContext.getFieldState(name) : null;
  const { trigger, formState } = formContext || {};

  // Determine error/warning state
  const hasError = fieldState?.error || externalError;
  const isSubmitted = formState?.isSubmitted || false;
  const isTouched = fieldState?.isTouched || false;
  const isDirty = fieldState?.isDirty || false;

  // Get validation state using utility
  const { showError, showWarning, displayMessage } = getFieldValidationState({
    hasError,
    isSubmitted,
    isTouched,
    isDirty,
  });

  // Debounce warning display using use-debounce
  const debouncedSetWarning = useDebouncedCallback(
    (show: boolean) => setShowDebouncedWarning(show),
    300, // 300ms debounce
  );

  // Update debounced warning when showWarning changes
  useEffect(() => {
    debouncedSetWarning(Boolean(showWarning && !showError));
  }, [showWarning, showError, debouncedSetWarning]);

  // Handle blur validation
  const handleBlur = async () => {
    if (name && trigger) {
      await trigger(name);
    }
  };

  const fieldId = name || `field-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <Box
      css={styles}
      className={clsx(
        'field-wrapper',
        {
          'field-error': showError,
          'field-warning': showDebouncedWarning && !showError,
        },
        className,
      )}
      onBlur={handleBlur}
    >
      {label && (
        <label className="field-label" htmlFor={fieldId}>
          <Text size="2" mb="2" weight="medium">
            {label} {required && '*'}
          </Text>
        </label>
      )}

      <Box className="field-element">
        {/* Clone children to add id if it's an input */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { id: fieldId });
          }
          return child;
        })}
      </Box>

      {showDebouncedWarning && !showError && (
        <Box className="field-validation validation-warning">
          <ExclamationTriangleIcon />
          {displayMessage}
        </Box>
      )}

      {showError && (
        <Box className="field-validation validation-error">
          <Cross2Icon />
          {displayMessage}
        </Box>
      )}
    </Box>
  );
};
