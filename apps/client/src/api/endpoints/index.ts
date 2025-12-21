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
