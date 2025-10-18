import type { FieldError, FieldPath, FieldValues, UseFormReturn } from 'react-hook-form';

import type React from 'react';

// Field configuration for centralized handling
export interface FieldConfig<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  type: 'temperature' | 'time' | 'text' | 'select' | 'number';
  validation?: {
    required?: boolean;
    min?: number;
    max?: number;
    pattern?: RegExp;
    custom?: (value: any, formValues: T) => boolean | string;
  };
  localization?: {
    locale?: string;
    formatOnDisplay?: boolean;
    parseOnInput?: boolean;
  };
  dependencies?: {
    // Fields this field depends on
    dependsOn?: FieldPath<T>[];
    // How this field affects other fields
    affects?: FieldDependencyEffect<T>[];
  };
  constraints?: {
    // Dynamic min/max based on other fields
    dynamicMin?: (formValues: T) => number;
    dynamicMax?: (formValues: T) => number;
    // Enable/disable based on other fields
    enableWhen?: (formValues: T) => boolean;
  };
}

export interface FieldDependencyEffect<T extends FieldValues = FieldValues> {
  targetField: FieldPath<T>;
  effect: 'constrainMax' | 'constrainMin' | 'enable' | 'disable' | 'setValue' | 'validate';
  calculate: (sourceValue: any, formValues: T) => any;
}

// Progressive form configuration (like the table repeater)
export interface ProgressiveFieldConfig<T extends FieldValues = FieldValues> {
  name: FieldPath<T>;
  itemValidation: (item: any, formValues: T) => boolean;
  itemCompletion: (item: any) => boolean;
  enableNextWhen: 'complete' | 'valid' | 'completeAndValid';
  allowEditCompleted?: boolean;
}

// Enhanced form methods that extend RHF
export interface FormMiddlewareContext<T extends FieldValues = FieldValues>
  extends Omit<UseFormReturn<T>, 'setValue' | 'setError' | 'clearErrors'> {
  // Enhanced field operations
  setFieldValue: (
    name: FieldPath<T>,
    value: any,
    options?: {
      shouldValidate?: boolean;
      shouldTouch?: boolean;
      shouldDirty?: boolean;
      triggerDependencies?: boolean;
    },
  ) => void;

  setFieldError: (name: FieldPath<T>, error: string | FieldError) => void;
  clearFieldErrors: (name?: FieldPath<T>) => void;

  // Field state queries
  isFieldEnabled: (name: FieldPath<T>) => boolean;
  isFieldValid: (name: FieldPath<T>) => boolean;
  isFieldComplete: (name: FieldPath<T>) => boolean;
  getFieldConstraints: (name: FieldPath<T>) => { min?: number; max?: number };

  // Progressive form methods
  getEditableItemIndex: (fieldName: FieldPath<T>) => number;
  isItemEditable: (fieldName: FieldPath<T>, index: number) => boolean;

  // Localization helpers
  formatValue: (name: FieldPath<T>, value: any) => string;
  parseValue: (name: FieldPath<T>, displayValue: string) => any;

  // Bulk operations
  generateRandomValues: (fieldName: FieldPath<T>, index?: number) => void;
  validateAllFields: () => boolean;

  // Configuration
  fieldConfigs: Map<FieldPath<T>, FieldConfig<T>>;
  progressiveConfigs: Map<FieldPath<T>, ProgressiveFieldConfig<T>>;
}

// Middleware provider props
export interface FormMiddlewareProviderProps<T extends FieldValues = FieldValues> {
  children: React.ReactNode;
  formMethods: UseFormReturn<T>;
  fieldConfigs?: FieldConfig<T>[];
  progressiveConfigs?: ProgressiveFieldConfig<T>[];
  defaultLocale?: string;
  onFieldChange?: (fieldName: FieldPath<T>, value: any, formValues: T) => void;
}
