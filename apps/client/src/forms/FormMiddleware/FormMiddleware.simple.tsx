import React, { createContext, useCallback, useContext, useMemo } from 'react';
import type { FieldError, FieldPath, FieldValues } from 'react-hook-form';
import type { FieldConfig, FormMiddlewareContext, FormMiddlewareProviderProps } from './FormMiddleware.types';

// Create the context
const FormMiddlewareContextValue = createContext<FormMiddlewareContext<any> | null>(null);

// Custom hook to use the middleware context
export const useFormMiddleware = <T extends FieldValues = FieldValues>(): FormMiddlewareContext<T> => {
  const context = useContext(FormMiddlewareContextValue);
  if (!context) {
    throw new Error('useFormMiddleware must be used within a FormMiddlewareProvider');
  }
  return context as FormMiddlewareContext<T>;
};

// Simple middleware provider to start with
export const FormMiddlewareProvider = <T extends FieldValues = FieldValues>({
  children,
  formMethods,
  fieldConfigs = [],
  defaultLocale = 'es-ES',
  onFieldChange,
}: FormMiddlewareProviderProps<T>) => {
  const { setValue, setError, clearErrors, watch, getFieldState, formState } = formMethods;

  // Convert field configs to a map
  const fieldConfigsMap = useMemo(() => {
    const map = new Map<FieldPath<T>, FieldConfig<T>>();
    fieldConfigs.forEach((config) => map.set(config.name, config));
    return map;
  }, [fieldConfigs]);

  const formValues = watch();

  // Enhanced setValue with dependency handling
  const setFieldValue = useCallback(
    (
      name: FieldPath<T>,
      value: any,
      options: {
        shouldValidate?: boolean;
        shouldTouch?: boolean;
        shouldDirty?: boolean;
      } = {},
    ) => {
      const { shouldValidate = true, shouldTouch = true, shouldDirty = true } = options;

      setValue(name, value, { shouldValidate, shouldTouch, shouldDirty });
      onFieldChange?.(name, value, formValues);
    },
    [setValue, formValues, onFieldChange],
  );

  // Get field constraints (dynamic or static)
  const getFieldConstraints = useCallback(
    (name: FieldPath<T>) => {
      const fieldConfig = fieldConfigsMap.get(name);
      const constraints: { min?: number; max?: number } = {};

      if (fieldConfig?.constraints?.dynamicMin) {
        constraints.min = fieldConfig.constraints.dynamicMin(formValues);
      } else if (fieldConfig?.validation?.min) {
        constraints.min = fieldConfig.validation.min;
      }

      if (fieldConfig?.constraints?.dynamicMax) {
        constraints.max = fieldConfig.constraints.dynamicMax(formValues);
      } else if (fieldConfig?.validation?.max) {
        constraints.max = fieldConfig.validation.max;
      }

      return constraints;
    },
    [fieldConfigsMap, formValues],
  );

  // Format value for display (localization)
  const formatValue = useCallback(
    (name: FieldPath<T>, value: any): string => {
      const fieldConfig = fieldConfigsMap.get(name);

      if (!fieldConfig?.localization?.formatOnDisplay || typeof value !== 'number') {
        return String(value);
      }

      const locale = fieldConfig.localization.locale || defaultLocale;

      if (fieldConfig.type === 'temperature') {
        return new Intl.NumberFormat(locale, {
          minimumFractionDigits: 1,
          maximumFractionDigits: 1,
        }).format(value);
      }

      return String(value);
    },
    [fieldConfigsMap, defaultLocale],
  );

  // Parse input value (localization)
  const parseValue = useCallback(
    (name: FieldPath<T>, displayValue: string): any => {
      const fieldConfig = fieldConfigsMap.get(name);

      if (!fieldConfig?.localization?.parseOnInput) {
        return displayValue;
      }

      if (fieldConfig.type === 'temperature' || fieldConfig.type === 'number') {
        const normalizedValue = displayValue.replace(',', '.');
        const parsed = Number.parseFloat(normalizedValue);
        return Number.isNaN(parsed) ? undefined : parsed;
      }

      return displayValue;
    },
    [fieldConfigsMap],
  );

  // Simple field state queries
  const isFieldEnabled = useCallback(
    (name: FieldPath<T>): boolean => {
      const fieldConfig = fieldConfigsMap.get(name);
      if (fieldConfig?.constraints?.enableWhen) {
        return fieldConfig.constraints.enableWhen(formValues);
      }
      return true;
    },
    [fieldConfigsMap, formValues],
  );

  const isFieldValid = useCallback(
    (name: FieldPath<T>): boolean => {
      const fieldState = getFieldState(name);
      return !fieldState.error;
    },
    [getFieldState],
  );

  const isFieldComplete = useCallback(
    (name: FieldPath<T>): boolean => {
      const value = formValues[name];
      return value !== undefined && value !== '' && value !== null;
    },
    [formValues],
  );

  // Enhanced error handling
  const setFieldError = useCallback(
    (name: FieldPath<T>, error: string | FieldError) => {
      const errorObj = typeof error === 'string' ? { type: 'validation', message: error } : error;
      setError(name, errorObj);
    },
    [setError],
  );

  const clearFieldErrors = useCallback(
    (name?: FieldPath<T>) => {
      if (name) {
        clearErrors(name);
      } else {
        clearErrors();
      }
    },
    [clearErrors],
  );

  // Placeholder implementations for full interface
  const getEditableItemIndex = useCallback(() => -1, []);
  const isItemEditable = useCallback(() => true, []);
  const generateRandomValues = useCallback(() => {}, []);
  const validateAllFields = useCallback(() => formState.isValid, [formState.isValid]);

  // Create the context value
  const contextValue = useMemo(
    (): FormMiddlewareContext<T> => ({
      ...formMethods,
      setFieldValue,
      setFieldError,
      clearFieldErrors,
      isFieldEnabled,
      isFieldValid,
      isFieldComplete,
      getFieldConstraints,
      getEditableItemIndex,
      isItemEditable,
      formatValue,
      parseValue,
      generateRandomValues,
      validateAllFields,
      fieldConfigs: fieldConfigsMap,
      progressiveConfigs: new Map(),
    }),
    [
      formMethods,
      setFieldValue,
      setFieldError,
      clearFieldErrors,
      isFieldEnabled,
      isFieldValid,
      isFieldComplete,
      getFieldConstraints,
      getEditableItemIndex,
      isItemEditable,
      formatValue,
      parseValue,
      generateRandomValues,
      validateAllFields,
      fieldConfigsMap,
    ],
  );

  return (
    <FormMiddlewareContextValue.Provider value={contextValue}>{children}</FormMiddlewareContextValue.Provider>
  );
};
