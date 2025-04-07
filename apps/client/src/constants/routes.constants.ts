export const ROUTES = {
  HOME: '/',
  DRINK_TYPE: '/drink-type',
  DRINK_VOLUME: '/drink-volume',
  FINAL_TEMPERATURE: '/final-temperature',
  CONTAINER_TYPE: '/container-type',
  INITIAL_TEMPERATURE: '/initial-temperature',
} as const;

export type Routes = (typeof ROUTES)[keyof typeof ROUTES];
