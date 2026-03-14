import { Field } from '@ark-ui/react';
import { type ReactNode, useEffect, useRef, useState } from 'react';
import type { FieldError } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { fieldBoxRecipe } from './field-box.recipe';
import type { FieldBoxVariants } from './field-box.types';

export interface FieldBoxProps extends FieldBoxVariants {
  /** RHF field name — wires to useFormContext for auto error/warning state */
  name?: string;
  label?: ReactNode;
  /** Hint text shown below the control when no error/warning is active */
  hint?: ReactNode;
  required?: boolean;
  children: ReactNode;
  className?: string;
  /** Explicit error — used when not inside an RHF FormProvider */
  error?: FieldError | string;
}

function deriveValidationState(opts: {
  error: FieldError | undefined;
  isSubmitted: boolean;
  isTouched: boolean;
  isDirty: boolean;
}): { showError: boolean; showWarning: boolean; message: string } {
  const { error, isSubmitted, isTouched, isDirty } = opts;
  if (!error) return { showError: false, showWarning: false, message: '' };

  const modifiedAfterSubmit = isSubmitted && isDirty;
  const showError = isSubmitted && !modifiedAfterSubmit;
  const showWarning = (isTouched || modifiedAfterSubmit) && !showError;

  return { showError, showWarning, message: error.message ?? '' };
}

/**
 * FieldBox — RHF-aware layout wrapper for a single form control.
 *
 * Renders: label · [control] · hint/warning/error text.
 *
 * When inside an RHF `<FormProvider>` and `name` is provided, field state is
 * read automatically — error shows only after submit, warning shows (debounced)
 * on touch/dirty-after-submit.
 *
 * When used outside RHF (or with `error` prop directly), pass `error` explicitly.
 *
 * If children include an Ark `Field.Input` or `Field.Textarea`, FieldBox wraps
 * them in `Field.Root` for automatic label linkage and aria-invalid wiring.
 * For all other controls (DS Select, custom), it uses a plain div.
 */
export function FieldBox({
  name,
  label,
  hint,
  required = false,
  size = 'md',
  children,
  className,
  error: externalError,
}: FieldBoxProps) {
  const cls = fieldBoxRecipe({ size });
  const formContext = useFormContext?.();
  const [showDebouncedWarning, setShowDebouncedWarning] = useState(false);
  const warningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const fieldState = formContext && name ? formContext.getFieldState(name) : null;
  const formState = formContext?.formState;

  const rhfError = fieldState?.error;
  const resolvedError: FieldError | undefined =
    rhfError ??
    (externalError
      ? typeof externalError === 'string'
        ? ({ message: externalError } as FieldError)
        : externalError
      : undefined);

  const isSubmitted = formState?.isSubmitted ?? false;
  const isTouched = fieldState?.isTouched ?? false;
  const isDirty = fieldState?.isDirty ?? false;

  const { showError, showWarning, message } = deriveValidationState({
    error: resolvedError,
    isSubmitted: externalError ? true : isSubmitted,
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
    if (name && formContext?.trigger) await formContext.trigger(name);
  };

  const showHint = hint && !showError && !(showDebouncedWarning && message);

  // Determine if children include Ark Field primitives (Field.Input / Field.Textarea)
  // which need Field.Root context for label linkage.
  const usesArkField = hasArkFieldInput(children);

  const rootProps = {
    'className': [cls.root, className].filter(Boolean).join(' ') || undefined,
    'data-invalid': showError ? 'true' : undefined,
    'data-required': required ? 'true' : undefined,
    'onBlur': handleBlur,
  };

  const labelNode = label && (
    <span className={cls.label}>
      {label}
      {required && (
        <span className={cls.requiredIndicator} aria-hidden="true">
          *
        </span>
      )}
    </span>
  );

  const feedbackNode = (
    <>
      {showHint && <span className={cls.helperText}>{hint}</span>}
      {showDebouncedWarning && !showError && message && <span className={cls.warningText}>{message}</span>}
      {showError && message && (
        <span className={cls.errorText} role="alert">
          {message}
        </span>
      )}
    </>
  );

  if (usesArkField) {
    return (
      <Field.Root invalid={showError} required={required} {...rootProps}>
        {label && (
          <Field.Label className={cls.label}>
            {label}
            {required && <Field.RequiredIndicator className={cls.requiredIndicator} />}
          </Field.Label>
        )}
        {children}
        {showHint && <Field.HelperText className={cls.helperText}>{hint}</Field.HelperText>}
        {showDebouncedWarning && !showError && message && (
          <Field.HelperText className={cls.warningText}>{message}</Field.HelperText>
        )}
        {showError && message && <Field.ErrorText className={cls.errorText}>{message}</Field.ErrorText>}
      </Field.Root>
    );
  }

  return (
    <div {...rootProps}>
      {labelNode}
      {children}
      {feedbackNode}
    </div>
  );
}

FieldBox.displayName = 'FieldBox';

// ── Helpers ───────────────────────────────────────────────────────────────────

function hasArkFieldInput(children: ReactNode): boolean {
  if (!children) return false;
  const { Children, isValidElement } = require('react');
  return Children.toArray(children).some(
    (child: any) => isValidElement(child) && (child.type === Field.Input || child.type === Field.Textarea),
  );
}
