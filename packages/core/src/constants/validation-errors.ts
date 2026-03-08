export const VALIDATION_ERROR_CODES = {
  INVALID_TYPE: 'invalid_type',
  REQUIRED: 'required',
  INVALID_LITERAL: 'invalid_literal',
  INVALID_UNION: 'invalid_union',
  INVALID_UNION_DISCRIMINATOR: 'invalid_union_discriminator',
  INVALID_ENUM_VALUE: 'invalid_enum_value',
  TOO_SMALL: 'too_small',
  TOO_BIG: 'too_big',
  INVALID_STRING: 'invalid_string',
  INVALID_DATE: 'invalid_date',
  CUSTOM: 'custom',
} as const;

export const VALIDATION_ERROR_MESSAGES = {
  [VALIDATION_ERROR_CODES.INVALID_TYPE]: 'Invalid type',
  [VALIDATION_ERROR_CODES.REQUIRED]: 'Required',
  [VALIDATION_ERROR_CODES.INVALID_LITERAL]: 'Invalid literal value',
  [VALIDATION_ERROR_CODES.INVALID_UNION]: 'Invalid input',
  [VALIDATION_ERROR_CODES.INVALID_UNION_DISCRIMINATOR]: 'Invalid discriminator value',
  [VALIDATION_ERROR_CODES.INVALID_ENUM_VALUE]: 'Invalid enum value',
  [VALIDATION_ERROR_CODES.TOO_SMALL]: 'Too small',
  [VALIDATION_ERROR_CODES.TOO_BIG]: 'Too big',
  [VALIDATION_ERROR_CODES.INVALID_STRING]: 'Invalid string',
  [VALIDATION_ERROR_CODES.INVALID_DATE]: 'Invalid date',
  [VALIDATION_ERROR_CODES.CUSTOM]: 'Invalid value',
} as const;

/** @deprecated Use VALIDATION_ERROR_CODES instead */
export const ZOD_ERROR_CODES = VALIDATION_ERROR_CODES;
/** @deprecated Use VALIDATION_ERROR_MESSAGES instead */
export const ZOD_ERROR_MESSAGES = VALIDATION_ERROR_MESSAGES;
