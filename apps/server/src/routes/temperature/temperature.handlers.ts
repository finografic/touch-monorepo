import type { AppRouteHandler } from 'types/app.types';
import type { CalculateRoute, GetSettingsRoute } from './temperature.routes';
import { db } from 'db';
import * as HttpStatusCodes from 'stoker/http-status-codes';
import * as HttpStatusPhrases from 'stoker/http-status-phrases';
import { ZOD_ERROR_CODES } from 'lib/constants';

export const getSettings: AppRouteHandler<GetSettingsRoute> = async (context) => {
  try {
    const { drinkTypeId, drinkSubtypeId, containerTypeId, volumeId } = context.req.valid('query');

    // Get drink type and optional subtype
    const drinkType = await db.query.drink_types.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, drinkTypeId), operators.eq(fields.isActive, true)),
    });

    if (!drinkType) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Get subtype if specified
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let drinkSubtype;
    if (drinkSubtypeId) {
      drinkSubtype = await db.query.drink_subtypes.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.id, drinkSubtypeId),
            operators.eq(fields.drinkTypeId, drinkTypeId),
            operators.eq(fields.isActive, true),
          ),
      });

      if (!drinkSubtype) {
        return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
      }
    }

    // Get container type
    const containerType = await db.query.container_types.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, containerTypeId), operators.eq(fields.isActive, true)),
    });

    if (!containerType) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Get volume
    const volume = await db.query.volumes.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, volumeId), operators.eq(fields.isActive, true)),
    });

    if (!volume) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Build dynamic configuration
    const defaultConsumptionTemp = drinkSubtype?.consumptionTemp ?? drinkType.defaultConsumptionTemp;
    const defaultFreezeTemp = drinkSubtype?.freezeTemp ?? drinkType.defaultFreezeTemp;

    // Return dynamically calculated settings
    return context.json(
      {
        defaultConsumptionTemp,
        minConsumptionTemp: defaultConsumptionTemp - 2, // 2 degrees below default
        maxConsumptionTemp: defaultConsumptionTemp + 2, // 2 degrees above default
        defaultFreezeTemp,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('Error in getSettings handler:', error);
    return context.json(
      { message: error instanceof Error ? error.message : String(error) },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

export const calculate: AppRouteHandler<CalculateRoute> = async (context) => {
  try {
    const { drinkTypeId, drinkSubtypeId, containerTypeId, volumeId, initialTemp, targetTemp } =
      context.req.valid('json');

    // Get drink type and optional subtype
    const drinkType = await db.query.drink_types.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, drinkTypeId), operators.eq(fields.isActive, true)),
    });

    if (!drinkType) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Get subtype if specified
    // biome-ignore lint/suspicious/noImplicitAnyLet: <explanation>
    let drinkSubtype;
    if (drinkSubtypeId) {
      drinkSubtype = await db.query.drink_subtypes.findFirst({
        where: (fields, operators) =>
          operators.and(
            operators.eq(fields.id, drinkSubtypeId),
            operators.eq(fields.drinkTypeId, drinkTypeId),
            operators.eq(fields.isActive, true),
          ),
      });

      if (!drinkSubtype) {
        return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
      }
    }

    // Get container type
    const containerType = await db.query.container_types.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, containerTypeId), operators.eq(fields.isActive, true)),
    });

    if (!containerType) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Get volume
    const volume = await db.query.volumes.findFirst({
      where: (fields, operators) =>
        operators.and(operators.eq(fields.id, volumeId), operators.eq(fields.isActive, true)),
    });

    if (!volume) {
      return context.json({ message: HttpStatusPhrases.NOT_FOUND }, HttpStatusCodes.NOT_FOUND);
    }

    // Get consumption temperature from subtype or drink type
    const defaultConsumptionTemp = drinkSubtype?.consumptionTemp ?? drinkType.defaultConsumptionTemp;
    const minConsumptionTemp = defaultConsumptionTemp - 2;
    const maxConsumptionTemp = defaultConsumptionTemp + 2;

    // Validate target temperature
    if (targetTemp < minConsumptionTemp || targetTemp > maxConsumptionTemp) {
      return context.json(
        {
          success: false,
          error: {
            issues: [
              {
                code: ZOD_ERROR_CODES.INVALID_UPDATES,
                path: ['targetTemp'],
                message: `Target temperature must be between ${minConsumptionTemp}°C and ${maxConsumptionTemp}°C`,
              },
            ],
            name: 'ZodError',
          },
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY,
      );
    }

    // Calculate duration
    const tempDiff = Math.abs(targetTemp - initialTemp);
    const baseTime = tempDiff * 60; // 1 minute per degree difference as base
    const volumeFactor = volume.coolingFactor;
    const containerFactor = containerType.thermalConductivity / 100; // Normalize to a reasonable factor

    const estimatedSeconds = Math.round(baseTime * volumeFactor * containerFactor);

    // Select appropriate time table
    const timeTableId = tempDiff > 0 ? '2001' : '1001'; // Heating vs Cooling

    // Return calculated result
    return context.json(
      {
        estimatedDurationSeconds: estimatedSeconds,
        phases: [
          {
            durationSeconds: estimatedSeconds,
            startTemp: initialTemp,
            endTemp: targetTemp,
            description: `${tempDiff > 0 ? 'Heating' : 'Cooling'} from ${initialTemp}°C to ${targetTemp}°C`,
          },
        ],
        timeTableId,
        recommendations: [
          `Optimal serving temperature for ${drinkType.displayName}${drinkSubtype ? ` (${drinkSubtype.displayName})` : ''} is ${defaultConsumptionTemp}°C`,
          `Using ${containerType.displayName} with ${volume.valueInMl}ml capacity`,
        ],
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('Error in calculate handler:', error);
    return context.json(
      { message: error instanceof Error ? error.message : String(error) },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};
