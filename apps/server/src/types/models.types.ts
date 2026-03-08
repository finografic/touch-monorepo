// Re-export all Valibot-inferred model types from DB schemas.
// Single import point: `@workspace/server/models`

// Auth
export type { UserModel, UserPatch } from 'db/schemas/auth_user.schema';

// Configuration
export type { AppConfiguration, NewAppConfiguration } from 'db/schemas/app_configuration.schema';
export type { SlotConfiguration, NewSlotConfiguration } from 'db/schemas/slot_configurations.schema';

// Drinks
export type { ContainerTypeModel, ContainerTypeInsert, ContainerTypePatch } from 'db/schemas/container_types.schema';
export type { DrinkSubtypeModel, DrinkSubtypeInsert, DrinkSubtypePatch } from 'db/schemas/drink_subtypes.schema';
export type { DrinkTypeModel, DrinkTypeInsert, DrinkTypePatch } from 'db/schemas/drink_types.schema';
export type { VolumeModel, VolumeInsert, VolumePatch } from 'db/schemas/volumes.schema';

// Orders
export type { OrderModel, OrderInsert, OrderPatch } from 'db/schemas/orders.schema';
export type { OrdersReadableView } from 'db/schemas/orders_readable_view.schema';

// Modes & Temperature
export type { ModeModel, ModeInsert, ModePatch } from 'db/schemas/modes.schema';
export type { TemperatureProfileModel, TemperatureProfileInsert, TemperatureProfilePatch } from 'db/schemas/temperature_profiles.schema';

// Languages & Translations
export type { SupportedLanguageModel, SupportedLanguageInsert, SupportedLanguagePatch } from 'db/schemas/supported_languages.schema';
export type { TranslatableEntityModel, TranslatableEntityInsert, TranslatableEntityPatch } from 'db/schemas/translatable_entities.schema';
export type { TranslationAdminModel, TranslationAdminInsert, TranslationAdminPatch } from 'db/schemas/translations_admin.schema';
export type { TranslationAppModel, TranslationAppInsert, TranslationAppPatch } from 'db/schemas/translations_app.schema';
export type { TranslationUiModel, TranslationUiInsert, TranslationUiPatch } from 'db/schemas/translations_ui.schema';
