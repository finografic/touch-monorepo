import type { DrinkTypeEntity } from '@touch/server/types/entities/drink-type.entity';
import type { DrinkType } from 'types/models/drink-type.model';
import { ApiResponse } from '../../../../../packages/shared/src/types/api.types';

export const DrinkTypeDTO = {
  fromApi(data: ApiResponse<DrinkTypeEntity[]>): DrinkType[] {
    return data.data.map((drinkType) => ({
      id: drinkType.id,
      name: drinkType.name,
      displayName: drinkType.display_name,
      hasSubtypes: Boolean(drinkType.has_subtypes),
      defaultConsumptionTemp: drinkType.default_consumption_temp,
      defaultFreezeTemp: drinkType.default_freeze_temp,
      isActive: Boolean(drinkType.is_active),
      createdAt: new Date(drinkType.created_at * 1000),
      updatedAt: new Date(drinkType.updated_at * 1000),
    }));
  },

  toApi(data: DrinkType): DrinkTypeEntity {
    return {
      id: data.id,
      name: data.name,
      display_name: data.displayName,
      has_subtypes: Number(data.hasSubtypes),
      default_consumption_temp: data.defaultConsumptionTemp,
      default_freeze_temp: data.defaultFreezeTemp,
      is_active: Number(data.isActive),
      created_at: Math.floor(data.createdAt.getTime() / 1000),
      updated_at: Math.floor(data.updatedAt.getTime() / 1000),
    };
  },
};
