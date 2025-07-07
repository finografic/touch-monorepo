import React, { useMemo, useState } from 'react';
import { matchSorter } from 'match-sorter';
import { Flex, Select, Text, TextField } from '@radix-ui/themes';
import { MagnifyingGlassIcon } from '@radix-ui/react-icons';
import type { Country } from '../../components/LanguageSelector/languages/country.types';
import translate from 'google-translate-api-x';

interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

export async function autoPopulateNewLanguage(
  newLanguageCode: string,
  sourceTranslations: Record<string, string>,
) {
  const translated: Record<string, string> = {};

  // Batch translate in chunks to avoid rate limits
  const entries = Object.entries(sourceTranslations);
  const chunkSize = 10;

  for (let i = 0; i < entries.length; i += chunkSize) {
    const chunk = entries.slice(i, i + chunkSize);

    const promises = chunk.map(async ([key, text]) => {
      try {
        const result = await translate(text, { to: newLanguageCode });
        return [key, result.text];
      } catch (error) {
        console.warn(`Translation failed for ${key}:`, error);
        return [key, text]; // Fallback to original text
      }
    });

    const results = await Promise.all(promises);
    results.forEach(([key, translatedText]) => {
      translated[key] = translatedText;
    });

    // Rate limiting delay
    await new Promise((resolve) => setTimeout(resolve, 1000));
  }

  return translated;
}

// ======================================================================== //

// NOTE:
/*
// Usage in your admin page
const handleAutoTranslate = async (newLanguageCode: string) => {
  setIsTranslating(true);

  try {
    // Get English translations as source
    const englishData = commonEn; // Your existing English translations

    // Auto-translate
    const translated = await autoPopulateNewLanguage(newLanguageCode, englishData);

    // Save to your translation files or database
    await saveTranslations(newLanguageCode, translated);

    setMessage({ type: 'success', text: `Auto-translated ${Object.keys(translated).length} fields!` });
  } catch (error) {
    setMessage({ type: 'error', text: 'Auto-translation failed' });
  } finally {
    setIsTranslating(false);
  }
};
*/
