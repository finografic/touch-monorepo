// ============================================================================
// CONTAINER TYPES
// ============================================================================
export {
  containerTypesEndpoints,
  type ContainerType,
  type ContainerTypeEntity,
  type CreateContainerTypeInput,
  type UpdateContainerTypeInput,
} from './container-types.endpoints';

// ============================================================================
// DRINK TYPES
// ============================================================================
export { drinkTypeEndpoints, type DrinkTypeTranslation, type DrinkTypeUpdate } from './drink-type.endpoints';

// ============================================================================
// DRINK SUBTYPES
// ============================================================================
export {
  drinkSubtypeEndpoints,
  type DrinkSubtypeTranslation,
  type DrinkSubtypeUpdate,
} from './drink-subtype.endpoints';

// ============================================================================
// VOLUMES
// ============================================================================
export { volumeEndpoints, type VolumeTranslation, type VolumeUpdate } from './volume.endpoints';

// ============================================================================
// TRANSLATIONS UI
// ============================================================================
export {
  translationsUiEndpoints,
  type CreateTranslationUiInput,
  type UpdateTranslationUiInput,
} from './translations-ui.endpoints';

// ============================================================================
// ORDERS
// ============================================================================
export {
  ordersEndpoints,
  type CreateOrderInput,
  type UpdateOrderInput,
  type TemperatureProfileInput,
  type CreateOrderWithProfilesInput,
} from './orders.endpoints';

// ============================================================================
// SLOT CONFIGURATIONS
// ============================================================================
export { slotConfigurationsEndpoints } from './slot-configurations.endpoints';

// ============================================================================
// MODES
// ============================================================================
export {
  modesEndpoints,
  type UpdateModeInput,
  type UpdateDefaultModeRequest,
  type UpdateActiveStatesRequest,
} from './modes.endpoints';

// ============================================================================
// RELAYS
// ============================================================================
export {
  relaysEndpoints,
  type RelayState,
  type RelayStatus,
  type ToggleRelayInput,
  type ToggleRelayResponse,
  type BulkRelayResponse,
  type DisconnectRelayResponse,
  type ReconnectResponse,
} from './relays.endpoints';

// ============================================================================
// SOUNDS
// ============================================================================
export { SoundsEndpoints, type UpdateSoundSettingsInput } from './sounds.endpoints';

// ============================================================================
// SUPPORTED LANGUAGES
// ============================================================================
export { supportedLanguagesEndpoints } from './supported-languages.endpoints';
