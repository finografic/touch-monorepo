import { useQuery } from '@tanstack/react-query';
import type { DrinkType } from 'types/drinks.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

const getDrinkType = async (id: string): Promise<DrinkType> => {
  const response = await fetch(`/api/drink-types/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch drink type with id ${id}`);
  }
  return response.json();
};

export const useGetDrinkType = (id: string) => {
  return useQuery({
    queryKey: [...GET_DRINK_TYPES_QUERYKEY, id],
    queryFn: () => getDrinkType(id),
    enabled: !!id, // Only run the query if we have an ID
  });
};
