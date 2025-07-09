import React, { createContext, useCallback, useContext, useEffect, useMemo } from 'react';
import type { FieldPath, FieldValues } from 'react-hook-form';
import type {
  FieldConfig,
  FieldDependencyEffect,
  FormMiddlewareContext,
  FormMiddlewareProviderProps,
  ProgressiveFieldConfig,
} from './FormMiddleware.types';

// Create the context
const FormMiddlewareContextValue = createContext<FormMiddlewareContext | null>(null);

// Custom hook to use the middleware context
export const useFormMiddleware = <T extends FieldValues = FieldValues>(): FormMiddlewareContext<T> => {
  const context = useContext(FormMiddlewareContextValue);
  if (!context) {
    throw new Error('useFormMiddleware must be used within a FormMiddlewareProvider');
  }
  return context as FormMiddlewareContext<T>;
};

// Main middleware provider
export const FormMiddlewareProvider = <T extends FieldValues = FieldValues>({
  children,
  formMethods,
  fieldConfigs = [],
  progressiveConfigs = [],
  defaultLocale = 'es-ES',
  onFieldChange,
}: FormMiddlewareProviderProps<T>) => {
  const { setValue, setError, clearErrors, watch, trigger, getFieldState, formState } = formMethods;

  // Convert arrays to Maps for efficient lookups
  const fieldConfigsMap = useMemo(() => {
    const map = new Map<FieldPath<T>, FieldConfig<T>>();
    fieldConfigs.forEach((config) => map.set(config.name, config));
    return map;
  }, [fieldConfigs]);

  const progressiveConfigsMap = useMemo(() => {
    const map = new Map<FieldPath<T>, ProgressiveFieldConfig<T>>();
    progressiveConfigs.forEach((config) => map.set(config.name, config));
    return map;
  }, [progressiveConfigs]);

  // Watch all form values for dependency calculations
  const formValues = watch();

  // Enhanced setValue that handles dependencies
  const setFieldValue = useCallback(
    (
      name: FieldPath<T>,
      value: any,
      options: {
        shouldValidate?: boolean;
        shouldTouch?: boolean;
        shouldDirty?: boolean;
        triggerDependencies?: boolean;
      } = {},
    ) => {
      const {
        shouldValidate = true,
        shouldTouch = true,
        shouldDirty = true,
        triggerDependencies = true,
      } = options;

      // Set the value using RHF
      setValue(name, value, { shouldValidate, shouldTouch, shouldDirty });

      // Handle field dependencies
      if (triggerDependencies) {
        const fieldConfig = fieldConfigsMap.get(name);
        if (fieldConfig?.dependencies?.affects) {
          fieldConfig.dependencies.affects.forEach((effect: FieldDependencyEffect<T>) => {
            handleFieldDependency(effect, value, formValues);
          });
        }
      }

      // Call external change handler
      onFieldChange?.(name, value, formValues);
    },
    [setValue, fieldConfigsMap, formValues, onFieldChange, handleFieldDependency],
  );

  // Handle individual field dependencies
  const handleFieldDependency = useCallback(
    (effect: FieldDependencyEffect<T>, sourceValue: any, currentFormValues: T) => {
      const newValue = effect.calculate(sourceValue, currentFormValues);

      switch (effect.effect) {
        case 'setValue':
          setValue(effect.targetField, newValue, { shouldValidate: true });
          break;
        case 'constrainMax':
        case 'constrainMin':
          // These are handled in getFieldConstraints
          break;
        case 'validate':
          trigger(effect.targetField);
          break;
        case 'enable':
        case 'disable':
          // These are handled in isFieldEnabled
          break;
      }
    },
    [setValue, trigger],
  );

  // Enhanced field state queries
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

  // Progressive form methods
  const getEditableItemIndex = useCallback(
    (fieldName: FieldPath<T>): number => {
      const progressiveConfig = progressiveConfigsMap.get(fieldName);
      if (!progressiveConfig) return -1;

      const items = (formValues[fieldName] as any[]) || [];

      // Find first item that doesn't meet the criteria
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        const isComplete = progressiveConfig.itemCompletion(item);
        const isValid = progressiveConfig.itemValidation(item, formValues);

        switch (progressiveConfig.enableNextWhen) {
          case 'complete':
            if (!isComplete) return i;
            break;
          case 'valid':
            if (!isValid) return i;
            break;
          case 'completeAndValid':
            if (!isComplete || !isValid) return i;
            break;
        }
      }

      return -1; // All items meet criteria
    },
    [progressiveConfigsMap, formValues],
  );

  const isItemEditable = useCallback(
    (fieldName: FieldPath<T>, index: number): boolean => {
      const progressiveConfig = progressiveConfigsMap.get(fieldName);
      if (!progressiveConfig) return true;

      const editableIndex = getEditableItemIndex(fieldName);

      // Current editable item
      if (index === editableIndex) return true;

      // Already completed items (if allowed)
      if (progressiveConfig.allowEditCompleted) {
        const items = (formValues[fieldName] as any[]) || [];
        const item = items[index];
        if (
          item &&
          progressiveConfig.itemCompletion(item) &&
          progressiveConfig.itemValidation(item, formValues)
        ) {
          return true;
        }
      }

      return false;
    },
    [progressiveConfigsMap, formValues, getEditableItemIndex],
  );

  // Localization helpers
  const formatValue = useCallback(
    (name: FieldPath<T>, value: any): string => {
      const fieldConfig = fieldConfigsMap.get(name);

      if (!fieldConfig?.localization?.formatOnDisplay) {
        return String(value);
      }

      const locale = fieldConfig.localization.locale || defaultLocale;

      switch (fieldConfig.type) {
        case 'temperature':
          if (typeof value === 'number') {
            return new Intl.NumberFormat(locale, {
              minimumFractionDigits: 1,
              maximumFractionDigits: 1,
            }).format(value);
          }
          break;
        case 'number':
          if (typeof value === 'number') {
            return new Intl.NumberFormat(locale).format(value);
          }
          break;
        case 'time':
          if (typeof value === 'number') {
            const mins = Math.floor(value / 60);
            const secs = value % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }
          break;
      }

      return String(value);
    },
    [fieldConfigsMap, defaultLocale],
  );

  const parseValue = useCallback(
    (name: FieldPath<T>, displayValue: string): any => {
      const fieldConfig = fieldConfigsMap.get(name);

      if (!fieldConfig?.localization?.parseOnInput) {
        return displayValue;
      }

      switch (fieldConfig.type) {
        case 'temperature':
        case 'number':
          // Convert comma to dot for Spanish locales
          const normalizedValue = displayValue.replace(',', '.');
          const parsed = Number.parseFloat(normalizedValue);
          return isNaN(parsed) ? undefined : parsed;

        case 'time':
          if (displayValue.includes(':')) {
            const [mins, secs] = displayValue.split(':').map(Number);
            if (!isNaN(mins) && !isNaN(secs)) {
              return mins * 60 + secs;
            }
          }
          return undefined;
      }

      return displayValue;
    },
    [fieldConfigsMap],
  );

  // Enhanced error handling
  const setFieldError = useCallback(
    (name: FieldPath<T>, error: string | import('react-hook-form').FieldError) => {
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

  // Bulk operations
  const generateRandomValues = useCallback(
    (fieldName: FieldPath<T>, index?: number) => {
      const fieldConfig = fieldConfigsMap.get(fieldName);
      if (!fieldConfig) return;

      const constraints = getFieldConstraints(fieldName);
      const min = constraints.min ?? fieldConfig.validation?.min ?? 0;
      const max = constraints.max ?? fieldConfig.validation?.max ?? 100;

      let randomValue: any;

      switch (fieldConfig.type) {
        case 'temperature':
          randomValue = Math.round((Math.random() * (max - min) + min) * 2) / 2; // Round to 0.5
          break;
        case 'time':
          randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
          randomValue = Math.round(randomValue / 30) * 30; // Round to 30 seconds
          break;
        case 'number':
          randomValue = Math.floor(Math.random() * (max - min + 1)) + min;
          break;
        default:
          return;
      }

      const targetFieldName = index !== undefined ? (`${fieldName}.${index}` as FieldPath<T>) : fieldName;
      setFieldValue(targetFieldName, randomValue);
    },
    [fieldConfigsMap, getFieldConstraints, setFieldValue],
  );

  const validateAllFields = useCallback((): boolean => {
    return formState.isValid;
  }, [formState.isValid]);

  // Create the enhanced context value
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
      progressiveConfigs: progressiveConfigsMap,
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
      progressiveConfigsMap,
    ],
  );

  return (
    <FormMiddlewareContextValue.Provider value={contextValue}>{children}</FormMiddlewareContextValue.Provider>
  );
};
