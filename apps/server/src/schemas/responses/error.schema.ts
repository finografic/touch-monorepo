import * as HttpStatusCodes from 'stoker/http-status-codes';
import z from 'zod';

export const ErrorCode = z.nativeEnum(HttpStatusCodes);

export const ErrorSchema = z.object({
  error: z.object({
    success: z.boolean(),
    code: z.number(),
    docs: z.string(),
    message: z.string(),
    requestId: z.string(),
  }),
});

export type ErrorResponse = z.infer<typeof ErrorSchema>;
