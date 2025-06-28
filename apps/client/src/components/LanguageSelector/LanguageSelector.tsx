import { Flex, RadioCards, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { styles } from './LanguageSelector.styles';
import type { LanguageSelectorProps, RegionLocale } from '@workspace/types';
import { useGetSupportedLanguages } from 'queries/supported-languages/useSupportedLanguages';
import { LanguagesDto } from 'queries/supported-languages';
import { getFlagUrl } from 'utils/flag.utils';

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage } = useContent();

  // Fetch supported languages from database
  const { data: supportedLanguagesData, isLoading, error } = useGetSupportedLanguages();
  const languages = supportedLanguagesData
    ? LanguagesDto.fromApi(supportedLanguagesData, (flagCode) => getFlagUrl(flagCode, 'medium'))
    : [];

  const handleLanguageChange = (languageCode: string) => {
    const regionLocale = languageCode as RegionLocale;
    // Map flag codes to i18n language codes
    const i18nCode = regionLocale.includes('-') ? regionLocale.split('-')[0] : regionLocale;

    // Update both context and i18n
    setCurrentLanguage(regionLocale);
    i18n.changeLanguage(i18nCode);

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

  if (error) {
    return (
      <div className="language-selector" css={styles}>
        <Text color="red">Error loading languages: {error.message}</Text>
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
            <RadioCards.Item key={language.code} value={language.code}>
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
