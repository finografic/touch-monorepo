import { describeRoute, resolver } from 'hono-openapi';
import type * as v from 'valibot';

type DescribeRouteConfig = Parameters<typeof describeRoute>[0];

type AnyValibotSchema = v.BaseSchema<unknown, unknown, v.BaseIssue<unknown>>;

type ResolverResult = ReturnType<typeof resolver>;
type JsonContent = { description: string; content: Record<string, { schema: ResolverResult }> };
type JsonContentRequired = JsonContent & { required: true };

/**
 * Wraps describeRoute() and attaches the path as a typed property.
 * Allows route definitions and their paths to be co-located in *.routes.ts.
 *
 * @example
 * export const getOne = route('/modes/:id', { tags, description, responses });
 * // index.ts: .get(routes.getOne.path, routes.getOne, handlers.getOne)
 */
export function route<P extends string>(path: P, config: DescribeRouteConfig) {
  return Object.assign(describeRoute(config), { path } as const);
}

/** Equivalent of stoker's jsonContent() */
export const json = (schema: AnyValibotSchema, description: string): JsonContent => ({
  description,
  content: {
    'application/json': { schema: resolver(schema) },
  },
});

/** Equivalent of stoker's jsonContentRequired() — marks body as required in OpenAPI spec */
export const jsonRequired = (schema: AnyValibotSchema, description: string): JsonContentRequired => ({
  ...json(schema, description),
  required: true,
});
