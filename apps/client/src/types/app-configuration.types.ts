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
