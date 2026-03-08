import type { OrdersReadableView } from '@workspace/server/models';

import type { TemperatureProfile } from 'types/temperature.types';

export type OrderReadableModel = OrdersReadableView & {
  temperatureProfiles?: TemperatureProfile[];
  timeRows?: Array<{
    temperature: number;
    timeA: number;
    timeB: number;
    timeC: number;
  }>;
};
