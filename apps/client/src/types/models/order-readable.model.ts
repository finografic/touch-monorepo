import type { ConvertKeysToCamelCase, OverridePropTypes } from '@workspace/types/utils';
import type { ModelBaseProps } from 'types/base.types';
import type { OrderReadableEntity } from '@workspace/server/types/entities/order-readable.entity';

export type OrderReadableModel = OverridePropTypes<OrderReadableCamelCase, ModelBaseProps>;

type OrderReadableCamelCase = ConvertKeysToCamelCase<OrderReadableEntity>;
