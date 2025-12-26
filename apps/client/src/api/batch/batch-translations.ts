import {
  EndpointsContainerTypes,
  type ContainerType,
  type UpdateContainerTypeInput,
} from '../endpoints/container-types.endpoints';
import {
  EndpointsDrinkSubtype,
  type DrinkSubtypeTranslation,
  type DrinkSubtypeUpdate,
} from '../endpoints/drink-subtype.endpoints';
import {
  EndpointsDrinkType,
  type DrinkTypeTranslation,
  type DrinkTypeUpdate,
} from '../endpoints/drink-type.endpoints';
import { EndpointsVolume, type VolumeTranslation, type VolumeUpdate } from '../endpoints/volume.endpoints';

// Re-export all types
export type {
  ContainerType,
  UpdateContainerTypeInput,
  DrinkSubtypeTranslation,
  DrinkSubtypeUpdate,
  DrinkTypeTranslation,
  DrinkTypeUpdate,
  VolumeTranslation,
  VolumeUpdate,
};

// Re-export all endpoints
export { EndpointsContainerTypes, EndpointsDrinkSubtype, EndpointsDrinkType, EndpointsVolume };

/**
 * Batch update operations for form submission
 * Combines all entity endpoints for bulk operations
 */
export const batchTranslationEndpoints = {
  /**
   * Batch update translations across multiple entity types
   */
  batchUpdateTranslations: async (data: {
    drinkTypes?: Array<{ id: string; updates: DrinkTypeUpdate }>;
    drinkSubtypes?: Array<{ id: string; updates: DrinkSubtypeUpdate }>;
    volumes?: Array<{ id: string; updates: VolumeUpdate }>;
    containerTypes?: Array<{ id: string; updates: UpdateContainerTypeInput }>;
  }) => {
    const promises: Promise<any>[] = [];

    // Update drink types
    if (data.drinkTypes) {
      promises.push(
        ...data.drinkTypes.map(({ id, updates }) => {
          const isNewItem = id.startsWith('temp-');
          if (isNewItem) {
            // Create new drink type using POST
            return EndpointsDrinkType.createDrinkType(updates);
          }
          // Update existing drink type using PATCH
          return EndpointsDrinkType.updateDrinkType(id, updates);
        }),
      );
    }

    // Update drink subtypes - requires drinkTypeId for each subtype
    if (data.drinkSubtypes) {
      // Note: drinkSubtypes need drinkTypeId, which should be included in the update data
      // We'll need to get drinkTypeId from the original item data
      promises.push(
        ...data.drinkSubtypes.map(({ id, updates, drinkTypeId }: any) => {
          if (!drinkTypeId) {
            throw new Error(`drinkTypeId is required for drink subtype ${id}`);
          }

          // Check if this is a new item (temp ID starts with "temp-")
          // For new items, use POST to create; for existing items, use PATCH to update
          const isNewItem = id.startsWith('temp-');

          if (isNewItem) {
            // Create new subtype using POST (no ID in URL)
            return EndpointsDrinkSubtype.createDrinkSubtype({
              ...updates,
              drinkTypeId,
            });
          } else {
            // Update existing subtype using PATCH (ID in URL)
            return EndpointsDrinkSubtype.updateDrinkSubtype(id, updates, drinkTypeId);
          }
        }),
      );
    }

    // Update volumes
    if (data.volumes) {
      promises.push(...data.volumes.map(({ id, updates }) => EndpointsVolume.updateVolume(id, updates)));
    }

    // Update container types
    if (data.containerTypes) {
      promises.push(
        ...data.containerTypes.map(({ id, updates }) => EndpointsContainerTypes.update(id, updates)),
      );
    }

    // Execute all updates in parallel
    const results = await Promise.allSettled(promises);

    // Check for any failures
    const failures = results.filter((result) => result.status === 'rejected');
    if (failures.length > 0) {
      console.error('Some translation updates failed:', failures);
      throw new Error(`${failures.length} translation updates failed`);
    }

    return results.filter((result) => result.status === 'fulfilled').map((result) => result.value);
  },
} as const;
