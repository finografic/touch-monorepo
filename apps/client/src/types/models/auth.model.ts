import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { UserEntity } from '@workspace/server/types/entities/user.entity';

import type { ModelBaseProps } from 'types/base.types';

export type User = OverridePropTypes<UserCamelCase, ModelBaseProps>;
type UserCamelCase = ConvertKeysToCamelCase<UserEntity>;
