import { Hono } from 'hono';
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { pinoLogger } from 'middlewares/pino-logger';
import type { AppBindings, AppOpenAPI } from 'types/app.types';

export function createRouter() {
  return new Hono<AppBindings>({ strict: false });
}

export default function createApp() {
  const app = createRouter();

  app.use(async (c, next) => {
    if (c.req.path === '/favicon.ico') {
      return c.text('📡', HttpStatusCodes.OK, {
        'Content-Type': 'image/x-icon',
      });
    }
    await next();
  });

  app.use(pinoLogger());

  app.notFound((c) => {
    return c.json(
      { message: `Not Found - ${c.req.method} ${c.req.path}` },
      HttpStatusCodes.NOT_FOUND,
    );
  });

  app.onError((err, c) => {
    return c.json(
      { message: err.message },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  });

  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route('/', router);
}
