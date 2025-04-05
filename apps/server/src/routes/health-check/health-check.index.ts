import { createRouter } from 'lib/create-app';

import * as handlers from './health-check.handler';
import * as routes from './health-check.route';

export const router = createRouter().openapi(routes.healthCheck, handlers.healthCheck);

export default router;
