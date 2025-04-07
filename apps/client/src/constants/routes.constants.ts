export const ROUTES = {
  HOME: '/',
  BEVERAGE_TYPE: '/beverage-type',
  BEVERAGE_VOLUME: '/beverage-volume',
  FINAL_TEMPERATURE: '/final-temperature',
  CONTAINER_TYPE: '/container-type',
  INITIAL_TEMPERATURE: '/initial-temperature',
} as const;

export type Routes = (typeof ROUTES)[keyof typeof ROUTES];
