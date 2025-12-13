import type { UseFormProps, KeepStateOptions, FormState, FieldValues, SetValueConfig } from 'react-hook-form';

// https://react-hook-form.com/api/useform
export const defaultOptionsRHF: UseFormProps = {
  mode: 'onSubmit',
  reValidateMode: 'onChange',
  defaultValues: {},
  resolver: undefined,
  context: undefined,
  shouldFocusError: true,
  shouldUnregister: false,
  criteriaMode: 'firstError',
  // EXTRAS
  shouldUseNativeValidation: false,
  delayError: undefined,
};

// CUSTOM OVERRIDES
// TODO: NOTE - PERHAPS BEST UX:
// 1. initial form state - mode:'onBlur'
// 2. after submitting with errors: mode:'onChange' (for easy FIXING)
const customOptionsRHF: Partial<UseFormProps> = {
  mode: 'onChange', // DEFAULT: 'onChange'
  reValidateMode: 'onChange', // DEFAULT: 'onChange'
  criteriaMode: 'all',
  // resolver: joiResolver(schemaJoi), // TODO: USE ZOD !!
};

// CUSTOM OVERRIDES
export const optionsRHF: UseFormProps = {
  ...defaultOptionsRHF,
  ...customOptionsRHF,
};

// ========================================================================== //

// RHF FORM-STATE: destructured from formState + useFormState()
// https://react-hook-form.com/api/useform/formstate
// https://react-hook-form.com/api/useformstate

export const initFormStateRHF: FormState<FieldValues> = {
  isReady: false,
  isDirty: false,
  isLoading: false,
  disabled: false,
  dirtyFields: {},
  touchedFields: {},
  errors: {},
  validatingFields: {},
  isValid: false,
  isValidating: false,
  isSubmitted: false,
  isSubmitSuccessful: false,
  isSubmitting: false,
  submitCount: 0,
};

// ========================================================================== //
// NOTE: FORM RESET OPTIONS..

export const optionsFormReset: KeepStateOptions = {
  keepErrors: false,
  keepDirty: false,
  keepTouched: false,
  keepIsValid: false,
  keepDirtyValues: false,
  keepValues: false,
  keepDefaultValues: false,
  keepIsValidating: false,
  keepIsSubmitted: true,
  keepSubmitCount: true,
  keepIsSubmitSuccessful: true,
};

export const optionsFormResetQuiet: KeepStateOptions = {
  keepDirty: false,
  keepTouched: false,
};

// ========================================================================== //
// NOTE: FIED SET OPTIONS, `setValue`..

export const optionsSetQuiet: SetValueConfig = {
  shouldValidate: false,
  shouldDirty: false,
  shouldTouch: false,
};

export const optionsSetLoud: SetValueConfig = {
  shouldValidate: true,
  shouldDirty: true,
  shouldTouch: true,
};

export const optionsAutofill: SetValueConfig = {
  shouldValidate: false,
  shouldDirty: true,
  shouldTouch: true,
};
