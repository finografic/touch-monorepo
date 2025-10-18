import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { ModeEntity } from '@workspace/server/types';

export type Mode = ConvertKeysToCamelCase<ModeEntity>;
