/**
 * Runtime check that a value is a non-null object.
 *
 * In JavaScript `typeof null === 'object'`, so this helper ensures
 * the value is an actual object before performing structural checks.
 *
 * The value narrows to `Record<string, unknown>` so properties can
 * be safely inspected.
 */
export function isObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}
