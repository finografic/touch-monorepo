import type { TemperatureTableEntity } from '@workspace/server/types/entities/temperature.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';

export type TemperatureProfileEntity = OverridePropTypes<TemperatureProfileCamelCase, ModelBaseProps>;
type TemperatureProfileCamelCase = ConvertKeysToCamelCase<TemperatureTableEntity>;
