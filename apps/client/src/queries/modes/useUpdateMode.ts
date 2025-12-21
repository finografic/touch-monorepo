import { useMutation, useQueryClient } from '@tanstack/react-query';

import { modesEndpoints, type UpdateModeInput } from 'api/endpoints';

/**
 * Hook to update an existing mode
 */
export const useUpdateMode = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: UpdateModeInput }) => modesEndpoints.update(id, updates),
    onSuccess: () => {
      // Invalidate modes queries
      queryClient.invalidateQueries({ queryKey: ['modes'] });
    },
  });
};
