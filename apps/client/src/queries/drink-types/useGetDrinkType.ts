import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/shared/types';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import type { DrinkType } from 'types/models/drink-type.model';
import type { DrinkTypeEntity } from '@workspace/server/types/entities/drink-type.entity';
import { DrinkTypeDTO } from './DrinkTypes.dto';

const getDrinkType = async (id: string) => {
  try {
    const response = await api.get<ApiResponse<DrinkTypeEntity>>(`/drink-types/${id}`);
    if (response.status !== 200) {
      throw new Error(`Failed to fetch drink type: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
    // ======================================================================== //
    // TODO: SOMETHING LIKE THIS, MAYBE ??
    /*
    export class APIError extends Error {
      constructor(
        public err: AxiosError,
        public code: string,
        public response: any,
      ) {
        super('Conso API a répondu avec une erreur');
      }

      toString() {
        return (
          `Conso API a répondu avec une erreur\nCode: ${this.code}\nRéponse : ` +
          JSON.stringify(this.response, null, 4)
        );
      }
    }
    if (err.response) {
      throw new APIError(err, err.response.status, err.response.data);
    }
    if (err.request) {
      throw new Error(`Aucune réponse de Conso API\nRequête : ` + JSON.stringify(err.request, null, 4));
    }
    throw new Error(`Impossible d'appeler Conso API\nErreur : ${err.message}`);
    */

    // ======================================================================== //
  }
};

export const useGetDrinkType = (id: string): UseQueryResult<DrinkType, ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: async () => getDrinkType(id),
    enabled: !!id,
    select: (data) => DrinkTypeDTO.fromApi(data),
  });
};
