import type { VolumeEntity } from '@touch/server/types/entities/volume.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkVolume = OverridePropTypes<VolumeCamelCase, ModelBaseProps>;
type VolumeCamelCase = ConvertKeysToCamelCase<VolumeEntity>;
