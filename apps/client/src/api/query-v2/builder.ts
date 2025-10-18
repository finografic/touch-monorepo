import { Filters, Operators, type QueryParams, type QueryStandard } from './types';

export class QueryBuilder<T extends Record<string, any>> {
  private query: Partial<QueryParams<T>> = {};

  // Field conditions
  where<K extends keyof T>(field: K, operator: Operators, value: T[K] | T[K][]): this {
    (this.query as any)[field] = { [operator]: value };
    return this;
  }

  equals<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$eq, value);
  }

  notEquals<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$ne, value);
  }

  in<K extends keyof T>(field: K, values: T[K][]): this {
    return this.where(field, Operators.$in, values);
  }

  notIn<K extends keyof T>(field: K, values: T[K][]): this {
    return this.where(field, Operators.$nin, values);
  }

  greaterThan<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$gt, value);
  }

  greaterThanOrEqual<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$gte, value);
  }

  lessThan<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$lt, value);
  }

  lessThanOrEqual<K extends keyof T>(field: K, value: T[K]): this {
    return this.where(field, Operators.$lte, value);
  }

  like(field: keyof T, pattern: string): this {
    return this.where(field, Operators.$like, pattern as any);
  }

  notLike(field: keyof T, pattern: string): this {
    return this.where(field, Operators.$notlike, pattern as any);
  }

  // Logical operators
  or(conditions: Array<QueryStandard<T>>): this {
    this.query[Filters.$or] = conditions;
    return this;
  }

  and(conditions: Array<QueryStandard<T>>): this {
    this.query[Filters.$and] = conditions;
    return this;
  }

  // Pagination and sorting
  limit(value: number): this {
    this.query[Filters.$limit] = value;
    return this;
  }

  skip(value: number): this {
    this.query[Filters.$skip] = value;
    return this;
  }

  sort(field: keyof T, direction: 1 | -1): this {
    const currentSort = this.query[Filters.$sort] || {};
    this.query[Filters.$sort] = {
      ...currentSort,
      [field]: direction,
    } as Partial<Record<keyof T, 1 | -1>>;
    return this;
  }

  select(fields: Array<keyof T>): this {
    this.query[Filters.$select] = fields;
    return this;
  }

  // Build final query
  build(): QueryParams<T> {
    return this.query as QueryParams<T>;
  }

  // Serialize to URL query string
  toString(): string {
    return this.serialize(this.query);
  }

  private serialize(obj: any, prefix = ''): string {
    return Object.entries(obj)
      .map(([key, value]) => {
        const k = prefix ? `${prefix}[${key}]` : key;
        return typeof value === 'object'
          ? this.serialize(value, k)
          : `${k}=${encodeURIComponent(String(value))}`;
      })
      .join('&');
  }
}
