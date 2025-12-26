import { useQuery } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';

import type { UseQueryResult } from '@tanstack/react-query';
import { ModesEndpoints } from 'api/endpoints';
import { GET_DEFAULT_MODE_QUERYKEY } from 'queries/modes';
import type { ModeModel } from 'types/models/mode.model';

/**
 * Get the default mode
 */
export const useGetDefaultMode = (): UseQueryResult<ModeModel | null, ErrorResponse> => {
  return useQuery<ModeModel | null>({
    queryKey: [...GET_DEFAULT_MODE_QUERYKEY],
    queryFn: ModesEndpoints.getDefault,
  });
};
