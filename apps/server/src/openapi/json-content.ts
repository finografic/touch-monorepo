// @deprecated — use lib/openapi.helpers.ts json() instead
export function jsonContent<T>(schema: T, description: string) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
}
