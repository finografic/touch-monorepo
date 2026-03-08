// @ts-nocheck - Bypassing complex type inference issues throughout this file
import { StatusCodes as HttpStatusCodes } from 'http-status-codes';

import { db } from 'db';
import type { AppHandler } from 'types/app.types';
import { buildDomainGroupedResources } from './i18n.routes';

/**
 * Bulk load endpoint: Returns all domains grouped under ui, app, admin
 * GET /api/i18n/translations?lng=es-ES
 */
export const getNamespace: AppHandler = async (context) => {
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
export const getDomain: AppHandler = async (context) => {
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

  // Return array format for CMS (all keys now have domain prefix: ui.*, app.*, admin.*)
  return context.json(rows, HttpStatusCodes.OK);
};
