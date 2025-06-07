import type { TemperatureProfile } from 'types/temperature.types';
import { QueryStringBuilder } from './builder';

export * from './builder';
export * from './types';

// Helper function specifically for temperature profile queries
export const createTemperatureQuery = (initial: number, final: number): string => {
  return QueryStringBuilder.create<TemperatureProfile>({
    $select: ['temperature', 'timeA', 'timeB', 'timeC'],
    $where: {
      temperature: {
        $in: [initial, final],
      },
    },
  })
    .build()
    .toString();
};

// NOTE: Example usage:
// const queryString = createTemperatureQuery(18.5, 3.0);
// Result: $select=temperature,timeA,timeB,timeC&temperature[$in]=18.5,3.0
