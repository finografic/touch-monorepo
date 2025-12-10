import type { QueryClient } from '@tanstack/react-query';

import { GET_CONTAINER_TYPES_QUERYKEY } from './container-types';
import { GET_DRINK_TYPES_QUERYKEY, GET_DRINK_SUBTYPES_QUERYKEY } from './drink-types';
import { GET_DRINK_VOLUMES_QUERYKEY } from './drink-volumes';
import { GET_MODES_QUERYKEY } from './modes';

/**
 * Invalidates all product-flow reference queries so dependent UIs refresh:
 * - modes
 * - drink types
 * - drink subtypes (all drinkTypeId variants)
 * - volumes
 * - container types
 */
export const invalidateReferenceDataQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    queryClient.invalidateQueries({ queryKey: GET_MODES_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_DRINK_SUBTYPES_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY }),
  ]);
};

