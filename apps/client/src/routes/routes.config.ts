import type { RouteConfig } from 'routes/routes.types';
import { BUTTON_TYPES } from 'types/button.types';
import { ADMIN_PATHS, FLOW_PATHS, ROUTE_PATHS } from '../constants/paths.constants.js';

// Re-export for backward compatibility
export const PATHS = ROUTE_PATHS;

// Additional paths for alternative flows
export const ALTERNATIVE_PATHS = {
  time: FLOW_PATHS.TIME,
  admin: ADMIN_PATHS.ADMIN_HOME,
} as const;

export const ROUTE_ACTION_SLUGS = ['new', 'view', 'edit', 'create', 'delete'] as const;

export const ROUTES_CONFIG: RouteConfig[] = [
  {
    path: PATHS.main,
    id: 'main',
    title: 'ServiFresc',
    buttons: {
      footer: [BUTTON_TYPES.CANCEL, BUTTON_TYPES.RESET, BUTTON_TYPES.ALL],
      content: [BUTTON_TYPES.PROGRAM_TIME, BUTTON_TYPES.PROGRAM_PRODUCT, BUTTON_TYPES.REPEAT_SELECTION],
    },
  },
  {
    path: PATHS.drinkType,
    id: 'drinkType',
    title: 'Select drink type:',
    buttons: {
      footer: [BUTTON_TYPES.CANCEL_PRODUCT_SESSION, BUTTON_TYPES.NEXT],
      content: [],
    },
  },
  {
    path: PATHS.drinkSubtype,
    id: 'drinkSubtype',
    title: 'Select drink subtype:',
    buttons: {
      footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
      content: [],
    },
  },
  {
    path: PATHS.drinkVolume,
    id: 'drinkVolume',
    title: 'Select volume:',
    buttons: {
      footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
      content: [],
    },
  },
  {
    path: PATHS.containerType,
    id: 'containerType',
    title: 'Select container type:',
    buttons: {
      footer: [BUTTON_TYPES.BACK, BUTTON_TYPES.NEXT],
      content: [],
    },
  },
  {
    path: PATHS.temperature,
    id: 'temperature',
    title: 'Select initial and final temperatures:',
    buttons: {
      footer: [
        BUTTON_TYPES.BACK,
        // BUTTON_TYPES.START,
        BUTTON_TYPES.FINISH_PRODUCT,
      ],
      content: [],
    },
  },
];
