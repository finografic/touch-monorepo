import type { DrinkSubtypeEntity, DrinkTypeEntity } from '@workspace/server/types/entities/drink-type.entity';
import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';
import type { ApiResponse } from '@workspace/common/api';

interface FromApiOverloads {
  (data: ApiResponse<DrinkTypeEntity[]>): DrinkType[];
  (data: ApiResponse<DrinkTypeEntity>): DrinkType;
  (data: ApiResponse<DrinkSubtypeEntity[]>): DrinkSubtype[];
  (data: ApiResponse<DrinkSubtypeEntity>): DrinkSubtype;
}

const transformEntity = (drinkType: DrinkTypeEntity): DrinkType => ({
  id: drinkType.id,
  name: drinkType.name,
  displayName: drinkType.display_name,
  hasSubtypes: Boolean(drinkType.has_subtypes),
  defaultTempConsume: drinkType.default_temp_consume,
  defaultTempFreeze: drinkType.default_temp_freeze,
  isActive: Boolean(drinkType.is_active),
  createdAt: new Date(drinkType.created_at * 1000),
  updatedAt: new Date(drinkType.updated_at * 1000),
});

const transformSubtypeEntity = (subtype: DrinkSubtypeEntity): DrinkSubtype => ({
  id: subtype.id,
  name: subtype.name,
  displayName: subtype.display_name,
  drinkTypeId: subtype.drink_type_id,
  defaultTempConsume: subtype.default_temp_consume,
  defaultTempFreeze: subtype.default_temp_freeze,
  isActive: Boolean(subtype.is_active),
  createdAt: new Date(subtype.created_at * 1000),
  updatedAt: new Date(subtype.updated_at * 1000),
});

export const DrinkTypeDTO = {
  fromApi: ((
    data: ApiResponse<DrinkTypeEntity | DrinkTypeEntity[] | DrinkSubtypeEntity | DrinkSubtypeEntity[]>,
  ): DrinkType | DrinkType[] | DrinkSubtype | DrinkSubtype[] => {
    if (Array.isArray(data.data)) {
      // Check if it's an array of subtypes by looking at the first item
      if (data.data[0] && 'drink_type_id' in data.data[0]) {
        return data.data.map((item) => transformSubtypeEntity(item as DrinkSubtypeEntity));
      }
      return data.data.map((item) => transformEntity(item as DrinkTypeEntity));
    }
    if ('drink_type_id' in data.data) {
      return transformSubtypeEntity(data.data as DrinkSubtypeEntity);
    }
    return transformEntity(data.data as DrinkTypeEntity);
  }) as FromApiOverloads,

  toApi(data: DrinkType): DrinkTypeEntity {
    return {
      id: data.id,
      name: data.name,
      display_name: data.displayName,
      has_subtypes: Number(data.hasSubtypes),
      default_temp_consume: data.defaultTempConsume,
      default_temp_freeze: data.defaultTempFreeze,
      is_active: Number(data.isActive),
      created_at: Math.floor(data.createdAt.getTime() / 1000),
      updated_at: Math.floor(data.updatedAt.getTime() / 1000),
    };
  },

  toApiSubtype(data: DrinkSubtype): DrinkSubtypeEntity {
    return {
      id: data.id,
      name: data.name,
      display_name: data.displayName,
      drink_type_id: data.drinkTypeId,
      default_temp_consume: data.defaultTempConsume,
      default_temp_freeze: data.defaultTempFreeze,
      is_active: Number(data.isActive),
      created_at: Math.floor(data.createdAt.getTime() / 1000),
      updated_at: Math.floor(data.updatedAt.getTime() / 1000),
    };
  },

  fromSubtypeEntity: transformSubtypeEntity,
};
