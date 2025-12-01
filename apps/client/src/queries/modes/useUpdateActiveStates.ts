import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';
import { GET_MODES_QUERYKEY } from '.';

interface UpdateActiveStatesRequest {
  activeModeIds: string[];
}

const updateActiveStates = async (request: UpdateActiveStatesRequest): Promise<ModeModel[]> => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.patch<ModeModel[]>('/modes/active-states', request);
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useUpdateActiveStates = (): UseMutationResult<
  ModeModel[],
  ErrorResponse,
  UpdateActiveStatesRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateActiveStates,
    onSuccess: (data) => {
      // Invalidate and refetch modes data
      queryClient.setQueryData(GET_MODES_QUERYKEY, data);
      queryClient.invalidateQueries({ queryKey: GET_MODES_QUERYKEY });
    },
  });
};
