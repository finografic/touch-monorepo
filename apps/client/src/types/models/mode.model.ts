import type { ModeEntity } from '@workspace/server/types';
import type { ConvertKeysToCamelCase } from '@workspace/core/types/utils';

export type ModeModel = ConvertKeysToCamelCase<ModeEntity>;
