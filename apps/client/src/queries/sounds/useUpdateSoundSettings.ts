import { useMutation, useQueryClient } from '@tanstack/react-query';

import { SoundsEndpoints } from 'api/endpoints';

/**
 * Update sound settings
 */
export const useUpdateSoundSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: SoundsEndpoints.updateSettings,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['sounds', 'settings'] });
    },
  });
};
