import { useQuery } from '@tanstack/react-query';
import type { DrinkType } from 'types/drinks.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/api';

const getDrinkType = async (id: string): Promise<DrinkType> => {
  return api.get(`/drink-types/${id}`);
};

export const useGetDrinkType = (id: string) => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: () => getDrinkType(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};
