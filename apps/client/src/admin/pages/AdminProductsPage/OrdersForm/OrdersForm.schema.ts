import { MIN_TEMP_DIFFERENCE } from '@workspace/shared/constants';

import * as v from 'valibot';

import { isRowComplete } from './orders-form.utils';

export const TIME_ROW_SCHEMA = v.object({
  temperature: v.optional(v.pipe(v.number(), v.minValue(-50), v.maxValue(50))),
  timeA: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(3600))),
  timeB: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(3600))),
  timeC: v.optional(v.pipe(v.number(), v.integer(), v.minValue(0), v.maxValue(3600))),
});

export const ORDER_FORM_SCHEMA = v.pipe(
  v.object({
    modeId: v.pipe(v.string(), v.minLength(1, 'Mode is required')),
    drinkType: v.pipe(v.string(), v.minLength(1, 'Drink type is required')),
    drinkSubtype: v.optional(v.string()),
    volume: v.pipe(v.string(), v.minLength(1, 'Volume is required')),
    containerType: v.pipe(v.string(), v.minLength(1, 'Container type is required')),
    defaultTempConsume: v.pipe(v.number(), v.minValue(-40), v.maxValue(40)),
    defaultTempFreeze: v.pipe(v.number(), v.minValue(-50), v.maxValue(40)),
    timeRows: v.pipe(
      v.array(TIME_ROW_SCHEMA),
      v.minLength(1),
      v.check(
        (rows) => rows.some(isRowComplete),
        'At least one complete row with all values is required',
      ),
    ),
  }),
  v.check(
    (data) => data.defaultTempFreeze <= data.defaultTempConsume - MIN_TEMP_DIFFERENCE,
    'Freeze temperature exceeds maximum',
  ),
);

export type OrdersFormValues = v.InferOutput<typeof ORDER_FORM_SCHEMA>;
