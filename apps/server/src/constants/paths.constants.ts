import { paths } from '@workspace/config/paths';

/**
 * Server-specific path constants
 * Built on top of the shared paths utility from env.shared
 */

// Database paths
export const DATABASE_PATHS = {
  DATA_DIR: paths.data.dir,
  MIGRATIONS_DIR: paths.data.path('migrations'),
  DB_DIR: paths.data.path('db'),
} as const;

// Upload paths
export const UPLOAD_PATHS = {
  UPLOADS_DIR: paths.uploads.dir,
  SOUNDS_DIR: paths.uploads.path('sounds'),
  IMAGES_DIR: paths.uploads.path('images'),
  TEMP_DIR: paths.uploads.path('temp'),
} as const;

// Logging paths
export const LOG_PATHS = {
  LOGS_DIR: paths.logs.dir,
  INFO_LOG: paths.logs.path('info.log'),
  ERROR_LOG: paths.logs.path('error.log'),
  ACCESS_LOG: paths.logs.path('access.log'),
} as const;

// Configuration paths
export const CONFIG_PATHS = {
  ROOT_DIR: paths.root,
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
