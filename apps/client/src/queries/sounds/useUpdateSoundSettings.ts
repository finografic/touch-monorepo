import { useMutation, useQueryClient } from '@tanstack/react-query';

import { soundsEndpoints, type UpdateSoundSettingsInput } from 'api/endpoints';

/**
 * Update sound settings
 */
export const useUpdateSoundSettings = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: soundsEndpoints.updateSettings,
    onSuccess: () => {
      // Invalidate sound settings query
      queryClient.invalidateQueries({ queryKey: ['sounds', 'settings'] });
    },
  });
};
