import type { ErrorResponse } from '@workspace/core/api';
import { transformFetchError } from '@workspace/core/api';

import type { UseMutationResult } from '@tanstack/react-query';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from 'api';

import type { ModeModel } from 'types/models/mode.model';
import { GET_MODES_QUERYKEY } from '.';

interface UpdateDefaultModeRequest {
  defaultModeId: string | null;
}

const updateDefaultMode = async (request: UpdateDefaultModeRequest): Promise<ModeModel[]> => {
  try {
    // Fetch client returns data directly and handles errors
    return await api.patch<ModeModel[]>('/modes/default-mode', request);
  } catch (error) {
    throw transformFetchError(error);
  }
};

export const useUpdateDefaultMode = (): UseMutationResult<
  ModeModel[],
  ErrorResponse,
  UpdateDefaultModeRequest
> => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateDefaultMode,
    onSuccess: (data) => {
      // Invalidate and refetch modes data
      queryClient.setQueryData(GET_MODES_QUERYKEY, data);
      queryClient.invalidateQueries({ queryKey: GET_MODES_QUERYKEY });
    },
  });
};
