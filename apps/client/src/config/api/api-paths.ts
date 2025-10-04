/**
 * API endpoint paths for client-side API calls
 * These are the endpoints the client uses to communicate with the server
 */

export const API_PATHS = {
  AUTH: '/api/auth',
  ORDERS: '/api/orders',
  SOUNDS: '/api/sounds',
  TRANSLATIONS: '/api/translations',
  UI_LABELS: '/api/ui-labels',
  MODES: '/api/modes',
  DRINK_TYPES: '/api/drink-types',
  DRINK_SUBTYPES: '/api/drink-subtypes',
  DRINK_VOLUMES: '/api/drink-volumes',
  CONTAINER_TYPES: '/api/container-types',
  TEMPERATURES: '/api/temperatures',
} as const;
