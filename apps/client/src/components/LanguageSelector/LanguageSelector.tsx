import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import type { LanguageSelectorProps, RegionLocale } from '@workspace/config/i18n';

import { RadioGroup } from '@finografic/design-system/forms';
import { Flex } from 'styled-system/jsx';
import clsx from 'clsx';

import { useAppConfig } from 'providers/AppConfigProvider';
import { LanguagesDto } from 'queries/supported-languages';

import { getFlagUrl } from 'utils/i18n/flag.utils';
import { styles } from './LanguageSelector.styles';

export const LanguageSelector = ({ onLanguageChange }: LanguageSelectorProps) => {
  const { i18n } = useTranslation();
  const { currentLanguage, setCurrentLanguage, supportedLanguagesFull } = useAppConfig();

  // Transform full SupportedLanguage[] from context to LanguageInfo[] format
  const languages = supportedLanguagesFull
    ? LanguagesDto.fromApi(supportedLanguagesFull, (flagCode) => getFlagUrl(flagCode, 'medium')).filter(
        (language) => language.isActive,
      )
    : [];

  const isLoading = supportedLanguagesFull.length === 0;

  // Find the full locale code matching current context language
  const resolveCode = () => {
    if (languages.length === 0) return 'es-ES';
    const found = languages.find((lang) => lang.code.startsWith(currentLanguage));
    return found ? found.code : languages[0].code;
  };

  // Local state gives immediate visual feedback before context propagates
  const [selectedCode, setSelectedCode] = useState(resolveCode);

  // Keep local state in sync when context language changes externally
  useEffect(() => {
    setSelectedCode(resolveCode());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentLanguage, languages.length]);

  const handleLanguageChange = (languageCode: string) => {
    const regionLocale = languageCode as RegionLocale;

    // Update local state immediately so the UI responds on first click
    setSelectedCode(languageCode);

    // Update context + i18n
    setCurrentLanguage(regionLocale);
    i18n.changeLanguage(regionLocale);
    onLanguageChange?.(regionLocale);
  };

  // Keep getCurrentLanguageCode for the checked className logic
  const getCurrentLanguageCode = () => selectedCode;

  // Handle loading and error states
  if (isLoading) {
    return (
      <div className="language-selector" css={styles}>
        <span>Loading languages...</span>
      </div>
    );
  }

  if (languages.length === 0) {
    return (
      <div className="language-selector" css={styles}>
        <span style={{ color: 'var(--colors-grey-default)' }}>No languages available</span>
      </div>
    );
  }

  const currentLanguageCode = getCurrentLanguageCode();

  return (
    <div className="language-selector" css={styles}>
      <RadioGroup.Root
        variant="card"
        value={selectedCode}
        onValueChange={({ value }) => handleLanguageChange(value)}
      >
        {languages
          .filter((language) => language && language.code) // Filter out any malformed language objects
          .map((language) => (
            <RadioGroup.Item
              key={language.code}
              value={language.code}
              className={clsx('language-radio', language.code === currentLanguageCode ? 'checked' : '')}
            >
              <RadioGroup.ItemHiddenInput />
              <Flex direction="column" width="100%">
                <Flex align="center" gap={4} mb={1}>
                  <img
                    src={language.flag || ''}
                    alt={language.label || 'Language'}
                    width="40"
                    height="30"
                    style={{ borderRadius: '2px' }}
                  />
                  <strong>
                    {language.code}
                    <span className="label-language"> - {language.nativeLabel || ''}</span>
                  </strong>
                </Flex>
              </Flex>
            </RadioGroup.Item>
          ))}
      </RadioGroup.Root>
    </div>
  );
};
