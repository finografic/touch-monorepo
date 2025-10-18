import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@workspace/server/types';

import type { ModelBaseProps } from 'types/base.types';

export type DrinkType = OverridePropTypes<
  DrinkTypeCamelCase,
  ModelBaseProps & {
    hasSubtypes: boolean;
    translations: Record<string, string>; // Override: API returns parsed JSON object
  }
>;
export type DrinkSubtype = OverridePropTypes<
  DrinkSubtypeCamelCase,
  ModelBaseProps & {
    translations: Record<string, string>; // Override: API returns parsed JSON object
  }
>;

type DrinkTypeCamelCase = ConvertKeysToCamelCase<DrinkTypeEntity>;
type DrinkSubtypeCamelCase = ConvertKeysToCamelCase<DrinkSubtypeEntity>;
