import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@touch/server/types/entities/drink-types.types';
import type { VolumeEntity } from '@touch/server/types/entities/volumes.types';
import type { ContainerTypeEntity } from '@touch/server/types/entities/container-types.types';
import type { ConvertKeysToCamelCase, Override } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

// ------------------------------------------------------------------------ //

export type DrinkTypeModel = Override<DrinkTypeCamelCase, ModelBaseProps & { hasSubtypes: boolean }>;
export type DrinkSubtypeModel = Override<DrinkSubtypeCamelCase, ModelBaseProps>;

type DrinkTypeCamelCase = ConvertKeysToCamelCase<DrinkTypeEntity>;
type DrinkSubtypeCamelCase = ConvertKeysToCamelCase<DrinkSubtypeEntity>;

// ------------------------------------------------------------------------ //

export type ContainerTypeModel = Override<ContainerTypeCamelCase, ModelBaseProps>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;

// ------------------------------------------------------------------------ //

export type VolumeModel = Override<VolumeCamelCase, ModelBaseProps>;
type VolumeCamelCase = ConvertKeysToCamelCase<VolumeEntity>;
