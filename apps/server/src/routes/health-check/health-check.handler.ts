import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import type { AppHandler } from 'types/app.types';

export const healthCheck: AppHandler = (context) => {
  return context.json(
    {
      success: true,
      message: 'Hello Hono!',
    },
    HttpStatusCodes.OK,
  );
};
