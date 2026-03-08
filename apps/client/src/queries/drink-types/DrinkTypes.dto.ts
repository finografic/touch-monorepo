import type { ApiResponse } from '@workspace/core/api';

import type { DrinkSubtype, DrinkType } from 'types/models/drink-type.model';

interface FromApiOverloads {
  (data: ApiResponse<DrinkType[]>): DrinkType[];
  (data: ApiResponse<DrinkType>): DrinkType;
  (data: ApiResponse<DrinkSubtype[]>): DrinkSubtype[];
  (data: ApiResponse<DrinkSubtype>): DrinkSubtype;
}

export const DrinkTypeDTO = {
  fromApi: ((
    data: ApiResponse<DrinkType | DrinkType[] | DrinkSubtype | DrinkSubtype[]>,
  ): DrinkType | DrinkType[] | DrinkSubtype | DrinkSubtype[] => {
    if (Array.isArray(data.data)) {
      return data.data;
    }
    return data.data;
  }) as FromApiOverloads,
};
