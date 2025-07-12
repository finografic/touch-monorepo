import { useQuery } from '@tanstack/react-query';
import type { UseQueryResult } from '@tanstack/react-query';
// import type { ApiResponse, ErrorResponse } from '@workspace/core/api';
import type { ApiResponse, ErrorResponse } from '@workspace/types';
import { GET_COOLING_PROFILES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from 'src/api/api.utils';
import type { CoolingProfile } from 'types/models/cooling-profile.model';

const getCoolingProfiles = async (): Promise<CoolingProfile[]> => {
  try {
    const response = await api.get<ApiResponse<CoolingProfile[]>>('/cooling-profiles');
    if (response.status !== 200) {
      throw new Error(`Failed to fetch cooling profiles: ${response.statusText}`);
    }

    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
  }
};

export const useGetCoolingProfiles = (): UseQueryResult<CoolingProfile[], ErrorResponse> => {
  return useQuery({
    queryKey: [...GET_COOLING_PROFILES_QUERYKEY],
    queryFn: async () => getCoolingProfiles(),
  });
};
