/**
 * Project configuration exports
 * Centralized configuration for better template reusability
 */

// API configurations
export * from './api';

// Application configurations
export * from './app';

// Error configurations
export * from './errors';

export * from './routes/paths.constants';

// Re-export commonly used configurations for convenience
export { ADMIN_PATHS, ALTERNATIVE_PATHS, PATHS, ROUTE_ACTION_SLUGS } from './routes/paths.constants';
// Route configurations
export * from './routes/routes.config';

export { ROUTES_CONFIG } from './routes/routes.config';
// UI configurations
export * from './ui';
