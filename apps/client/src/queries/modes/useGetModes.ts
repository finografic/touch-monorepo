import { useQuery } from '@tanstack/react-query';

import { modesEndpoints } from 'api/endpoints';
import type { ModeModel } from 'types/models/modes.model';

/**
 * Get all modes
 */
export const useGetModes = () => {
  return useQuery<ModeModel[]>({
    queryKey: ['modes'],
    queryFn: modesEndpoints.getAll,
  });
};
