import type { AppRouteHandler } from 'types/app.types';
import type { CalculateRoute } from './temperature.routes';
import { db } from 'db';
import { drink_configs } from 'db/schemas';
import { and, eq } from 'drizzle-orm';
import type { DrinkConfigEntity } from '../../types/entities/drink-config.entity';
import type { DrinkTypeEntity } from '../../types/entities/drink-type.entity';
import type { ContainerTypeEntity } from '../../types/entities/container-type.entity';
import type { VolumeEntity } from '../../types/entities/volume.entity';

type DrinkConfigWithRelations = DrinkConfigEntity & {
  drinkType: DrinkTypeEntity;
  drinkSubtype?: DrinkTypeEntity;
  containerType: ContainerTypeEntity;
  volume: VolumeEntity;
};

export const calculate: AppRouteHandler<CalculateRoute> = async (context) => {
  const { drinkTypeId, drinkSubtypeId, containerTypeId, volumeId, initialTemp, targetTemp } =
    context.req.valid('json');

  // 1. Find matching drink configuration
  const config = (await db.query.drink_configs.findFirst({
    where: (fields, operators) => {
      const conditions = [
        operators.eq(fields.drinkTypeId, drinkTypeId),
        operators.eq(fields.containerTypeId, containerTypeId),
        operators.eq(fields.volumeId, volumeId),
        operators.eq(fields.isActive, true),
      ];

      if (drinkSubtypeId) {
        conditions.push(operators.eq(fields.drinkSubtypeId, drinkSubtypeId));
      }

      return operators.and(...conditions);
    },
    with: {
      drinkType: true,
      containerType: true,
      volume: true,
      drinkSubtype: drinkSubtypeId ? true : undefined,
    },
  })) as DrinkConfigWithRelations | undefined;

  if (!config) {
    return context.json(
      {
        message: 'No matching drink configuration found',
      },
      422,
    );
  }

  // 2. Validate temperature ranges
  if (targetTemp < config.min_consumption_temp || targetTemp > config.max_consumption_temp) {
    return context.json(
      {
        message: `Target temperature must be between ${config.min_consumption_temp}°C and ${config.max_consumption_temp}°C`,
      },
      422,
    );
  }

  // 3. Calculate time based on configuration
  // This is where you'd implement your temperature calculation logic
  // For now, returning a placeholder response
  const tempDiff = Math.abs(targetTemp - initialTemp);
  const baseTime = tempDiff * 60; // 1 minute per degree difference as base
  const volumeFactor = config.volume.cooling_factor;
  const containerFactor = config.containerType.thermal_conductivity;

  const estimatedSeconds = Math.round(baseTime * volumeFactor * containerFactor);

  // 4. Return calculated result
  return context.json({
    estimatedDurationSeconds: estimatedSeconds,
    phases: [
      {
        durationSeconds: estimatedSeconds,
        startTemp: initialTemp,
        endTemp: targetTemp,
        description: `${tempDiff > 0 ? 'Heating' : 'Cooling'} from ${initialTemp}°C to ${targetTemp}°C`,
      },
    ],
    timeTableId: tempDiff > 0 ? config.time_table_id_2 : config.time_table_id_1,
    recommendations: [
      `Optimal serving temperature for ${config.drinkType.display_name} is ${config.default_consumption_temp}°C`,
      `Using ${config.containerType.display_name} with ${config.volume.value_in_ml}ml capacity`,
    ],
  });
};
