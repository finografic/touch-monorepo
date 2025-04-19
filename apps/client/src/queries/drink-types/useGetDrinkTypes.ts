import { useQuery } from '@tanstack/react-query';
import type { DrinkType } from 'types/drinks.types';
import { GET_DRINK_TYPES_QUERYKEY } from '.';
import { api } from 'lib/axios';

const getDrinkTypes = async (): Promise<DrinkType[]> => {
  return api.get('/drink-types');
};

export const useGetDrinkTypes = () => {
  return useQuery({
    queryKey: GET_DRINK_TYPES_QUERYKEY,
    queryFn: getDrinkTypes,
  });
};
