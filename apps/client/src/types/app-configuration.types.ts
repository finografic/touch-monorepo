/**
 * App configuration entry from the API.
 * `data` is a JSON object; shape depends on the config key (e.g. grid_layout).
 */
export interface AppConfiguration {
  id: string;
  name: string;
  isActive: boolean;
  data: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}

/**
 * Fields allowed when PATCHing an app configuration.
 */
export interface UpdateAppConfigurationRequest {
  isActive?: boolean;
  data?: Record<string, unknown>;
}

/** Data shape for slot_special_* app config entries: visibility + which slot/relay to use. */
export interface SlotSpecialConfig {
  is_visible: boolean;
  slot_number: number;
  relay_number: number;
}

/** Param names for the three slot-special configs (used in hooks). */
export type SlotSpecialParam = 'special_grid' | 'special_power' | 'special_alt';

/** App config key for each slot-special param. */
export const SLOT_SPECIAL_CONFIG_KEYS: Record<SlotSpecialParam, string> = {
  special_grid: 'slot_special_grid',
  special_power: 'slot_special_power',
  special_alt: 'slot_special_alt',
} as const;

/** App configuration entry for a slot-special (has typed data). */
export interface SlotSpecialAppConfiguration extends Omit<AppConfiguration, 'data'> {
  data: SlotSpecialConfig;
}
