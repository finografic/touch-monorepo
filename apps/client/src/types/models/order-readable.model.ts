import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';
import type { OrderReadableEntity } from '@workspace/server/types/entities/order-readable.entity';
import type { TemperatureProfile } from 'types/temperature.types';

export type OrderReadableModel = OverridePropTypes<
  OrderReadableCamelCase,
  ModelBaseProps & {
    temperatureProfiles?: TemperatureProfile[];
  }
>;

type OrderReadableCamelCase = ConvertKeysToCamelCase<OrderReadableEntity>;
