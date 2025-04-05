import type { ZodSchema } from 'types/app.types';

export function jsonContent<T extends ZodSchema>(schema: T, description: string) {
  return {
    content: {
      'application/json': {
        schema,
      },
    },
    description,
  };
}
