import type { DrinkTypeEntity } from '@touch/server/types/entities/drink-types.types';
import type { DrinkTypeModel } from 'types/models/drink-types.model';

export const DrinkTypeDTO = {
  fromApi(data: DrinkTypeEntity): DrinkTypeModel {
    return {
      id: data.id,
      name: data.name,
      displayName: data.display_name,
      hasSubtypes: Boolean(data.has_subtypes),
      defaultConsumptionTemp: data.default_consumption_temp,
      defaultFreezeTemp: data.default_freeze_temp,
      isActive: Boolean(data.is_active),
      createdAt: new Date(data.created_at * 1000),
      updatedAt: new Date(data.updated_at * 1000),
    };
  },

  toApi(data: DrinkTypeModel): DrinkTypeEntity {
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
