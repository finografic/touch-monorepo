import React, { useState } from 'react';
import { Box, Callout, Flex, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AdminContentLayout, AdminSection, SectionHeader } from '../shared';
import { flagAssets } from 'components/LanguageSelector/languages/images';
import { getFlagDataByIso } from 'components/LanguageSelector/language-selector.utils';
import { LANGUAGE_CONFIG } from 'constants/language.constants';
import type { LanguageInfo, RegionLocale } from '@workspace/types';
import { styles } from './AdminLanguagesPage.styles';
import { SearchableLanguageInput } from 'components/SearchableLanguageInput';
import languagesData from 'components/LanguageSelector/languages/languages.data.min.json';
import type { Country } from 'components/LanguageSelector/languages/country.types';
import { ConfiguredLanguagesList, SelectedLanguagesList } from './components';

interface SelectedLanguage {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

export const AdminLanguagesPage: React.FC = () => {
  const { t } = useTranslation();

  // Generate initial languages from configuration
  const initialLanguages: LanguageInfo[] = Object.entries(LANGUAGE_CONFIG).map(([langCode, config]) => {
    const regionLocale = langCode as RegionLocale;
    const flagData = getFlagDataByIso(config.iso);

    return {
      code: regionLocale,
      label: flagData?.name.common || langCode,
      nativeLabel: flagData?.name.nativeName?.[config.nativeKey]?.common || langCode,
      flag: flagAssets[regionLocale as keyof typeof flagAssets],
    };
  });

  const [languages, setLanguages] = useState<LanguageInfo[]>(initialLanguages);
  const [newLanguageCode, setNewLanguageCode] = useState('');
  const [newLanguageLabel, setNewLanguageLabel] = useState('');
  const [newLanguageNative, setNewLanguageNative] = useState('');
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<SelectedLanguage[]>([]);

  const handleAddLanguage = () => {
    if (!newLanguageCode || !newLanguageLabel || !newLanguageNative) return;

    // Check if language already exists
    if (languages.some((lang) => lang.code === newLanguageCode)) {
      setMessage({ type: 'error', text: 'Language code already exists!' });
      return;
    }

    const newLanguage: LanguageInfo = {
      code: newLanguageCode as RegionLocale,
      label: newLanguageLabel,
      nativeLabel: newLanguageNative,
      flag: flagAssets['en-US'], // Default flag for now
    };

    setLanguages((prev) => [...prev, newLanguage]);
    setMessage({ type: 'success', text: `Language "${newLanguageLabel}" added successfully!` });

    // Clear form
    setNewLanguageCode('');
    setNewLanguageLabel('');
    setNewLanguageNative('');

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleDeleteLanguage = (languageCode: string) => {
    if (languages.length <= 1) {
      setMessage({ type: 'error', text: 'Cannot delete the last language!' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    const languageToDelete = languages.find((lang) => lang.code === languageCode);
    setLanguages((prev) => prev.filter((lang) => lang.code !== languageCode));
    setMessage({ type: 'success', text: `Language "${languageToDelete?.label}" deleted successfully!` });

    // Clear message after 3 seconds
    setTimeout(() => setMessage(null), 3000);
  };

  const handleLanguageSelect = (language: SelectedLanguage) => {
    // Check if language is already selected
    const isAlreadySelected = selectedLanguages.some(
      (selected) =>
        selected.languageCode === language.languageCode && selected.countryCode === language.countryCode,
    );

    if (!isAlreadySelected) {
      setSelectedLanguages((prev) => [...prev, language]);
    }
  };

  const handleRemoveLanguage = (languageCode: string, countryCode: string) => {
    setSelectedLanguages((prev) =>
      prev.filter((lang) => !(lang.languageCode === languageCode && lang.countryCode === countryCode)),
    );
  };

  const handleSaveLanguages = () => {
    // TODO: Implement save functionality
    console.log('Saving languages:', selectedLanguages);
  };

  return (
    <div css={styles}>
      <AdminContentLayout
        title={t('pages.admin.languages.title')}
        subtitle={t('pages.admin.languages.subtitle')}
      >
        <AdminSection>
          {/* Message Display */}
          {message && (
            <Callout.Root color={message.type === 'error' ? 'red' : 'green'} mb="4">
              <Callout.Icon>
                <InfoCircledIcon />
              </Callout.Icon>
              <Callout.Text>{message.text}</Callout.Text>
            </Callout.Root>
          )}

          {/* Languages List */}
          <Box className="languages-section" mb="6">
            <SectionHeader title={`Configured Languages (${languages.length})`} />
            <ConfiguredLanguagesList
              languages={languages}
              onDeleteLanguage={handleDeleteLanguage}
              canDelete={languages.length > 1}
            />
          </Box>

          {/* Search Section */}
          <Box className="search-section" mb="6">
            <SectionHeader
              title="Add New Language"
              description='Search by language name, country, or language code (e.g., "French", "Germany", "es-ES")'
            />
            <SearchableLanguageInput
              countriesData={languagesData as Country[]}
              onLanguageSelect={handleLanguageSelect}
              placeholder="Search languages, countries, or codes..."
            />
          </Box>

          {/* Selected Languages Section */}
          <Box className="selected-section" mb="6">
            <SelectedLanguagesList
              selectedLanguages={selectedLanguages}
              onRemoveLanguage={handleRemoveLanguage}
              onSaveLanguages={handleSaveLanguages}
            />
          </Box>

          {/* Statistics Section */}
          <Box className="stats-section" style={{ marginTop: '3rem' }}>
            <SectionHeader title="Dataset Statistics" />
            <Text size="3" style={{ lineHeight: '1.6' }}>
              <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
                {languagesData.length}
              </Text>{' '}
              <Text color="gray">Countries</Text>
              <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
              <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
                {languagesData.reduce(
                  (acc, country) => acc + (country.languages ? Object.keys(country.languages).length : 0),
                  0,
                )}
              </Text>{' '}
              <Text color="gray">Total Languages</Text>
              <Text style={{ margin: '0 2rem', color: 'var(--gray-6)' }}>•</Text>
              <Text weight="bold" style={{ color: 'var(--gray-12)' }}>
                {selectedLanguages.length}
              </Text>{' '}
              <Text color="gray">Selected</Text>
            </Text>
          </Box>
        </AdminSection>
      </AdminContentLayout>
    </div>
  );
};
