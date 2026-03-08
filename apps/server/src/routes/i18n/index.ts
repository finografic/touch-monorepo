import * as v from 'valibot';
import { validator } from 'hono-openapi';

import { createRouter } from 'lib/create-app';
import * as handlers from './i18n.handlers';
import * as routes from './i18n.routes';

const namespaceParamSchema = v.object({
  namespace: v.string(),
});

const namespaceQuerySchema = v.object({
  lng: v.string(),
});

const domainParamSchema = v.object({
  domain: v.picklist(['ui', 'app', 'admin']),
});

const domainQuerySchema = v.object({
  lng: v.optional(v.string()),
});

export default createRouter()
  // More specific route registered before /:namespace to avoid param capture conflicts
  .get(routes.getDomain.path,    routes.getDomain,   validator('param', domainParamSchema), validator('query', domainQuerySchema), handlers.getDomain)
  .get(routes.getNamespace.path,    routes.getNamespace,   validator('param', namespaceParamSchema), validator('query', namespaceQuerySchema), handlers.getNamespace);
