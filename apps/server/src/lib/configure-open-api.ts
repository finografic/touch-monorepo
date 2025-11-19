import { apiReference } from '@scalar/hono-api-reference';

import type { AppOpenAPI } from 'types/app.types';
import packageJSON from '../../../../package.json';

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
        targetKey: 'js',
        clientKey: 'fetch',
      },
      // The spec property has been removed in newer versions
      // The API reference will automatically use the OpenAPI spec from /doc
    }),
  );
}
