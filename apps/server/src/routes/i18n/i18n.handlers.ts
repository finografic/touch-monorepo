import * as HttpStatusCodes from 'stoker/http-status-codes';

import { db } from 'db';
import type { AppRouteHandler } from 'types/app.types';
import type { GetNamespaceRoute, GetDomainRoute } from './i18n.routes';
import { buildDomainGroupedResources, buildI18nResources } from './i18n.routes';

/**
 * Bulk load endpoint: Returns all domains grouped under ui, app, admin
 * GET /api/i18n/translations?lng=es-ES
 */
export const getNamespace: AppRouteHandler<GetNamespaceRoute> = async (context) => {
  const { namespace } = context.req.valid('param');
  const { lng } = context.req.valid('query');

  // Only handle 'translations' namespace
  if (namespace !== 'translations') {
    return context.json({}, HttpStatusCodes.OK);
  }

  const [uiRows, appRows, adminRows] = await Promise.all([
    db.query.translations_ui.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    }),
    db.query.translations_app.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    }),
    db.query.translations_admin.findMany({
      where: (fields, operators) => operators.eq(fields.isActive, true),
    }),
  ]);

  // Build domain-grouped resources: { ui: {...}, app: {...}, admin: {...} }
  const resources = buildDomainGroupedResources(uiRows, appRows, adminRows, lng);

  return context.json(resources, HttpStatusCodes.OK);
};

/**
 * Domain-specific endpoint: Returns single domain for CMS editing
 * GET /api/i18n/translations/:domain?lng=es-ES
 * Returns array format (same as /translations/:namespace) for CMS compatibility
 * Keys are returned WITH domain prefix (for CMS editing)
 */
export const getDomain: AppRouteHandler<GetDomainRoute> = async (context) => {
  const { domain } = context.req.valid('param');

  let rows: Array<{ id: string; key: string; translations: Record<string, string>; isActive: boolean }> = [];

  // Query the appropriate table based on domain
  switch (domain) {
    case 'ui':
      rows = await db.query.translations_ui.findMany({
        where: (fields, operators) => operators.eq(fields.isActive, true),
      });
      break;
    case 'app':
      rows = await db.query.translations_app.findMany({
        where: (fields, operators) => operators.eq(fields.isActive, true),
      });
      break;
    case 'admin':
      rows = await db.query.translations_admin.findMany({
        where: (fields, operators) => operators.eq(fields.isActive, true),
      });
      break;
    default:
      return context.json([], HttpStatusCodes.OK);
  }

  // Return array format for CMS (keys already have domain prefix for app/admin, ui keys don't)
  return context.json(rows, HttpStatusCodes.OK);
};
