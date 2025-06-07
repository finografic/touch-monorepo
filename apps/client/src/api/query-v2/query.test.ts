import { QueryBuilder } from './builder';

// Example entity type
interface User {
  id: number;
  name: string;
  email: string;
  age: number;
  createdAt: Date;
  isActive: boolean;
}

// Example usage
const query = new QueryBuilder<User>()
  .equals('isActive', true)
  .greaterThan('age', 18)
  .like('email', '%@example.com')
  .or([{ name: { $like: '%John%' } }, { name: { $like: '%Doe%' } }])
  .sort('createdAt', -1)
  .limit(10)
  .skip(0)
  .select(['id', 'name', 'email'])
  .build();

// The resulting query will be type-safe and look like:
const expectedQuery = {
  isActive: { $eq: true },
  age: { $gt: 18 },
  email: { $like: '%@example.com' },
  $or: [{ name: { $like: '%John%' } }, { name: { $like: '%Doe%' } }],
  $sort: { createdAt: -1 },
  $limit: 10,
  $skip: 0,
  $select: ['id', 'name', 'email'],
};

// Example: Temperature Profile Query
interface TemperatureProfile {
  id: string;
  temperature: number;
  timeA: number;
  timeB: number;
  timeC: number;
}

const tempQuery = new QueryBuilder<TemperatureProfile>()
  .in('temperature', [25, 7])
  .select(['temperature', 'timeA', 'timeB', 'timeC'])
  .build();

// Will generate:
const expectedTempQuery = {
  temperature: { $in: [25, 7] },
  $select: ['temperature', 'timeA', 'timeB', 'timeC'],
};

// Example: Complex Query with AND/OR
const complexQuery = new QueryBuilder<User>()
  .and([{ age: { $gte: 18 } }, { age: { $lte: 65 } }])
  .or([{ isActive: { $eq: true } }, { email: { $like: '%@vip.com' } }])
  .build();

// Example: Pagination
const paginatedQuery = new QueryBuilder<User>()
  .equals('isActive', true)
  .sort('createdAt', -1)
  .limit(20)
  .skip(40) // Page 3 with 20 items per page
  .build();

// Example: URL serialization
const queryString = new QueryBuilder<User>().equals('isActive', true).in('id', [1, 2, 3]).toString();
// Result: isActive[$eq]=true&id[$in]=1,2,3
