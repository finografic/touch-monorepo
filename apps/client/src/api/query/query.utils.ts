import type { QueryBuilder, QueryOperatorObject, QueryValue } from './query.types';

export class QueryStringBuilder<T> {
  #query: QueryBuilder<T>;
  #params: URLSearchParams;

  constructor(query: QueryBuilder<T>) {
    this.#query = query;
    this.#params = new URLSearchParams();
  }

  static create<T>(query: QueryBuilder<T>): QueryStringBuilder<T> {
    return new QueryStringBuilder<T>(query);
  }

  #serializeValue = (value: QueryValue): string => {
    return Array.isArray(value) ? value.join(',') : String(value);
  };

  #serializeOperatorObject = (field: string, conditions: QueryOperatorObject): this => {
    Object.entries(conditions)
      .filter((entry): entry is [string, NonNullable<QueryValue>] => {
        const [, value] = entry;
        return value !== undefined && value !== null;
      })
      .forEach(([operator, value]) => {
        this.#params.set(`${field}[${operator}]`, this.#serializeValue(value));
      });

    return this;
  };

  #serializeWhereClause = (): this => {
    if (!this.#query.$where) return this;

    Object.entries(this.#query.$where).forEach(([field, conditions]) => {
      if (this.#isOperatorObject(conditions)) {
        this.#serializeOperatorObject(field, conditions);
      } else if (this.#isValidValue(conditions)) {
        this.#params.set(field, this.#serializeValue(conditions));
      }
    });

    return this;
  };

  #isOperatorObject = (value: unknown): value is QueryOperatorObject => {
    return (
      typeof value === 'object' &&
      value !== null &&
      !Array.isArray(value) &&
      Object.keys(value as object).some((key) => key.startsWith('$'))
    );
  };

  #isValidValue = (value: unknown): value is QueryValue => {
    return (
      value !== null &&
      value !== undefined &&
      (typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'boolean' ||
        Array.isArray(value))
    );
  };

  build(): this {
    // Handle $select
    if (this.#query.$select?.length) {
      this.#params.set('$select', this.#query.$select.join(','));
    }

    // Handle $where conditions
    this.#serializeWhereClause();

    // Handle $limit
    if (this.#query.$limit !== undefined) {
      this.#params.set('$limit', String(this.#query.$limit));
    }

    // Handle $offset
    if (this.#query.$offset !== undefined) {
      this.#params.set('$offset', String(this.#query.$offset));
    }

    // Handle $orderBy
    if (this.#query.$orderBy) {
      const orderBy = Object.entries(this.#query.$orderBy)
        .map(([field, direction]) => `${field} ${direction}`)
        .join(',');
      if (orderBy) {
        this.#params.set('$orderBy', orderBy);
      }
    }

    return this;
  }

  toString(): string {
    return this.#params.toString();
  }
}
