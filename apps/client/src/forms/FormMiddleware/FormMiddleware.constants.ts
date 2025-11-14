// Form Middleware Constants
// Centralized configuration for form inputs, validation, and behavior

// ============================================================================
// DEBOUNCE & TIMING CONSTANTS
// ============================================================================

/** Debounce delay for temperature input typing (ms) */
export const INPUT_DEBOUNCE_DELAY = 1000;

/** Debounce delay for field wrapper validation (ms) */
export const FIELD_WRAPPER_DEBOUNCE_DELAY = 300;

/** Polling interval for admin tools timer checks (ms) */
export const TIMER_POLLING_INTERVAL = 5000;

/** Demo form submission delay (ms) */
export const DEMO_FORM_SUBMISSION_DELAY = 1000;

/** Constraint warning auto-correction timeout (ms) */
export const CONSTRAINT_WARNING_TIMEOUT = 2000;

// ============================================================================
// TEMPERATURE CONSTANTS
// ============================================================================

/** Default minimum temperature constraint (°C) */
export const DEFAULT_TEMP_MIN = -50;

/** Default maximum temperature constraint (°C) */
export const DEFAULT_TEMP_MAX = 50;

/** Maximum temperature for consume temp (°C) */
export const TEMP_CONSUME_MAX = 40;

/** Temperature step increment/decrement (°C) */
export const TEMP_STEP = 0.5;

/** Temperature rounding precision (decimal places * 10) */
export const TEMP_ROUNDING_PRECISION = 10;

// ============================================================================
// TIME CONSTANTS
// ============================================================================

/** Maximum time value in seconds (1 hour) */
export const MAX_TIME_SECONDS = 3600;

/** Time step increment/decrement (seconds) */
export const TIME_STEP = 30;

/** Maximum time for random generation (30 minutes) */
export const MAX_RANDOM_TIME = 1800;

/** Minimum time for random generation (seconds) */
export const MIN_RANDOM_TIME = 30;

// ============================================================================
// NUMBER FORMATTING CONSTANTS
// ============================================================================

/** Number formatting: minimum fraction digits */
export const MIN_FRACTION_DIGITS = 1;

/** Number formatting: maximum fraction digits */
export const MAX_FRACTION_DIGITS = 1;

// ============================================================================
// LOCALIZATION CONSTANTS
// ============================================================================

/** Default locale for Spanish localization */
export const DEFAULT_SPANISH_LOCALE = 'es-ES';

/** Default locale fallback */
export const DEFAULT_LOCALE = 'es-ES';

/** Comma separator for Spanish number input */
export const SPANISH_DECIMAL_SEPARATOR = ',';

/** Dot separator for internal number storage */
export const INTERNAL_DECIMAL_SEPARATOR = '.';

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/** Mode selection minimum value */
export const MODE_MIN = 1;

/** Mode selection maximum value */
export const MODE_MAX = 5;

/** Default minimum value for random generation */
export const DEFAULT_RANDOM_MIN = 0;

/** Default maximum value for random generation */
export const DEFAULT_RANDOM_MAX = 100;

// ============================================================================
// UI CONSTANTS
// ============================================================================

/** Default placeholder for temperature inputs */
export const TEMP_INPUT_PLACEHOLDER = '0';

/** Default placeholder for time inputs */
export const TIME_INPUT_PLACEHOLDER = '00:00';

/** Icon button size for step controls */
export const STEP_BUTTON_SIZE = '1' as const;

/** Step button variant */
export const STEP_BUTTON_VARIANT = 'ghost' as const;

// ============================================================================
// PROGRESS & NOTIFICATION CONSTANTS
// ============================================================================

/** Message display duration (ms) */
export const MESSAGE_DISPLAY_DURATION = 5000;

/** Short message display duration (ms) */
export const SHORT_MESSAGE_DURATION = 3000;

/** Language selector highlight duration (ms) */
export const HIGHLIGHT_DURATION = 1500;

/** Toast warning duration (ms) */
export const TOAST_WARNING_DURATION = 5000;

// ============================================================================
// FORM CONFIGURATION CONSTANTS
// ============================================================================

/** Minimum rows for times table repeater (total form data) */
// export const MIN_TABLE_ROWS = 50; // TODO: 50
export const MIN_TABLE_ROWS = 15; // TODO: 50

/** Default table row values */
export const DEFAULT_EMPTY_ROW = {
  temperature: undefined,
  timeA: undefined,
  timeB: undefined,
  timeC: undefined,
};

// ============================================================================
// QUERY & CACHING CONSTANTS
// ============================================================================

/** Query retry delay base (ms) */
export const QUERY_RETRY_DELAY_BASE = 1000;

/** Query maximum retry delay (ms) */
export const QUERY_MAX_RETRY_DELAY = 30000;

/** Query stale time (5 minutes in ms) */
export const QUERY_STALE_TIME = 1000 * 60 * 5;

/** Query garbage collection time (30 minutes in ms) */
export const QUERY_GC_TIME = 1000 * 60 * 30;
