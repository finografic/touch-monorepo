import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { transformAxiosError } from '@workspace/core/api';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';
import { GET_MODES_QUERYKEY } from '.';

interface UpdateActiveStatesRequest {
  activeModeIds: string[];
}

const updateActiveStates = async (request: UpdateActiveStatesRequest): Promise<ModeModel[]> => {
  try {
    const response = await api.patch<ModeModel[]>('/modes/active-states', request);
    if (response.status !== 200) {
      throw new Error(`Failed to update active states: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
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
