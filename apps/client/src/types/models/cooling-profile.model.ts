import type { CoolingProfileEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';

export type CoolingProfile = ConvertKeysToCamelCase<CoolingProfileEntity>;
