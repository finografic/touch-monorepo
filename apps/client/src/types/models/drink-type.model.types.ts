import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@touch/server/types/entities/drink-types.types';
import type { ConvertKeysToCamelCase, Override } from 'types/utility.types';
import type { ModelBaseProps } from 'types/base.types';

export type DrinkType = Override<DrinkTypeCamelCase, ModelBaseProps & { hasSubtypes: boolean }>;
export type DrinkSubtype = Override<DrinkSubtypeCamelCase, ModelBaseProps>;

type DrinkTypeCamelCase = ConvertKeysToCamelCase<DrinkTypeEntity>;
type DrinkSubtypeCamelCase = ConvertKeysToCamelCase<DrinkSubtypeEntity>;
