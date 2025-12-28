import { useMutation } from '@tanstack/react-query';
import { type ContainerTypeUpdate, EndpointsContainerType } from 'api/endpoints';

import type { ContainerType } from 'types/models/container.model';

export const useUpdateContainerType = () => {
  return useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: ContainerTypeUpdate }): Promise<ContainerType> =>
      EndpointsContainerType.update(id, updates),
  });
};
