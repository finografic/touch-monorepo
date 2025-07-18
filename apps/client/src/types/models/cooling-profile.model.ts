import type { ModeEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';

export type Mode = ConvertKeysToCamelCase<ModeEntity>;
