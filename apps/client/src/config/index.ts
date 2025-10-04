/**
 * Project configuration exports
 * Centralized configuration for better template reusability
 */

// Route configurations
export * from './routes/routes.config';
export * from './routes/paths.constants';

// Re-export commonly used configurations
export { PATHS, ALTERNATIVE_PATHS, ADMIN_PATHS, ROUTE_ACTION_SLUGS } from './routes/paths.constants';
export { ROUTES_CONFIG } from './routes/routes.config';
