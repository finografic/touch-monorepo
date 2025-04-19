import { useQuery } from '@tanstack/react-query';
import type { DrinkType } from 'types/drinks.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';

const getDrinkTypes = async (): Promise<DrinkType[]> => {
  const response = await fetch('/api/drink-types');
  if (!response.ok) {
    throw new Error('Failed to fetch drink types');
  }
  return response.json();
};

export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_QUERYKEY,
    queryFn: getDrinkTypes,
  });
};
