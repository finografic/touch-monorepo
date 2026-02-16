/**
 * App configuration table row / API response shape.
 * Used by db-setup, server, and client for the app_configuration entity.
 */
export interface AppConfigurationEntity {
  id: string;
  name: string;
  isActive: boolean;
  data: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
