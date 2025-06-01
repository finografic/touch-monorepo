import { useQuery } from '@tanstack/react-query';
import { api } from 'api';

interface MinMaxTemperatures {
  min: number;
  max: number;
}

export const useGetMinMaxTemperatures = () => {
  return useQuery({
    queryKey: ['temperature-profiles', 'min-max'],
    queryFn: async () => {
      const response = await api.get<MinMaxTemperatures>('/temperature-profiles/min-max');
      return response.data;
    },
  });
};
