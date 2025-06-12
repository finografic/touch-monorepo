import { z } from 'zod';

// Base schema for validation error issues
export const errorIssueSchema = z.object({
  code: z.string(),
  path: z.array(z.string()),
  message: z.string(),
});

// Schema for API error responses
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.unknown().optional(),
    issues: z.array(errorIssueSchema).optional(),
  }),
});

// Type inference helpers
export type ErrorIssue = z.infer<typeof errorIssueSchema>;
export type ZodErrorResponse = z.infer<typeof errorResponseSchema>;
