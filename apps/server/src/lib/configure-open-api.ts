import { apiReference } from '@scalar/hono-api-reference';
import { openAPIRouteHandler } from 'hono-openapi';

import type { AppOpenAPI } from 'types/app.types';
import packageJSON from '../../../../package.json';

export default function configureOpenAPI(app: AppOpenAPI) {
  app.get(
    '/doc',
    openAPIRouteHandler(app, {
      documentation: {
        openapi: '3.0.0',
        info: {
          version: (packageJSON as any).version,
          title: 'IOX API',
        },
      },
    }),
  );

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'js',
        clientKey: 'fetch',
      },
    }),
  );
}
