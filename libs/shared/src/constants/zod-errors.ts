export const ZOD_ERROR_CODES = {
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

export const ZOD_ERROR_MESSAGES = {
  [ZOD_ERROR_CODES.INVALID_TYPE]: 'Invalid type',
  [ZOD_ERROR_CODES.REQUIRED]: 'Required',
  [ZOD_ERROR_CODES.INVALID_LITERAL]: 'Invalid literal value',
  [ZOD_ERROR_CODES.INVALID_UNION]: 'Invalid input',
  [ZOD_ERROR_CODES.INVALID_UNION_DISCRIMINATOR]: 'Invalid discriminator value',
  [ZOD_ERROR_CODES.INVALID_ENUM_VALUE]: 'Invalid enum value',
  [ZOD_ERROR_CODES.TOO_SMALL]: 'Too small',
  [ZOD_ERROR_CODES.TOO_BIG]: 'Too big',
  [ZOD_ERROR_CODES.INVALID_STRING]: 'Invalid string',
  [ZOD_ERROR_CODES.INVALID_DATE]: 'Invalid date',
  [ZOD_ERROR_CODES.CUSTOM]: 'Invalid value',
} as const;
