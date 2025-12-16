import { createRoute, z } from '@hono/zod-openapi';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import { jsonContent } from 'stoker/openapi/helpers';

const tags = ['I18n'];

/**
 * Build nested object from dot-notation keys
 * Example: "buttons.save" -> { buttons: { save: "Save" } }
 */
function buildI18nResources(
  rows: Array<{ key: string; translations: Record<string, string> }>,
  locale: string,
): Record<string, any> {
  const result: Record<string, any> = {};

  for (const row of rows) {
    const value = row.translations[locale];
    if (!value) continue;

    const parts = row.key.split('.');
    let current = result;

    for (let i = 0; i < parts.length; i++) {
      const part = parts[i];
      if (i === parts.length - 1) {
        // Last part - set the value
        current[part] = value;
      } else {
        // Intermediate part - create nested object if needed
        current[part] ??= {};
        current = current[part];
      }
    }
  }

  return result;
}

export const getNamespace = createRoute({
  path: '/i18n/{namespace}',
  method: 'get',
  request: {
    params: z.object({
      namespace: z.string().describe('Namespace (e.g., "ui", "time")'),
    }),
    query: z.object({
      lng: z.string().describe('Language code (e.g., "es-ES", "en-GB")'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.record(z.string(), z.any()),
      'Nested translation resources for the namespace',
    ),
  },
});

export type GetNamespaceRoute = typeof getNamespace;

// Export the utility function for use in handlers
export { buildI18nResources };
