import type { VolumeEntity } from '@workspace/server/types/entities/volume.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkVolume = OverridePropTypes<
  VolumeCamelCase,
  ModelBaseProps & {
    translations: Record<string, string>; // Override: API returns parsed JSON object
  }
>;
type VolumeCamelCase = ConvertKeysToCamelCase<VolumeEntity>;
