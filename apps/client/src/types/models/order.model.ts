import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';
import type { OrderEntity } from '@workspace/server/types/entities/order.entity';

export type OrderModel = OverridePropTypes<OrderCamelCase, ModelBaseProps>;

type OrderCamelCase = ConvertKeysToCamelCase<OrderEntity>;
