import * as HttpStatusCodes from 'stoker/http-status-codes';

import { db } from 'db';
import type { AppRouteHandler } from 'types/app.types';
import type { GetNamespaceRoute } from './i18n.routes';
import { buildI18nResources } from './i18n.routes';

export const getNamespace: AppRouteHandler<GetNamespaceRoute> = async (context) => {
  const { namespace } = context.req.valid('param');
  const { lng } = context.req.valid('query');

  // Single namespace 'ui' merges all three translation tables
  if (namespace !== 'ui') {
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

  // Merge all rows into a single array
  const allRows = [...uiRows, ...appRows, ...adminRows];

  // Build nested resources object from all translations
  const resources = buildI18nResources(allRows, lng);

  return context.json(resources, HttpStatusCodes.OK);
};
