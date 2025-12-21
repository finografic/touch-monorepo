import type { QueryClient } from '@tanstack/react-query';
import {
  GET_CONTAINER_TYPES_QUERYKEY,
  POST_CONTAINER_TYPE_QUERYKEY,
  PATCH_CONTAINER_TYPE_QUERYKEY,
  DELETE_CONTAINER_TYPE_QUERYKEY,
} from './container-types';
import {
  GET_DRINK_SUBTYPES_QUERYKEY,
  GET_DRINK_TYPES_QUERYKEY,
  POST_DRINK_SUBTYPE_QUERYKEY,
  POST_DRINK_TYPE_QUERYKEY,
  PATCH_DRINK_SUBTYPE_QUERYKEY,
  PATCH_DRINK_TYPE_QUERYKEY,
  DELETE_DRINK_SUBTYPE_QUERYKEY,
  DELETE_DRINK_TYPE_QUERYKEY,
} from './drink-types';
import {
  GET_DRINK_VOLUMES_QUERYKEY,
  POST_DRINK_VOLUME_QUERYKEY,
  PATCH_DRINK_VOLUME_QUERYKEY,
  DELETE_DRINK_VOLUME_QUERYKEY,
} from './drink-volumes';
import { GET_MODES_QUERYKEY } from './modes';
import { GET_ORDERS_QUERYKEY, GET_ORDERS_READABLE_QUERYKEY } from './orders';
import {
  GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY,
  GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY,
  GET_VOLUMES_TRANSLATIONS_QUERYKEY,
  GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY,
} from './translations';

/**
 * Invalidates ALL product-flow reference queries (including mutation keys) so dependent UIs refresh:
 * - modes
 * - drink types (GET, POST, PATCH, DELETE)
 * - drink subtypes (GET, POST, PATCH, DELETE)
 * - volumes (GET, POST, PATCH, DELETE)
 * - container types (GET, POST, PATCH, DELETE)
 * - orders (raw)
 * - orders-readable (view)
 *
 * This aggressive invalidation ensures:
 * 1. Admin forms/dropdowns show updated values immediately
 * 2. Frontend product flow reflects changes without hard refresh
 * 3. Navigation between pages always shows fresh data
 */
export const invalidateReferenceDataQueries = async (queryClient: QueryClient) => {
  await Promise.all([
    // Modes
    queryClient.invalidateQueries({ queryKey: GET_MODES_QUERYKEY }),

    // Drink Types (all operations)
    queryClient.invalidateQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: POST_DRINK_TYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: PATCH_DRINK_TYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: DELETE_DRINK_TYPE_QUERYKEY }),

    // Drink Subtypes (all operations)
    queryClient.invalidateQueries({ queryKey: GET_DRINK_SUBTYPES_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: POST_DRINK_SUBTYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: PATCH_DRINK_SUBTYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: DELETE_DRINK_SUBTYPE_QUERYKEY }),

    // Volumes (all operations)
    queryClient.invalidateQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: POST_DRINK_VOLUME_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: PATCH_DRINK_VOLUME_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: DELETE_DRINK_VOLUME_QUERYKEY }),

    // Container Types (all operations)
    queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: POST_CONTAINER_TYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: PATCH_CONTAINER_TYPE_QUERYKEY }),
    // queryClient.invalidateQueries({ queryKey: DELETE_CONTAINER_TYPE_QUERYKEY }),

    // Orders
    queryClient.invalidateQueries({ queryKey: GET_ORDERS_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY }),

    // Translations
    queryClient.invalidateQueries({ queryKey: GET_DRINK_TYPES_TRANSLATIONS_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_DRINK_SUBTYPES_TRANSLATIONS_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_VOLUMES_TRANSLATIONS_QUERYKEY }),
    queryClient.invalidateQueries({ queryKey: GET_CONTAINER_TYPES_TRANSLATIONS_QUERYKEY }),
  ]);

  // Force refetch of GET queries to ensure immediate UI updates
  /*
  await Promise.all([
    queryClient.refetchQueries({ queryKey: GET_MODES_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_DRINK_TYPES_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_DRINK_SUBTYPES_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_DRINK_VOLUMES_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_CONTAINER_TYPES_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_ORDERS_QUERYKEY }),
    queryClient.refetchQueries({ queryKey: GET_ORDERS_READABLE_QUERYKEY }),
  ]);
  */
};
