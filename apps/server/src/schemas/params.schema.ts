import { z } from 'zod';

import { isCuid } from 'utils/cuid-validation';

export const IdParamsSchema = z.object({
  id: z.string().refine((val) => isCuid(val), {
    message: 'Invalid ID format - must be a valid CUID',
  }),
});
