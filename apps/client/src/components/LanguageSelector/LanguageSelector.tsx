import { Flex, RadioCards, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { useContent } from 'providers/ContentProvider/ContentContext';
import { flagAssets } from './languages/images';
import { styles } from './LanguageSelector.styles';
import { getFlagDataByIso } from './language-selector.utils';
import { LANGUAGE_CONFIG } from 'constants/language.constants';
import type { LanguageInfo, LanguageSelectorProps, RegionLocale } from '@workspace/types';

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage } = useContent();

  // Generate languages from configuration
  const languages: LanguageInfo[] = Object.entries(LANGUAGE_CONFIG).map(([langCode, config]) => {
    const regionLocale = langCode as RegionLocale;
    const flagData = getFlagDataByIso(config.iso);

    return {
      code: regionLocale,
      label: flagData?.name.common || langCode,
      nativeLabel: flagData?.name.nativeName?.[config.nativeKey]?.common || langCode,
      flag: flagAssets[regionLocale as keyof typeof flagAssets],
    };
  });

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
    const found = languages.find((lang) => lang.code.startsWith(currentLanguage));
    return found ? found.code : languages[0].code;
  };

  return (
    <div className="language-selector" css={styles}>
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
                  width="32"
                  height="24"
                  style={{ borderRadius: '2px' }}
                />
                <Text weight="bold" size="3">
                  {language.code} <span style={{ opacity: 0.33 }}>- {language.nativeLabel}</span>
                </Text>
              </Flex>
              {/* <Text size="2" color="gray">
                {language.nativeLabel}
              </Text> */}
            </Flex>
          </RadioCards.Item>
        ))}
      </RadioCards.Root>
    </div>
  );
};
