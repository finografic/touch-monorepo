import React, { useState } from 'react';
import { Box, Button, Callout, Flex, Text } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { AdminContentLayout, AdminSection, SectionHeader } from '../shared';
import { styles } from './AdminLanguagesPage.styles';
import { SearchableLanguageInput } from 'components/SearchableLanguageInput';
import languagesData from 'components/LanguageSelector/languages/languages.data.min.json';
import type { Country } from 'components/LanguageSelector/languages/country.types';
import { LanguagesList, LanguagesListSelected, LaungaugeDataStats } from './components';
import type { LanguageInfo } from 'types/language.types';
import { useQueryClient } from '@tanstack/react-query';
import { getFlagUrl } from 'utils/flag.utils';
import {
  LanguagesDto,
  supportedLanguagesKeys,
  useCreateSupportedLanguage,
  useDeleteSupportedLanguage,
  useGetSupportedLanguages,
} from 'queries/supported-languages';

// Interface for the search component results (matches LanguageOption from SearchableLanguageInput)
interface LanguageOption {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

// Utility function to convert search results to LanguageInfo
const convertSearchResultToLanguageInfo = (searchResult: LanguageOption): LanguageInfo => ({
  code: searchResult.languageCode as any, // Type assertion for flexible language codes
  label: searchResult.languageName,
  nativeLabel: searchResult.nativeName || searchResult.languageName,
  flag: searchResult.flagUrl,
  countryName: searchResult.countryName,
  countryCode: searchResult.countryCode,
  isActive: true, // New languages are active by default
  isDefault: false,
  sortOrder: 0,
});

export const AdminLanguagesPage: React.FC = () => {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  // Fetch supported languages from database
  const { data: supportedLanguagesData, isLoading, error } = useGetSupportedLanguages();
  const createLanguageMutation = useCreateSupportedLanguage();
  const deleteLanguageMutation = useDeleteSupportedLanguage();

  // Convert database data to the unified LanguageInfo format using DTO
  const languages: LanguageInfo[] = supportedLanguagesData
    ? LanguagesDto.fromApi(supportedLanguagesData, (flagCode) => getFlagUrl(flagCode, 'medium'))
    : [];

  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageInfo[]>([]);

  const handleDeleteLanguage = async (languageCode: string) => {
    // Find the language by code to get its ID
    const languageToDelete = languages.find((lang) => lang.code === languageCode);

    if (!languageToDelete || !languageToDelete.id) {
      setMessage({ type: 'error', text: 'Unable to find language to delete.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setMessage({ type: 'success', text: 'Deleting language...' });
      await deleteLanguageMutation.mutateAsync(languageToDelete.id);

      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
      setMessage({ type: 'success', text: 'Language deleted successfully!' });
      setTimeout(() => setMessage(null), 3000);
    } catch (error) {
      console.error('Error deleting language:', error);
      setMessage({
        type: 'error',
        text: `Failed to delete language: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleLanguageSelect = (searchResult: LanguageOption) => {
    // Convert search result to LanguageInfo
    const languageInfo = convertSearchResultToLanguageInfo(searchResult);

    // Check if language is already selected
    const isAlreadySelected = selectedLanguages.some(
      (selected) => selected.code === languageInfo.code && selected.countryCode === languageInfo.countryCode,
    );

    if (!isAlreadySelected) {
      setSelectedLanguages((prev) => [...prev, languageInfo]);
    }
  };

  const handleRemoveLanguage = (languageCode: string, countryCode?: string) => {
    setSelectedLanguages((prev) =>
      prev.filter((lang) => !(lang.code === languageCode && lang.countryCode === countryCode)),
    );
  };

  const handleSaveLanguages = async () => {
    if (selectedLanguages.length === 0) {
      setMessage({ type: 'error', text: 'No languages selected to save.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setMessage({ type: 'success', text: 'Saving languages...' });

      // Save each selected language
      for (const language of selectedLanguages) {
        const languageData = {
          isoCode: language.code,
          nativeName: language.nativeLabel,
          displayName: language.label,
          flagCode: language.countryCode?.toUpperCase() || null,
          isActive: true,
          sortOrder: 0,
        };

        console.log('Creating language:', languageData);
        await createLanguageMutation.mutateAsync(languageData);
      }

      // Clear selected languages and refresh data
      setSelectedLanguages([]);
      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });

      setMessage({
        type: 'success',
        text: `Successfully added ${selectedLanguages.length} language(s) with translation columns!`,
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Error saving languages:', error);
      setMessage({
        type: 'error',
        text: `Failed to save languages: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  const handleRefreshCache = () => {
    queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
    setMessage({ type: 'success', text: 'Cache refreshed! Data reloaded from database.' });
    setTimeout(() => setMessage(null), 3000);
  };

  // Handle loading and error states
  if (isLoading) {
    return (
      <section css={styles} id="admin-languages" className="admin-content-page">
        <AdminContentLayout
          title={t('admin.pages.languages.title')}
          subtitle={t('admin.pages.languages.subtitle')}
          isLoading={true}
        >
          <AdminSection>
            <Text>Loading supported languages...</Text>
          </AdminSection>
        </AdminContentLayout>
      </section>
    );
  }

  if (error) {
    return (
      <section css={styles} id="admin-languages" className="admin-content-page">
        <AdminContentLayout
          title={t('admin.pages.languages.title')}
          subtitle={t('admin.pages.languages.subtitle')}
          error={error.message}
        >
          <AdminSection>
            <Text color="red">Error loading supported languages: {error.message}</Text>
          </AdminSection>
        </AdminContentLayout>
      </section>
    );
  }

  return (
    <section css={styles} id="admin-languages" className="admin-content-page">
      <AdminContentLayout
        title={t('admin.pages.languages.title')}
        subtitle={t('admin.pages.languages.subtitle')}
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
            <Flex justify="between" align="center">
              <SectionHeader title={`Configured Languages (${languages.length})`} />
              {/* <Flex gap="2">
                {import.meta.env.MODE === 'development' && (
                  <Text size="1" color="gray" style={{ alignSelf: 'center' }}>
                    Dev Mode: Auto-refresh on mount/focus
                  </Text>
                )}
                <Button variant="soft" onClick={handleRefreshCache}>
                  🔄 Refresh Data
                </Button>
              </Flex> */}
            </Flex>
            <LanguagesList
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
              placeholder="Search languages with simple sliding window..."
              windowSize={40}
            />
            <LaungaugeDataStats selectedLanguages={selectedLanguages} />
          </Box>

          {/* Selected Languages Section */}
          <Box className="selected-section" mb="6">
            <LanguagesListSelected
              selectedLanguages={selectedLanguages}
              onRemoveLanguage={handleRemoveLanguage}
              isLoading={createLanguageMutation.isPending}
            />
          </Box>

          {/* Statistics Section with Save Button */}
          <Box className="stats-section" style={{ marginTop: '3rem' }}>
            <Flex justify="end" align="center" mb="3">
              {selectedLanguages.length > 0 && (
                <Button
                  onClick={handleSaveLanguages}
                  size="4"
                  color="green"
                  variant="solid"
                  loading={createLanguageMutation.isPending}
                  disabled={createLanguageMutation.isPending}
                >
                  {createLanguageMutation.isPending ? 'Adding languages...' : 'Confirm: Add new languages'}
                </Button>
              )}
            </Flex>
          </Box>
        </AdminSection>
      </AdminContentLayout>
    </section>
  );
};
