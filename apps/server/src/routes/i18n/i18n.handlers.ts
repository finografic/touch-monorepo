import { db } from 'db';
import { translations_ui } from 'db/schemas/translations_ui.schema';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import type { AppRouteHandler } from 'types/app.types';
import type { GetNamespaceRoute } from './i18n.routes';
import { buildI18nResources } from './i18n.routes';

export const getNamespace: AppRouteHandler<GetNamespaceRoute> = async (context) => {
  const { namespace } = context.req.valid('param');
  const { lng } = context.req.valid('query');

  // Fetch all active translations
  const allRows = await db.query.translations_ui.findMany({
    where: (fields, operators) => operators.eq(fields.isActive, true),
  });

  // Filter by namespace prefix
  // For "ui" namespace: include keys starting with "buttons." or "tables."
  // (These are stored as "buttons.save", "tables.headers.name" in DB)
  // For "time" namespace: include keys starting with "time."
  let filteredRows = allRows;

  if (namespace === 'ui') {
    // Include keys that start with "buttons." or "tables."
    // Note: Keys are stored as "buttons.save", not "ui.buttons.save"
    filteredRows = allRows.filter((row) => {
      const key = row.key;
      return key.startsWith('buttons.') || key.startsWith('tables.');
    });
  } else if (namespace === 'time') {
    // Include keys that start with "time."
    filteredRows = allRows.filter((row) => row.key.startsWith('time.'));
  } else {
    // For other namespaces, filter by exact prefix
    filteredRows = allRows.filter((row) => row.key.startsWith(`${namespace}.`));
  }

  // Build nested resources object
  // This expands dot keys like "buttons.save" -> { buttons: { save: "Save" } }
  const resources = buildI18nResources(filteredRows, lng);

  return context.json(resources, HttpStatusCodes.OK);
};

