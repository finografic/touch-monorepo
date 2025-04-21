import type { ContainerTypeEntity } from '@workspace/server/types/entities/container-type.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type ContainerType = OverridePropTypes<ContainerTypeCamelCase, ModelBaseProps>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;
