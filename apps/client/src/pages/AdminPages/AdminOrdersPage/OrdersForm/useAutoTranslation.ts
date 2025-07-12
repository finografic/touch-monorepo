import { useState } from 'react';
import { useContent } from 'providers/ContentProvider/ContentContext';

// ============================================================================
// Types
// ============================================================================

interface AutoTranslationResult {
  [languageCode: string]: string;
}

interface AutoTranslationOptions {
  enabled?: boolean;
  sourceLanguage?: string;
  targetLanguages?: string[];
}

// ============================================================================
// Simple Translation Function
// ============================================================================

/**
 * Simple auto-translation function using libre translate or fallback
 * This is a basic implementation - in production you'd want to use a proper service
 */
const translateText = async (
  text: string,
  targetLanguage: string,
  sourceLanguage = 'en',
): Promise<string> => {
  // For demo purposes, we'll create some basic translations
  // In a real implementation, you'd call a translation API

  const basicTranslations: Record<string, Record<string, Record<string, string>>> = {
    en: {
      'es-ES': {
        Beer: 'Cerveza',
        Wine: 'Vino',
        Water: 'Agua',
        Coffee: 'Café',
        Tea: 'Té',
        Juice: 'Jugo',
        Soda: 'Refresco',
        Glass: 'Vidrio',
        Plastic: 'Plástico',
        Metal: 'Metal',
        Cup: 'Taza',
        Bottle: 'Botella',
        Can: 'Lata',
      },
      'ca-ES': {
        Beer: 'Cervesa',
        Wine: 'Vi',
        Water: 'Aigua',
        Coffee: 'Cafè',
        Tea: 'Te',
        Juice: 'Suc',
        Soda: 'Refresc',
        Glass: 'Vidre',
        Plastic: 'Plàstic',
        Metal: 'Metall',
        Cup: 'Tassa',
        Bottle: 'Ampolla',
        Can: 'Llauna',
      },
      'en-GB': {
        Beer: 'Beer',
        Wine: 'Wine',
        Water: 'Water',
        Coffee: 'Coffee',
        Tea: 'Tea',
        Juice: 'Juice',
        Soda: 'Soda',
        Glass: 'Glass',
        Plastic: 'Plastic',
        Metal: 'Metal',
        Cup: 'Cup',
        Bottle: 'Bottle',
        Can: 'Can',
      },
    },
  };

  // Extract base language codes
  const baseTarget = targetLanguage.split('-')[0];
  const baseSource = sourceLanguage.split('-')[0];

  // Try exact match first
  if (basicTranslations[baseSource]?.[targetLanguage]?.[text]) {
    return basicTranslations[baseSource][targetLanguage][text];
  }

  // Try base language match
  if (basicTranslations[baseSource]?.[`${baseTarget}-${baseTarget.toUpperCase()}`]?.[text]) {
    return basicTranslations[baseSource][`${baseTarget}-${baseTarget.toUpperCase()}`][text];
  }

  // Fallback to marked original text
  return `${text} [${targetLanguage}]`;
};

// ============================================================================
// Auto Translation Hook
// ============================================================================

export const useAutoTranslation = (options: AutoTranslationOptions = {}) => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [translations, setTranslations] = useState<AutoTranslationResult>({});
  const { currentLanguage } = useContent();

  const {
    enabled = false,
    sourceLanguage = currentLanguage,
    targetLanguages = ['en-GB', 'es-ES', 'ca-ES'], // Default supported languages
  } = options;

  /**
   * Auto-translate a text to all supported languages
   */
  const autoTranslate = async (
    text: string,
    customTargetLanguages?: string[],
  ): Promise<AutoTranslationResult> => {
    if (!enabled || !text.trim()) {
      return {};
    }

    setIsTranslating(true);
    const result: AutoTranslationResult = {};
    const langs = customTargetLanguages || targetLanguages;

    try {
      // Create translations for all target languages
      for (const targetLang of langs) {
        if (targetLang === sourceLanguage) {
          // Source language gets the original text
          result[targetLang] = text;
        } else {
          // Translate to target language
          result[targetLang] = await translateText(text, targetLang, sourceLanguage);
        }

        // Small delay to avoid overwhelming any translation service
        await new Promise((resolve) => setTimeout(resolve, 100));
      }

      setTranslations(result);
      return result;
    } catch (error) {
      console.error('Auto-translation failed:', error);
      // Return object with source language only on error
      return { [sourceLanguage]: text };
    } finally {
      setIsTranslating(false);
    }
  };

  /**
   * Create a translation object with current language filled and others empty
   * This is useful for form submissions where you want to fill one language
   * and leave others for manual translation later
   */
  const createTranslationTemplate = (text: string, fillCurrentLanguage = true): AutoTranslationResult => {
    const result: AutoTranslationResult = {};

    for (const lang of targetLanguages) {
      if (fillCurrentLanguage && lang === currentLanguage) {
        result[lang] = text;
      } else {
        result[lang] = '';
      }
    }

    return result;
  };

  /**
   * Auto-populate a translation template with translations
   */
  const populateTranslations = async (
    template: AutoTranslationResult,
    sourceText: string,
  ): Promise<AutoTranslationResult> => {
    if (!enabled) return template;

    const translated = await autoTranslate(sourceText);

    // Merge with template, preserving any existing values
    const result = { ...template };
    Object.keys(translated).forEach((lang) => {
      if (!result[lang] || result[lang] === '') {
        result[lang] = translated[lang];
      }
    });

    return result;
  };

  return {
    // State
    isTranslating,
    translations,
    enabled,

    // Actions
    autoTranslate,
    createTranslationTemplate,
    populateTranslations,

    // Utilities
    clearTranslations: () => setTranslations({}),
    setEnabled: (value: boolean) => (options.enabled = value),
  };
};

// ============================================================================
// Usage Examples
// ============================================================================

/**
 * Example usage in OrdersForm:
 *
 * const autoTranslation = useAutoTranslation({ enabled: true });
 *
 * // When creating a new drink type:
 * const handleCreateDrinkType = async (name: string) => {
 *   const translations = await autoTranslation.autoTranslate(name);
 *
 *   await createDrinkType.mutateAsync({
 *     name: slugify(name),
 *     translations: {
 *       'en-GB': '',
 *       'es-ES': '',
 *       'ca-ES': '',
 *       [currentLanguage]: name, // Original text
 *       ...translations, // Auto-translated versions
 *     },
 *     // ... other fields
 *   });
 * };
 *
 * // Or for form submission template:
 * const translations = autoTranslation.createTranslationTemplate(displayValue);
 * // This creates: { 'en-GB': '', 'es-ES': '', 'ca-ES': '', 'current-lang': displayValue }
 */
