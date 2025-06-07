import type { TemperatureProfile } from '../../types/temperature.types';

export type QueryOperator =
  | '$eq'
  | '$ne'
  | '$gt'
  | '$gte'
  | '$lt'
  | '$lte'
  | '$in'
  | '$nin'
  | '$like'
  | '$notLike';

// Make this generic to work with any model's fields
export type QueryableFields<T> = keyof T;

// Generic type for query values
export type QueryValue = string | number | boolean | string[] | number[] | null;

// Operator object type
export type QueryOperatorObject = {
  [K in QueryOperator]?: QueryValue;
};

// Main query builder interface
export interface QueryBuilder<T> {
  $select?: Array<QueryableFields<T>>;
  $where?: {
    [K in QueryableFields<T>]?: QueryOperatorObject | QueryValue;
  };
  $limit?: number;
  $offset?: number;
  $orderBy?: {
    [K in QueryableFields<T>]?: 'asc' | 'desc';
  };
}

// Specific type for temperature profile queries
export type TemperatureProfileQuery = QueryBuilder<TemperatureProfile>;

// Helper type for the query result
export interface QueryResult<T> {
  data: T[];
  total?: number;
  limit?: number;
  offset?: number;
}
