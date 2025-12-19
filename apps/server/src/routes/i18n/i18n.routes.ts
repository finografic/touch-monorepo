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

    const segments = row.key.split('.');
    let current = result;

    for (let i = 0; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        current[segment] = value;
      } else {
        current[segment] ??= {};
        current = current[segment];
      }
    }
  }

  return result;
}

/**
 * Build domain-grouped resources for i18next bulk load
 * Groups translations by domain (ui, app, admin) as top-level keys
 * Example:
 * - translations_ui: "buttons.save" -> { ui: { buttons: { save: "Save" } } }
 * - translations_app: "app.pages.title" -> { app: { pages: { title: "Title" } } }
 * - translations_admin: "admin.pages.dashboard" -> { admin: { pages: { dashboard: "Dashboard" } } }
 */
function buildDomainGroupedResources(
  uiRows: Array<{ key: string; translations: Record<string, string> }>,
  appRows: Array<{ key: string; translations: Record<string, string> }>,
  adminRows: Array<{ key: string; translations: Record<string, string> }>,
  locale: string,
): Record<string, any> {
  const result: Record<string, any> = {
    ui: {},
    app: {},
    admin: {},
  };

  // Process UI translations: add "ui." prefix to keys
  for (const row of uiRows) {
    const value = row.translations[locale];
    if (!value) continue;

    const segments = ['ui', ...row.key.split('.')];
    let current = result.ui;

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        current[segment] = value;
      } else {
        current[segment] ??= {};
        current = current[segment];
      }
    }
  }

  // Process App translations: keys already have "app." prefix
  for (const row of appRows) {
    const value = row.translations[locale];
    if (!value) continue;

    const segments = row.key.split('.');
    // Skip "app" prefix and build nested structure
    let current = result.app;

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        current[segment] = value;
      } else {
        current[segment] ??= {};
        current = current[segment];
      }
    }
  }

  // Process Admin translations: keys already have "admin." prefix
  for (const row of adminRows) {
    const value = row.translations[locale];
    if (!value) continue;

    const segments = row.key.split('.');
    // Skip "admin" prefix and build nested structure
    let current = result.admin;

    for (let i = 1; i < segments.length; i++) {
      const segment = segments[i];
      if (i === segments.length - 1) {
        current[segment] = value;
      } else {
        current[segment] ??= {};
        current = current[segment];
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
      namespace: z.string().describe('Namespace (e.g., "translations")'),
    }),
    query: z.object({
      lng: z.string().describe('Language code (e.g., "es-ES", "en-GB")'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.record(z.string(), z.any()),
      'Domain-grouped translation resources (ui, app, admin)',
    ),
  },
});

export const getDomain = createRoute({
  path: '/i18n/translations/{domain}',
  method: 'get',
  request: {
    params: z.object({
      domain: z.enum(['ui', 'app', 'admin']).describe('Translation domain (ui, app, admin)'),
    }),
    query: z.object({
      lng: z
        .string()
        .optional()
        .describe('Language code (e.g., "es-ES", "en-GB") - optional, not used for array format'),
    }),
  },
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(
        z.object({
          id: z.string(),
          key: z.string(),
          translations: z.record(z.string(), z.string()),
          isActive: z.boolean(),
        }),
      ),
      'Domain-specific translation resources in array format (keys include domain prefix for CMS editing)',
    ),
  },
});

export type GetNamespaceRoute = typeof getNamespace;
export type GetDomainRoute = typeof getDomain;

export { buildDomainGroupedResources, buildI18nResources };
