import { Flex, RadioCards, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { flagAssets } from './flags/images';
import flagsData from './flags/flags.data.json';

interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

interface LanguageSelectorProps {
  onLanguageChange?: (languageCode: string) => void;
}

// Helper function to get flag data by ISO code
const getFlagDataByIso = (isoCode: string) => {
  return flagsData.find((flag) => flag.flags.png.includes(`/${isoCode.toLowerCase()}.png`));
};

// Language configuration mapping
const LANGUAGE_CONFIG = {
  'en-GB': { iso: 'gb', nativeKey: 'eng' },
  'es-ES': { iso: 'es', nativeKey: 'spa' },
  'cat-ES': { iso: 'cat', nativeKey: 'cat' },
} as const;

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentLanguage, changeLanguage } = useContent();

  // Generate languages from configuration
  const languages: Language[] = Object.entries(LANGUAGE_CONFIG).map(([langCode, config]) => {
    const flagData = getFlagDataByIso(config.iso);

    return {
      code: langCode,
      label: flagData?.name.common || langCode,
      nativeLabel: flagData?.name.nativeName?.[config.nativeKey]?.common || langCode,
      flag: flagAssets[langCode as keyof typeof flagAssets],
    };
  });

  const handleLanguageChange = (languageCode: string) => {
    // Map flag codes to i18n language codes
    const i18nCode = languageCode.includes('-') ? languageCode.split('-')[0] : languageCode;

    // Update both context and i18n
    changeLanguage(languageCode);
    i18n.changeLanguage(i18nCode);

    // Call optional callback
    onLanguageChange?.(languageCode);
  };

  // Find current language or default to first
  const getCurrentLanguageCode = () => {
    const found = languages.find((lang) => lang.code.startsWith(currentLanguage));
    return found ? found.code : languages[0].code;
  };

  return (
    <div className="language-selector">
      <RadioCards.Root
        value={getCurrentLanguageCode()}
        onValueChange={handleLanguageChange}
        columns="1"
        size="2"
        color="blue"
      >
        {languages.map((language) => (
          <RadioCards.Item key={language.code} value={language.code}>
            <Flex direction="column" width="100%">
              <Flex align="center" gap="2" mb="1">
                <img
                  src={language.flag}
                  alt={language.label}
                  width="24"
                  height="16"
                  style={{ borderRadius: '2px' }}
                />
                <Text weight="bold" size="3">
                  {language.code} - {language.label}
                </Text>
              </Flex>
              <Text size="2" color="gray">
                {language.nativeLabel}
              </Text>
            </Flex>
          </RadioCards.Item>
        ))}
      </RadioCards.Root>
    </div>
  );
};
