import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@touch/server/types/entities/drink-type.entity';
import type { ConvertKeysToCamelCase, OverridePropTypes } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkType = OverridePropTypes<DrinkTypeCamelCase, ModelBaseProps & { hasSubtypes: boolean }>;
export type DrinkSubtype = OverridePropTypes<DrinkSubtypeCamelCase, ModelBaseProps>;

type DrinkTypeCamelCase = ConvertKeysToCamelCase<DrinkTypeEntity>;
type DrinkSubtypeCamelCase = ConvertKeysToCamelCase<DrinkSubtypeEntity>;
