import { z } from 'zod';

export const calculateTemperatureSchema = z.object({
  drinkTypeId: z.string(),
  drinkSubtypeId: z.string().optional(),
  containerTypeId: z.string(),
  volumeId: z.string(),
  initialTemp: z.number(),
  targetTemp: z.number(),
});
