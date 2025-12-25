import { useQuery } from '@tanstack/react-query';

import { ModesEndpoints } from 'api/endpoints';
import type { ModeModel } from 'types/models/modes.model';

/**
 * Get the default mode
 */
export const useGetDefaultMode = () => {
  return useQuery<ModeModel | null>({
    queryKey: ['modes', 'default'],
    queryFn: ModesEndpoints.getDefault,
  });
};
