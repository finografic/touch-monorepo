import { paths } from '../lib/env.js';

/**
 * Server-specific path constants
 * Built on top of the shared paths utility from env.shared
 */

// Database paths
export const DATABASE_PATHS = {
  /** Main data directory */
  DATA_DIR: paths.data.dir,
  /** Database migrations directory */
  MIGRATIONS_DIR: paths.data.path('migrations'),
  /** SQLite database files directory */
  DB_DIR: paths.data.path('db'),
} as const;

// Upload paths
export const UPLOAD_PATHS = {
  /** Main uploads directory */
  UPLOADS_DIR: paths.uploads.dir,
  /** Sound files directory */
  SOUNDS_DIR: paths.uploads.path('sounds'),
  /** Images directory */
  IMAGES_DIR: paths.uploads.path('images'),
  /** Temporary files directory */
  TEMP_DIR: paths.uploads.path('temp'),
} as const;

// Logging paths
export const LOG_PATHS = {
  /** Main logs directory */
  LOGS_DIR: paths.logs.dir,
  /** Info log file */
  INFO_LOG: paths.logs.path('info.log'),
  /** Error log file */
  ERROR_LOG: paths.logs.path('error.log'),
  /** Access log file */
  ACCESS_LOG: paths.logs.path('access.log'),
} as const;

// Configuration paths
export const CONFIG_PATHS = {
  /** Root directory */
  ROOT_DIR: paths.root,
  /** Settings file for sound configuration */
  SOUND_SETTINGS: paths.uploads.path('sounds', '_settings.json'),
} as const;

/**
 * All server path constants grouped by category
 */
export const SERVER_PATHS = {
  DATABASE: DATABASE_PATHS,
  UPLOADS: UPLOAD_PATHS,
  LOGS: LOG_PATHS,
  CONFIG: CONFIG_PATHS,
} as const;
