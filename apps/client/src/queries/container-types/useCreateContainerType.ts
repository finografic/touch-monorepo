import { useMutation } from '@tanstack/react-query';

import { EndpointsContainerType, type ContainerTypeUpdate } from 'api/endpoints';
import type { ContainerType } from 'types/models/container.model';

export interface CreateContainerTypeInput {
  name: string;
  thermalConductivity: number;
  translations?: Record<string, string>;
}

export const useCreateContainerType = () => {
  return useMutation({
    mutationFn: async (input: CreateContainerTypeInput): Promise<ContainerType> => {
      const updates: ContainerTypeUpdate & { name: string; thermalConductivity: number } = {
        name: input.name,
        thermalConductivity: input.thermalConductivity,
        translations: input.translations,
      };
      return EndpointsContainerType.create(updates);
    },
  });
};
