import { Hono } from 'hono';
import { notFound, onError, serveEmojiFavicon } from 'stoker/middlewares';

import { pinoLogger } from 'middlewares/pino-logger';
import type { AppBindings, AppOpenAPI } from 'types/app.types';

export function createRouter() {
  return new Hono<AppBindings>({ strict: false });
}

export default function createApp() {
  const app = createRouter();
  app.use(serveEmojiFavicon('📡'));
  app.use(pinoLogger());
  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp<R extends AppOpenAPI>(router: R) {
  return createApp().route('/', router);
}
