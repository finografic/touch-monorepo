import type { AppOpenAPI } from 'types/app.types';
import { apiReference } from '@scalar/hono-api-reference';
import packageJSON from '../../package.json' with { type: 'json' };

export default function configureOpenAPI(app: AppOpenAPI) {
  app.doc('/doc', {
    openapi: '3.0.0',
    info: {
      version: (packageJSON as any).version,
      title: 'IOX API',
    },
  });

  app.get(
    '/reference',
    apiReference({
      theme: 'kepler',
      layout: 'classic',
      defaultHttpClient: {
        targetKey: 'javascript',
        clientKey: 'fetch',
      },
      spec: {
        url: '/doc',
      },
    }),
  );
}
