import type { ErrorResponse } from '@workspace/core/api';

import { useQuery, type UseQueryResult } from '@tanstack/react-query';
import { EndpointsMode } from 'api/endpoints';

import type { ModeModel } from 'types/models/mode.model';

/**
 * Get all modes
 */
export const useGetModes = (): UseQueryResult<ModeModel[], ErrorResponse> => {
  return useQuery<ModeModel[]>({
    queryKey: ['modes'],
    queryFn: EndpointsMode.getAll,
  });
};
