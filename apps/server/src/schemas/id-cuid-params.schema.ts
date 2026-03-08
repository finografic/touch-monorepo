import * as v from 'valibot';

import { isCuid } from 'utils/cuid-validation';

export const IdCuidParamsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.check((val) => isCuid(val), 'Invalid ID format - must be a valid CUID'),
  ),
});

export default IdCuidParamsSchema;
