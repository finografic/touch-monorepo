import * as v from 'valibot';

export function createMessageObjectSchema(_exampleMessage = 'Hello World', _exampleSuccess = true) {
  return v.object({
    success: v.boolean(),
    message: v.string(),
  });
}
