import type { ContainerTypeEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';

export type ContainerType = OverridePropTypes<ContainerTypeCamelCase, ModelBaseProps>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;
