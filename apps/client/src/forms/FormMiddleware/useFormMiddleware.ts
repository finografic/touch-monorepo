import { useContext } from 'react';
import type { FieldValues } from 'react-hook-form';

import { FormMiddlewareContextValue } from 'forms/FormMiddleware/FormMiddleware.simple';

import type { FormMiddlewareContext } from './FormMiddleware.types';

export const useFormMiddleware = <T extends FieldValues = FieldValues>(): FormMiddlewareContext<T> => {
  const context = useContext(FormMiddlewareContextValue);
  if (!context) {
    throw new Error('useFormMiddleware must be used within a FormMiddlewareProvider');
  }
  return context as FormMiddlewareContext<T>;
};

export const useOptionalFormMiddleware = <
  T extends FieldValues = FieldValues,
>(): FormMiddlewareContext<T> | null => {
  return useContext(FormMiddlewareContextValue) as FormMiddlewareContext<T> | null;
};
