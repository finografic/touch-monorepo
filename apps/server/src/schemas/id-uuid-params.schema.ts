import * as v from 'valibot';

export const IdUuidParamsSchema = v.object({
  id: v.pipe(
    v.string(),
    v.uuid('Invalid ID format - must be a valid UUID'),
  ),
});

export default IdUuidParamsSchema;
