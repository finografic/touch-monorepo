// ============================================================================
// CONTAINER TYPES
// ============================================================================
export {
  EndpointsContainerTypes,
  type ContainerType,
  type ContainerTypeEntity,
  type CreateContainerTypeInput,
  type UpdateContainerTypeInput,
} from './container-types.endpoints';

// ============================================================================
// DRINK TYPES
// ============================================================================
export { EndpointsDrinkType, type DrinkTypeTranslation, type DrinkTypeUpdate } from './drink-type.endpoints';

// ============================================================================
// DRINK SUBTYPES
// ============================================================================
export {
  EndpointsDrinkSubtype,
  type DrinkSubtypeTranslation,
  type DrinkSubtypeUpdate,
} from './drink-subtype.endpoints';

// ============================================================================
// VOLUMES
// ============================================================================
export { EndpointsVolume, type VolumeTranslation, type VolumeUpdate } from './volume.endpoints';

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
  EndpointsOrders,
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
  ModesEndpoints,
  type UpdateModeInput,
  type UpdateDefaultModeRequest,
  type UpdateActiveStatesRequest,
} from './modes.endpoints';

// ============================================================================
// RELAYS
// ============================================================================
export {
  RelaysEndpoints,
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
export { EndpointsSupportedLanguages } from './supported-languages.endpoints';
