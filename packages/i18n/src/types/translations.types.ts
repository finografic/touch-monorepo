import { I18N_TRANSLATION_DOMAINS, DEFAULT_SUPPORTED_LANGUAGES } from 'constants/translations.constants';

export type I18nTranslationsDomain = (typeof I18N_TRANSLATION_DOMAINS)[number];
export type SupportedLanguage = (typeof DEFAULT_SUPPORTED_LANGUAGES)[number];
