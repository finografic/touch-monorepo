// @ts-nocheck
import axios, { HttpStatusCode } from 'axios';
import type { AxiosError, AxiosResponse } from 'axios';
import type { ErrorResponse } from '@workspace/shared/types';
import { ERROR_CODE_MAP } from '@workspace/shared';
import cloneDeep from 'lodash/cloneDeep';
import type { OrderFieldKey } from 'types/orders.types';
import type { ApiResponse } from '@workspace/shared/types/api.types';
import type { DrinkType } from 'types/models/drink-type.model';
import type { DrinkTypeEntity } from '@workspace/server/types/entities/drink-type.entity';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';

const createEndpoints = <T extends Record<string, (...args: any[]) => Promise<any>>>(endpoints: T) => {
  return Object.entries(endpoints).reduce(
    (acc, [key, fn]) => ({
      ...acc,
      [key]: async (...args: Parameters<typeof fn>) => {
        try {
          const response = await fn(...args);
          if (response.status > 399) {
            const code = response.status;
            const message = response?.message || response?.data?.message || 'Note found';
            throw new Error(message, JSON.parse(Object.assign({}, { code, message, ...response })));
          }

          return response.data;
        } catch (error) {
          throw transformAxiosError(error);
        }
      },
    }),
    {} as { [K in keyof T]: (...args: Parameters<T[K]>) => Promise<Awaited<ReturnType<T[K]>>['data']> },
  );
};

export const EndpointHelper = createEndpoints({
  getDrinkTypes: async () => await api.get<ApiResponse<DrinkType[]>>('/drink-types'),
  getDrinkType: async (id: string) => await api.get<ApiResponse<DrinkTypeEntity>>(`/drink-types/${id}`),
}) as const;
