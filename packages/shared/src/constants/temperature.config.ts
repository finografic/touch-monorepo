export const TEMP_CONSUME_FORM_DEFAULT = 25;
export const TEMP_CONSUME_DEFAULT = 5;
export const TEMP_CONSUME_MIN = 10;
export const TEMP_CONSUME_MAX = 30;

export const TEMP_FREEZE_FORM_DEFAULT = 8;
export const TEMP_FREEZE_DEFAULT = -2;
export const TEMP_FREEZE_MIN = 10;
export const TEMP_FREEZE_MAX = 40;

/** Bounds for drink_types / drink_subtypes (and client clamp). Stricter than form bounds. */
export const TEMP_CONSUME_SCHEMA_MIN = -10;
export const TEMP_CONSUME_SCHEMA_MAX = 30;
export const TEMP_FREEZE_SCHEMA_MIN = -20;
export const TEMP_FREEZE_SCHEMA_MAX = 10;

// Minimum difference that must be maintained between initial and final temperatures
export const MIN_TEMP_DIFFERENCE = 0; // in °C
