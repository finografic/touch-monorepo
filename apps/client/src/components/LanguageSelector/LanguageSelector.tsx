import { useTranslation } from 'react-i18next';
import type { LanguageSelectorProps, RegionLocale } from '@workspace/config/i18n';

import { RadioCards, Text } from '@radix-ui/themes';
import { Flex } from 'styled-system/jsx';
import clsx from 'clsx';

import { useAppConfig } from 'providers/AppConfigProvider';
import { LanguagesDto } from 'queries/supported-languages';

import { getFlagUrl } from 'utils/i18n/flag.utils';
import { styles } from './LanguageSelector.styles';

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage, theme, supportedLanguagesFull } = useAppConfig();

  // Transform full SupportedLanguage[] from context to LanguageInfo[] format
  const languages = supportedLanguagesFull
    ? LanguagesDto.fromApi(supportedLanguagesFull, (flagCode) => getFlagUrl(flagCode, 'medium')).filter(
        (language) => language.isActive,
      )
    : [];

  const isLoading = supportedLanguagesFull.length === 0;

  const handleLanguageChange = (languageCode: string) => {
    const regionLocale = languageCode as RegionLocale;

    console.log('%c __LANG__ LanguageSelector change', 'color:cyan', {
      selected: regionLocale,
      supportedLngs: i18n.options.supportedLngs
    });

    // Update context first
    setCurrentLanguage(regionLocale);

    // Change i18n language - now supports full locale codes from DB
    i18n.changeLanguage(regionLocale);

    // Call optional callback
    onLanguageChange?.(regionLocale);
  };

  // Find current language or default to first
  const getCurrentLanguageCode = () => {
    if (languages.length === 0) return 'es-ES'; // Full locale fallback
    const found = languages.find((lang) => lang.code.startsWith(currentLanguage));
    return found ? found.code : languages[0].code;
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="language-selector" css={styles}>
        <Text>Loading languages...</Text>
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="language-selector" css={styles}>
        <Text color="gray">No languages available</Text>
      </div>
    );
  }

  const currentLanguageCode = getCurrentLanguageCode();

  return (
    <div className="language-selector" css={styles}>
      <RadioCards.Root
        value={getCurrentLanguageCode()}
        onValueChange={handleLanguageChange}
        columns="1"
        size="2"
        color="blue"
      >
        {languages
          .filter((language) => language && language.code) // Filter out any malformed language objects
          .map((language) => (
            <RadioCards.Item
              key={language.code}
              value={language.code}
              className={clsx('language-radio', language.code === currentLanguageCode ? 'checked' : '')}
            >
              <Flex direction="column" width="100%">
                <Flex align="center" gap="4" mb="1">
                  <img
                    src={language.flag || ''}
                    alt={language.label || 'Language'}
                    width="40"
                    height="30"
                    style={{ borderRadius: '2px' }}
                  />
                  <Text weight="bold" size="4">
                    {language.code}
                    <span className="label-language"> - {language.nativeLabel || ''}</span>
                  </Text>
                </Flex>
              </Flex>
            </RadioCards.Item>
          ))}
      </RadioCards.Root>
    </div>
  );
};
