import { Field } from '@ark-ui/react';
import { useEffect, useRef, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

export interface FieldBoxProps {
  name?: string;
  label?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: FieldError;
}

function deriveValidationState(opts: {
  hasError: FieldError | undefined;
  isSubmitted: boolean;
  isTouched: boolean;
  isDirty: boolean;
}): { showError: boolean; showWarning: boolean; message: string } {
  const { hasError, isSubmitted, isTouched, isDirty } = opts;
  if (!hasError) return { showError: false, showWarning: false, message: '' };

  const isModifiedAfterSubmit = isSubmitted && isDirty;
  const showError = isSubmitted && !isModifiedAfterSubmit;
  const showWarning = (isTouched || isModifiedAfterSubmit) && !showError;

  return { showError, showWarning, message: hasError.message ?? '' };
}

export function FieldBox({
  name,
  label,
  hint,
  required = false,
  children,
  className,
  error: externalError,
}: FieldBoxProps) {
  const formContext = useFormContext();
  const [showDebouncedWarning, setShowDebouncedWarning] = useState(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fieldState = formContext && name ? formContext.getFieldState(name) : null;
  const formState = formContext?.formState;

  const hasError = fieldState?.error ?? externalError;
  const isSubmitted = formState?.isSubmitted ?? false;
  const isTouched = fieldState?.isTouched ?? false;
  const isDirty = fieldState?.isDirty ?? false;

  const { showError, showWarning, message } = deriveValidationState({
    hasError,
    isSubmitted,
    isTouched,
    isDirty,
  });

  useEffect(() => {
    if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    if (showWarning && !showError) {
      warningTimerRef.current = setTimeout(() => setShowDebouncedWarning(true), 300);
    } else {
      setShowDebouncedWarning(false);
    }
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [showWarning, showError]);

  const handleBlur = async () => {
    if (name && formContext?.trigger) {
      await formContext.trigger(name);
    }
  };

  const rootClasses = [
    'ds-fieldbox',
    showError && 'ds-fieldbox--error',
    showDebouncedWarning && !showError && 'ds-fieldbox--warning',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <Field.Root
      invalid={showError}
      required={required}
      className={rootClasses}
      onBlur={handleBlur}
    >
      {label && (
        <Field.Label className="ds-fieldbox__label">
          {label}
          {required && <Field.RequiredIndicator className="ds-fieldbox__required" />}
        </Field.Label>
      )}

      {children}

      {/* Hint — shown when no validation message is active */}
      {hint && !showError && !(showDebouncedWarning && message) && (
        <Field.HelperText className="ds-fieldbox__helper">{hint}</Field.HelperText>
      )}

      {showDebouncedWarning && !showError && message && (
        <Field.HelperText className="ds-fieldbox__message ds-fieldbox__message--warning">
          {message}
        </Field.HelperText>
      )}

      {showError && message && (
        <Field.ErrorText className="ds-fieldbox__message ds-fieldbox__message--error">
          {message}
        </Field.ErrorText>
      )}
    </Field.Root>
  );
}

FieldBox.displayName = 'FieldBox';
