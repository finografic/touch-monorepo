import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { ContainerTypeEntity } from '@workspace/server/types';

import type { ModelBaseProps } from 'types/base.types';
import type { RegionLocale } from '@workspace/config/i18n.config';

export type ContainerType = OverridePropTypes<
  ContainerTypeCamelCase,
  ModelBaseProps & {
    translations: Record<RegionLocale, string>; // Override: API returns parsed JSON object
  }
>;
type ContainerTypeCamelCase = ConvertKeysToCamelCase<ContainerTypeEntity>;
