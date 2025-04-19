import type { ContainerTypeEntity } from '@touch/server/types/entities/container-types.types';
import type { ConvertKeysToCamelCase, Override } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type ContainerType = Override<ContainerTypeCamelCase, ModelBaseProps>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;
