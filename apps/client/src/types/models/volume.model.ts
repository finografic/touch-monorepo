import type { VolumeEntity } from '@touch/server/types/entities/volume.entity';
import type { ConvertKeysToCamelCase, Override } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkVolume = Override<VolumeCamelCase, ModelBaseProps>;
type VolumeCamelCase = ConvertKeysToCamelCase<VolumeEntity>;
