import type { AppRouteHandler } from 'types/app.types';
import type { HealthCheckRoute } from './health-check.route';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export const healthCheck: AppRouteHandler<HealthCheckRoute> = (context) => {
  return context.json(
    {
      success: true,
      message: 'Hello Hono!',
    },
    HttpStatusCodes.OK,
  );
};
