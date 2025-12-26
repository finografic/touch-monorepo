import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { ContainerTypeEntity } from '@workspace/server/types';

import type { ModelBaseProps } from 'types/base.types';

export type ContainerType = OverridePropTypes<
  ContainerTypeCamelCase,
  ModelBaseProps & {
    translations: Record<string, string>; // Override: API returns parsed JSON object
  }
>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;
