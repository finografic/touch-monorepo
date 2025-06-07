import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkType = OverridePropTypes<DrinkTypeCamelCase, ModelBaseProps & { hasSubtypes: boolean }>;
export type DrinkSubtype = OverridePropTypes<DrinkSubtypeCamelCase, ModelBaseProps>;

type DrinkTypeCamelCase = ConvertKeysToCamelCase<DrinkTypeEntity>;
type DrinkSubtypeCamelCase = ConvertKeysToCamelCase<DrinkSubtypeEntity>;
