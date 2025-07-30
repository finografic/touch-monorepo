import { z } from 'zod';

// Base value types
export type QueryStandardValue = string | number | boolean | undefined;
export type QueryLikeValue = `%${string}` | `${string}%` | `%${string}%`;

// Operator enums
export enum Filters {
  $limit = '$limit',
  $skip = '$skip',
  $sort = '$sort',
  $select = '$select',
  $or = '$or',
  $and = '$and',
}

export enum Operators {
  $eq = '$eq',
  $ne = '$ne',
  $in = '$in',
  $nin = '$nin',
  $lt = '$lt',
  $lte = '$lte',
  $gt = '$gt',
  $gte = '$gte',
  $like = '$like',
  $notlike = '$notlike',
}

// Type-safe operator mapping
export interface OperatorMap<T> {
  [Operators.$eq]: T;
  [Operators.$ne]: T;
  [Operators.$in]: T extends Array<any> ? T : T[];
  [Operators.$nin]: T extends Array<any> ? T : T[];
  [Operators.$gt]: T extends number | Date ? T : never;
  [Operators.$gte]: T extends number | Date ? T : never;
  [Operators.$lt]: T extends number | Date ? T : never;
  [Operators.$lte]: T extends number | Date ? T : never;
  [Operators.$like]: T extends string ? QueryLikeValue : never;
  [Operators.$notlike]: T extends string ? QueryLikeValue : never;
}

// Generic query types
export type QueryOperator<T> = Partial<OperatorMap<T>>;

export type QueryStandard<T extends Record<string, any>> = {
  [K in keyof T]?: T[K] | QueryOperator<T[K]>;
};

export interface QueryFilters<T extends Record<string, any>> {
  [Filters.$limit]?: number;
  [Filters.$skip]?: number;
  [Filters.$sort]?: Partial<Record<keyof T, 1 | -1>>;
  [Filters.$select]?: Array<keyof T>;
}

export interface QueryMulti<T extends Record<string, any>> {
  [Filters.$or]?: Array<QueryStandard<T>>;
  [Filters.$and]?: Array<QueryStandard<T>>;
}

export type QueryParams<T extends Record<string, any>> = QueryStandard<T> &
  QueryFilters<T> &
  Partial<QueryMulti<T>>;

// Error handling
export class QueryError extends Error {
  constructor(
    public code: string,
    public details: unknown[],
    public status: number,
  ) {
    super(`Query Error: ${code}`);
    this.name = 'QueryError';
  }

  static isQueryError(error: unknown): error is QueryError {
    return error instanceof QueryError;
  }
}

// Zod validation schema
export const createQuerySchema = () =>
  z.object({
    ...Object.values(Filters).reduce(
      (acc, filter) => ({
        ...acc,
        [filter]: z.any().optional(),
      }),
      {},
    ),
    ...Object.values(Operators).reduce(
      (acc, operator) => ({
        ...acc,
        [operator]: z.any().optional(),
      }),
      {},
    ),
  });
