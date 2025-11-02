import { z } from 'zod';

/**
 * Creates a Zod schema that accepts both boolean and integer values for SQLite boolean fields
 * Converts true/false to 1/0 and accepts 1/0 as valid boolean values
 */
export function sqliteBooleanField(defaultValue?: boolean) {
  const baseSchema = z
    .union([
      z.boolean(), // Accept actual booleans
      z.number().int().min(0).max(1), // Accept 0 or 1
      z.literal('true').transform(() => true), // Accept string 'true'
      z.literal('false').transform(() => false), // Accept string 'false'
      z.literal('1').transform(() => true), // Accept string '1'
      z.literal('0').transform(() => false), // Accept string '0'
    ])
    .transform((value) => {
      // Convert to integer for SQLite storage
      if (typeof value === 'boolean') {
        return value ? 1 : 0;
      }
      // If it's already a number (0 or 1), return as-is
      return value;
    });

  return defaultValue !== undefined ? baseSchema.default(defaultValue ? 1 : 0) : baseSchema;
}

/**
 * Transforms an existing Zod schema to handle SQLite boolean fields
 * Replaces boolean fields with our flexible boolean/integer handler
 */
export function transformSqliteBooleans<T extends z.ZodRawShape>(
  schema: z.ZodObject<T>,
  booleanFields: (keyof T)[],
) {
  const transformedShape = { ...schema.shape };

  booleanFields.forEach((field) => {
    if (transformedShape[field]) {
      // Replace the boolean field with our flexible handler
      transformedShape[field] = sqliteBooleanField() as any;
    }
  });

  return z.object(transformedShape);
}

/**
 * Converts a patch schema to handle SQLite booleans
 * For PATCH operations where boolean fields might be sent as integers
 */
export function createSqliteBooleanPatchSchema<T extends z.ZodRawShape>(
  baseSchema: z.ZodObject<T>,
  booleanFields: (keyof T)[],
) {
  const patchShape = { ...baseSchema.partial().shape };

  booleanFields.forEach((field) => {
    if (patchShape[field]) {
      // Make it optional and flexible for boolean/integer values
      patchShape[field] = sqliteBooleanField().optional() as any;
    }
  });

  return z.object(patchShape);
}

/**
 * Utility to identify boolean fields from a Drizzle table schema
 * Looks for integer fields with mode: 'boolean'
 */
export function getBooleanFieldNames(tableColumns: Record<string, any>): string[] {
  return Object.entries(tableColumns)
    .filter(([_, column]) => {
      // Check if it's an integer column with boolean mode
      return (
        column?.dataType === 'integer' &&
        column?.columnType === 'SQLiteInteger' &&
        column?.config?.mode === 'boolean'
      );
    })
    .map(([fieldName]) => fieldName);
}

/**
 * Pre-process request data to convert boolean fields to integers
 * Useful in route handlers before database operations
 */
export function convertBooleansToIntegers(
  data: Record<string, any>,
  booleanFields: string[],
): Record<string, any> {
  const converted = { ...data };

  booleanFields.forEach((field) => {
    if (field in converted && converted[field] !== undefined && converted[field] !== null) {
      const value = converted[field];
      if (typeof value === 'boolean') {
        converted[field] = value ? 1 : 0;
      } else if (value === 'true' || value === '1') {
        converted[field] = 1;
      } else if (value === 'false' || value === '0') {
        converted[field] = 0;
      }
    }
  });

  return converted;
}
