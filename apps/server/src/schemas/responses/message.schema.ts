import { z } from '@hono/zod-openapi';

export function createMessageObjectSchema(exampleMessage = 'Hello World', exampleSuccess = true) {
  return z
    .object({
      success: z.boolean(),
      message: z.string(),
    })
    .openapi({
      example: {
        success: exampleSuccess,
        message: exampleMessage,
      },
    });
}
