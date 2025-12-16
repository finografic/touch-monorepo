import * as HttpStatusCodes from 'stoker/http-status-codes';

import { db } from 'db';
import { translations_ui } from 'db/schemas/translations_ui.schema';
import type { AppRouteHandler } from 'types/app.types';
import type { GetNamespaceRoute } from './i18n.routes';
import { buildI18nResources } from './i18n.routes';

export const getNamespace: AppRouteHandler<GetNamespaceRoute> = async (context) => {
  const { namespace } = context.req.valid('param');
  const { lng } = context.req.valid('query');

  // Only one real namespace exists
  if (namespace !== 'ui') {
    return context.json({}, HttpStatusCodes.OK);
  }

  const rows = await db.query.translations_ui.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });

  const resources = buildI18nResources(rows, lng);

  return context.json(resources, HttpStatusCodes.OK);
};
