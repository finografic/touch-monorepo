import {
  containerTypeEndpoints,
  type ContainerTypeTranslation,
  type ContainerTypeUpdate,
} from './container-type.endpoints';
import {
  drinkSubtypeEndpoints,
  type DrinkSubtypeTranslation,
  type DrinkSubtypeUpdate,
} from './drink-subtype.endpoints';
import { drinkTypeEndpoints, type DrinkTypeTranslation, type DrinkTypeUpdate } from './drink-type.endpoints';
import { volumeEndpoints, type VolumeTranslation, type VolumeUpdate } from './volume.endpoints';

// Re-export all types
export type {
  ContainerTypeTranslation,
  ContainerTypeUpdate,
  DrinkSubtypeTranslation,
  DrinkSubtypeUpdate,
  DrinkTypeTranslation,
  DrinkTypeUpdate,
  VolumeTranslation,
  VolumeUpdate,
};

// Re-export all endpoints
export { containerTypeEndpoints, drinkSubtypeEndpoints, drinkTypeEndpoints, volumeEndpoints };

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
    containerTypes?: Array<{ id: string; updates: ContainerTypeUpdate }>;
  }) => {
    const promises: Promise<any>[] = [];

    // Update drink types
    if (data.drinkTypes) {
      promises.push(
        ...data.drinkTypes.map(({ id, updates }) => drinkTypeEndpoints.updateDrinkType(id, updates)),
      );
    }

    // Update drink subtypes - Skip for now as there's no direct endpoint
    // TODO: Implement drink subtype updates via a different mechanism
    if (data.drinkSubtypes && data.drinkSubtypes.length > 0) {
      console.warn('Drink subtype updates are not currently supported via direct API calls');
    }

    // Update volumes
    if (data.volumes) {
      promises.push(...data.volumes.map(({ id, updates }) => volumeEndpoints.updateVolume(id, updates)));
    }

    // Update container types
    if (data.containerTypes) {
      promises.push(
        ...data.containerTypes.map(({ id, updates }) =>
          containerTypeEndpoints.updateContainerType(id, updates),
        ),
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
