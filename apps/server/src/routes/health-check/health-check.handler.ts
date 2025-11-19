import * as HttpStatusCodes from 'stoker/http-status-codes';

import type { AppRouteHandler } from 'types/app.types';
import type { HealthCheckRoute } from './health-check.route';

export const healthCheck: AppRouteHandler<HealthCheckRoute> = (context) => {
  return context.json(
    {
      success: true,
      message: 'Hello Hono!',
    },
    HttpStatusCodes.OK,
  );
};
