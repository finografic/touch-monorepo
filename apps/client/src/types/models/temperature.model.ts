import type { TemperatureEntity } from '@workspace/server/types/entities';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { ModelBaseProps } from 'types/base.types';

export type TemperatureProfileEntity = OverridePropTypes<TemperatureProfileCamelCase, ModelBaseProps>;
type TemperatureProfileCamelCase = ConvertKeysToCamelCase<TemperatureEntity>;
