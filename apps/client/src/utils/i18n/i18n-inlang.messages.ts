/**
 * Helper utility to simulate nested object variants for ParaglideJS
 *
 * This provides a clean API similar to the nested structure you wanted:
 *
 * Instead of:
 *   m.admin_dashboard_title({ role })
 *   m.admin_dashboard_description({ role })
 *
 * You can use:
 *   getAdminDashboard({ role }).title
 *   getAdminDashboard({ role }).description
 *
 * This approach:
 * 1. Works with current ParaglideJS limitations
 * 2. Provides the clean nested API you wanted
 * 3. Is easily migratable when nested objects are supported
 * 4. Groups related messages logically
 */

import { m } from 'i18n/messages';

// Admin Dashboard variants
export const getAdminDashboard = (inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_dashboard({ element: 'title', role: inputs.role }),
  description: m.admin_dashboard({ element: 'description', role: inputs.role }),
});

// Future: Admin Translations variants (when you implement them)
export const getAdminTranslations = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_translations_title(),
  description: m.admin_translations_description(),
  buttonText: m.admin_translations_title(), // You can add variants for these too
  helpText: m.admin_translations_description(),
});

// Future: Admin Languages variants
export const getAdminLanguages = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_languages_title(),
  description: m.admin_languages_description(),
  cardTitle: m.admin_languages_card_public_title(),
  cardDescription: m.admin_languages_card_public_description(),
});

// Future: Admin Sounds variants
export const getAdminSounds = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_sounds_title(),
  description: m.admin_sounds_description(),
});

// Future: Admin Mode variants
export const getAdminMode = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_mode_title(),
  description: m.admin_mode_description(),
  cardTitle: m.admin_mode_card_public_title(),
  cardDescription: m.admin_mode_card_public_description(),
});

// Future: Admin Maintenance variants
export const getAdminMaintenance = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_maintenance_title(),
  description: m.admin_maintenance_description(),
  cardTitle: m.admin_maintenance_card_public_title(),
  cardDescription: m.admin_maintenance_card_public_description(),
});

// Future: Admin Relays variants
export const getAdminRelays = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_relays_title(),
  description: m.admin_relays_description(),
});

// Future: Admin Items variants
export const getAdminItems = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_items_title(),
  description: m.admin_items_description(),
});

// Future: Admin UI Labels variants
export const getAdminUILabels = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_ui_labels_title(),
  description: m.admin_ui_labels_description(),
});

// Future: Admin Slot Config variants
export const getAdminSlotConfig = (_inputs: { role: 'public' | 'admin' }) => ({
  title: m.admin_slot_config_title(),
  description: m.admin_slot_config_description(),
});
