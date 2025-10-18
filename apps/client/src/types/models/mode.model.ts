import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { ModeEntity } from '@workspace/server/types';

import type { ModelBaseProps } from 'types/base.types';

export type ModeModel = OverridePropTypes<ModeCamelCase, ModelBaseProps>;
type ModeCamelCase = ConvertKeysToCamelCase<ModeEntity>;
