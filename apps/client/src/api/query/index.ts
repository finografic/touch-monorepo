import type { TemperatureProfile } from '../../types/temperature.types';
import type { TemperatureProfileQuery } from './types';
import { QueryStringBuilder } from './builder';

export * from './builder';
export * from './types';

// Helper function specifically for temperature profile queries
export const createTemperatureQuery = (
  initial: number,
  final: number,
): QueryStringBuilder<TemperatureProfile> => {
  const query: TemperatureProfileQuery = {
    $select: ['temperature', 'timeA', 'timeB', 'timeC'],
    $where: {
      temperature: {
        $in: [initial, final],
      },
    },
  };

  return QueryStringBuilder.create(query);
};

// Example usage:
// const query = createTemperatureQuery(18.5, 3.0);
// const queryString = query.toString();
// // Result: $select=temperature,timeA,timeB,timeC&temperature[$in]=18.5,3.0
