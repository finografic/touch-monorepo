import type { DrinkType as ApiDrinkType, DrinkSubtype as ApiDrinkSubtype } from '@touch/shared/types';
import type { DrinkType as DbDrinkType, DrinkSubtype as DbDrinkSubtype } from '../entities/drink-types.types';

export const DrinkTypeDto = {
  toApi: (data: DbDrinkType): ApiDrinkType => ({
    id: data.id,
    name: data.name,
    displayName: data.display_name,
    hasSubtypes: Boolean(data.has_subtypes),
    defaultConsumptionTemp: data.default_consumption_time,
    defaultFreezeTemp: data.default_freeze_temp,
    isActive: Boolean(data.is_active),
    createdAt: data.createdAt?.toISOString() || null,
    updatedAt: data.updatedAt?.toISOString() || null,
  }),

  fromApi: (data: Partial<ApiDrinkType> & { id?: string }): Partial<DbDrinkType> => ({
    ...(data.id && { id: data.id }),
    ...(data.name && { name: data.name }),
    ...(data.displayName && { display_name: data.displayName }),
    ...(typeof data.hasSubtypes !== 'undefined' && { has_subtypes: data.hasSubtypes ? 1 : 0 }),
    ...(typeof data.defaultConsumptionTemp !== 'undefined' && {
      default_consumption_time: data.defaultConsumptionTemp,
    }),
    ...(typeof data.defaultFreezeTemp !== 'undefined' && { default_freeze_temp: data.defaultFreezeTemp }),
    ...(typeof data.isActive !== 'undefined' && { is_active: data.isActive ? 1 : 0 }),
  }),
};

export const DrinkSubtypeDto = {
  toApi: (data: DbDrinkSubtype): ApiDrinkSubtype => ({
    id: data.id,
    drinkTypeId: data.drink_type_id,
    name: data.name,
    displayName: data.display_name,
    isActive: Boolean(data.is_active),
  }),

  fromApi: (data: Partial<ApiDrinkSubtype> & { id?: string }): Partial<DbDrinkSubtype> => ({
    ...(data.id && { id: data.id }),
    ...(data.drinkTypeId && { drink_type_id: data.drinkTypeId }),
    ...(data.name && { name: data.name }),
    ...(data.displayName && { display_name: data.displayName }),
    ...(typeof data.isActive !== 'undefined' && { is_active: data.isActive ? 1 : 0 }),
  }),
};
