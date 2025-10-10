import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { UseMutationResult } from '@tanstack/react-query';
import type { ErrorResponse } from '@workspace/core/api';
import { GET_MODES_QUERYKEY } from '.';
import { api } from 'api';
import { transformAxiosError } from '@workspace/core/api';
import type { ModeModel } from 'types/models/mode.model';

interface UpdateDefaultModeRequest {
  defaultModeId: string | null;
}

const updateDefaultMode = async (request: UpdateDefaultModeRequest): Promise<ModeModel[]> => {
  try {
    const response = await api.patch<ModeModel[]>('/modes/default-mode', request);
    if (response.status !== 200) {
      throw new Error(`Failed to update default mode: ${response.statusText}`);
    }
    return response.data;
  } catch (error) {
    throw transformAxiosError(error);
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
