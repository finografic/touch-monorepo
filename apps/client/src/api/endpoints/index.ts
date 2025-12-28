// ============================================================================
// CONTAINER TYPES
// ============================================================================
export { type ContainerTypeUpdate, EndpointsContainerType } from './container-type.endpoints';

// ============================================================================
// DRINK SUBTYPES
// ============================================================================
export { type DrinkSubtypeUpdate, EndpointsDrinkSubtype } from './drink-subtype.endpoints';

// ============================================================================
// DRINK TYPES
// ============================================================================
export { type DrinkTypeUpdate, EndpointsDrinkType } from './drink-type.endpoints';

// ============================================================================
// MODES
// ============================================================================
export {
  EndpointsMode,
  type UpdateActiveStatesRequest,
  type UpdateDefaultModeRequest,
  type UpdateModeInput,
} from './mode.endpoints';

// ============================================================================
// ORDERS
// ============================================================================
export {
  type CreateOrderInput,
  type CreateOrderWithProfilesInput,
  EndpointsOrders,
  type TemperatureProfileInput,
  type UpdateOrderInput,
} from './orders.endpoints';

// ============================================================================
// RELAYS
// ============================================================================
export {
  type BulkRelayResponse,
  type DisconnectRelayResponse,
  type ReconnectResponse,
  RelaysEndpoints,
  type RelayState,
  type RelayStatus,
  type ToggleRelayInput,
  type ToggleRelayResponse,
} from './relays.endpoints';

// ============================================================================
// SLOT CONFIGURATIONS
// ============================================================================
export { slotConfigurationsEndpoints } from './slot-configurations.endpoints';

// ============================================================================
// SOUNDS
// ============================================================================
export { SoundsEndpoints, type UpdateSoundSettingsInput } from './sounds.endpoints';

// ============================================================================
// SUPPORTED LANGUAGES
// ============================================================================
export { EndpointsSupportedLanguages } from './supported-languages.endpoints';

// ============================================================================
// TRANSLATIONS UI
// ============================================================================
export {
  type CreateTranslationUiInput,
  translationsUiEndpoints,
  type UpdateTranslationUiInput,
} from './translations-ui.endpoints';

// ============================================================================
// VOLUMES
// ============================================================================
export { EndpointsVolume, type VolumeUpdate } from './volume.endpoints';
