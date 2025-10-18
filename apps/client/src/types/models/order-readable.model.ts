import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { OrderReadableEntity } from '@workspace/server/types/entities/order-readable.entity';

import type { ModelBaseProps } from 'types/base.types';
import type { TemperatureProfile } from 'types/temperature.types';

export type OrderReadableModel = OverridePropTypes<
  OrderReadableCamelCase,
  ModelBaseProps & {
    temperatureProfiles?: TemperatureProfile[];
    timeRows?: Array<{
      temperature: number;
      timeA: number;
      timeB: number;
      timeC: number;
    }>;
  }
>;

type OrderReadableCamelCase = ConvertKeysToCamelCase<OrderReadableEntity>;
