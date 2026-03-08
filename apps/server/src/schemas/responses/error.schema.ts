import * as v from 'valibot';
import * as HttpStatusCodes from 'stoker/http-status-codes';

export const ErrorCode = v.picklist(Object.values(HttpStatusCodes) as number[]);

export const ErrorSchema = v.object({
  error: v.object({
    success: v.boolean(),
    code:    v.number(),
    docs:    v.string(),
    message: v.string(),
    requestId: v.string(),
  }),
});

export type ErrorResponse = v.InferOutput<typeof ErrorSchema>;
