import { z } from 'zod';
import { MIN_TEMP_DIFFERENCE } from 'constants/temperature.config';
import { isRowComplete } from './orders-form.utils';

export const TIME_ROW_SCHEMA = z.object({
  temperature: z.coerce.number().min(-50).max(50).optional(),
  timeA: z.coerce.number().int().min(0).max(3600).optional(),
  timeB: z.coerce.number().int().min(0).max(3600).optional(),
  timeC: z.coerce.number().int().min(0).max(3600).optional(),
});

export const ORDER_FORM_SCHEMA = z
  .object({
    mode: z.coerce.number().int().min(1).max(5),
    drinkType: z.string().min(1, 'Drink type is required'),
    drinkSubtype: z.string().optional(),
    volume: z.string().min(1, 'Volume is required'),
    containerType: z.string().min(1, 'Container type is required'),
    defaultTempConsume: z.coerce.number().min(-40).max(40),
    defaultTempFreeze: z.coerce.number().min(-50).max(40),
    timeRows: z
      .array(TIME_ROW_SCHEMA)
      .min(1)
      .refine((rows) => rows.some(isRowComplete), {
        message: 'At least one complete row with all values is required',
        path: ['timeRows'],
      }),
  })
  .refine(
    (data) => data.defaultTempFreeze <= data.defaultTempConsume - MIN_TEMP_DIFFERENCE,
    (data) => {
      const maxValue = data.defaultTempConsume - MIN_TEMP_DIFFERENCE;
      const formattedMax = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }).format(maxValue);
      return {
        message: `Max value is ${formattedMax}`,
        path: ['defaultTempFreeze'],
      };
    },
  );

export type OrdersFormValues = z.infer<typeof ORDER_FORM_SCHEMA>;
