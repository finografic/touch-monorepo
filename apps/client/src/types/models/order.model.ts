import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/core/types/utils';
import type { OrderEntity } from '@workspace/server/types/entities/order.entity';

import type { ModelBaseProps } from 'types/base.types';

export type OrderModel = OverridePropTypes<OrderCamelCase, ModelBaseProps>;

type OrderCamelCase = ConvertKeysToCamelCase<OrderEntity>;
