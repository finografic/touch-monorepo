// Type definitions for translation keys to provide intellisense
// Manually defined for better performance and to avoid deep recursion

// Button translation keys - most commonly used
export type ButtonTranslationKey =
  | 'ui.buttons.save'
  | 'ui.buttons.cancel'
  | 'ui.buttons.edit'
  | 'ui.buttons.delete'
  | 'ui.buttons.view'
  | 'ui.buttons.back'
  | 'ui.buttons.next'
  | 'ui.buttons.previous'
  | 'ui.buttons.ok'
  | 'ui.buttons.close'
  | 'ui.buttons.submit'
  | 'ui.buttons.reset'
  | 'ui.buttons.update'
  | 'ui.buttons.add'
  | 'ui.buttons.remove'
  | 'ui.buttons.select'
  | 'ui.buttons.clear'
  | 'ui.buttons.all'
  | 'ui.buttons.start'
  | 'ui.buttons.programTime'
  | 'ui.buttons.programProduct'
  | 'ui.buttons.repeatSelection';

// Common UI translation keys
export type UITranslationKey =
  | ButtonTranslationKey
  | 'ui.states.loading'
  | 'ui.states.saving'
  | 'ui.states.saved'
  | 'ui.states.error'
  | 'ui.states.success'
  | 'ui.forms.labels.name'
  | 'ui.forms.placeholders.enterText'
  | 'ui.forms.placeholders.selectOption';

// App-specific translation keys
export type AppTranslationKey =
  | 'app.title'
  | 'app.tagline'
  | 'app.description'
  | 'pages.dashboard.title'
  | 'pages.orders.title'
  | 'pages.admin.title'
  | 'components.languageSelector.title'
  | 'components.languageSelector.change';

// General translation key type (union of all above)
export type TranslationKey = ButtonTranslationKey | UITranslationKey | AppTranslationKey;

// Export the main translation type for general use
export type { TranslationKey as default };
