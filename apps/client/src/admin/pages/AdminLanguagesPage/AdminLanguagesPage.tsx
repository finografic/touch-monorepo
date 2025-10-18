import React, { useMemo, useState } from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';

// import type { LanguageInfo } from '@workspace/i18n/types';
import type { LanguageInfo } from '@config/i18n.config';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Box, Button, Callout, Flex, Text } from '@radix-ui/themes';
import { useQueryClient } from '@tanstack/react-query';
import { convertToLanguageOptions } from 'forms/SearchableLanguageInput/data/curated-languages';
import { SearchableLanguageInputCurated } from 'forms/SearchableLanguageInput/SearchableLanguageInputCurated';

import { SectionHeader } from 'components/SectionHeader/SectionHeader';

import {
  LanguagesDto,
  supportedLanguagesKeys,
  useCreateSupportedLanguage,
  useDeleteSupportedLanguage,
  useGetSupportedLanguages,
} from 'queries/supported-languages';
import { getFlagUrl } from 'utils/i18n/flag.utils';
import { AdminContentLayout, AdminSection } from '../..';
import { LanguageDeleteDialog } from './components/LanguageDeleteDialog';
import { LanguagesList, LanguagesListSelected, LaungaugeDataStats } from './components';
import { convertSearchResultToLanguageInfo } from './languages.utils';
import { styles } from './AdminLanguagesPage.styles';

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

export const AdminLanguagesPage: React.FC = () => {
  const { t } = useTranslation();

  const queryClient = useQueryClient();
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);
  const [selectedLanguages, setSelectedLanguages] = useState<LanguageInfo[]>([]);

  // Delete confirmation dialog state
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; language: LanguageInfo | null }>({
    isOpen: false,
    language: null,
  });

  // Fetch supported languages from database
  const { data: supportedLanguagesData, isLoading, error } = useGetSupportedLanguages();
  const createLanguageMutation = useCreateSupportedLanguage();
  const deleteLanguageMutation = useDeleteSupportedLanguage();

  // Convert database data to the unified LanguageInfo format using DTO
  const languages: LanguageInfo[] = supportedLanguagesData
    ? LanguagesDto.fromApi(
        Array.isArray(supportedLanguagesData) ? supportedLanguagesData : supportedLanguagesData.data || [],
        (flagCode) => getFlagUrl(flagCode, 'medium'),
      )
    : [];

  // Convert curated languages to the format expected by SearchableLanguageInput
  const { countries, curatedLanguageOptions } = useMemo(() => {
    const curatedLanguageOptions = convertToLanguageOptions((countryCode) =>
      getFlagUrl(countryCode, 'medium'),
    );

    const availableOptions = curatedLanguageOptions.filter(
      (option: LanguageOption) =>
        !(languages.map((lang) => lang.code) as string[]).includes(option.languageCode),
    );

    const countries = [...new Set(availableOptions.map((option: LanguageOption) => option.countryCode))];
    return { countries, curatedLanguageOptions: availableOptions };
  }, [languages]);

  const handleDeleteLanguage = async (languageCode: string) => {
    // Find the language by code to get its details
    const languageToDelete = languages.find((lang) => lang.code === languageCode);

    if (!languageToDelete || !languageToDelete.id) {
      setMessage({ type: 'error', text: 'Unable to find language to delete.' });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    // Show confirmation dialog instead of immediately deleting
    setDeleteDialog({ isOpen: true, language: languageToDelete });
  };

  const handleConfirmDelete = async () => {
    const { language } = deleteDialog;

    if (!language || !language.id) {
      setMessage({ type: 'error', text: 'Unable to find language to delete.' });
      setDeleteDialog({ isOpen: false, language: null });
      setTimeout(() => setMessage(null), 3000);
      return;
    }

    try {
      setMessage({ type: 'success', text: 'Deleting language and removing translation columns...' });
      await deleteLanguageMutation.mutateAsync(language.id);

      queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
      setMessage({
        type: 'success',
        text: `Language "${language.label}" deleted successfully! Translation columns have been removed from all tables.`,
      });
      setTimeout(() => setMessage(null), 5000);
    } catch (error) {
      console.error('Error deleting language:', error);
      setMessage({
        type: 'error',
        text: `Failed to delete language: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setTimeout(() => setMessage(null), 5000);
    } finally {
      setDeleteDialog({ isOpen: false, language: null });
    }
  };

  const handleCancelDelete = () => {
    setDeleteDialog({ isOpen: false, language: null });
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
        text: `Successfully added ${selectedLanguages.length} language(s)! Translation columns created instantly. 🌐 Auto-translation is now running in the background - check the AdminTranslationsPage in a few minutes to see the results.`,
      });
      setTimeout(() => setMessage(null), 8000); // Longer timeout for longer message
    } catch (error) {
      console.error('Error saving languages:', error);
      setMessage({
        type: 'error',
        text: `Failed to save languages: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
      setTimeout(() => setMessage(null), 5000);
    }
  };

  // const handleRefreshCache = () => {
  //   queryClient.invalidateQueries({ queryKey: supportedLanguagesKeys.lists() });
  //   setMessage({ type: 'success', text: 'Cache refreshed! Data reloaded from database.' });
  //   setTimeout(() => setMessage(null), 3000);
  // };

  // Handle loading and error states
  if (isLoading) {
    return (
      <AdminContentLayout
        title={t('admin.pages.languages.title')}
        subtitle={t('admin.pages.languages.subtitle')}
        isLoading={true}
        css={styles}
      >
        <AdminSection>
          <Text>Loading supported languages...</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  if (error) {
    return (
      <AdminContentLayout
        title={t('admin.pages.languages.title')}
        subtitle={t('admin.pages.languages.subtitle')}
        error={error.message}
        css={styles}
      >
        <AdminSection>
          <Text color="red">Error loading supported languages: {error.message}</Text>
        </AdminSection>
      </AdminContentLayout>
    );
  }

  return (
    <AdminContentLayout
      title={t('admin.pages.languages.title')}
      subtitle={t('admin.pages.languages.subtitle')}
      css={styles}
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
          <SearchableLanguageInputCurated
            languageOptions={curatedLanguageOptions}
            onLanguageSelect={handleLanguageSelect}
            placeholder="Search curated languages (40 options)..."
            windowSize={40}
          />
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
          <Row align="center">
            <Col xs={12} md={8}>
              <LaungaugeDataStats
                selectedLanguages={selectedLanguages}
                totalCountries={countries.length}
                totalLanguages={curatedLanguageOptions.length}
              />
            </Col>
            <Col xs={12} md={4} style={{ textAlign: 'right' }}>
              <Button
                onClick={handleSaveLanguages}
                size="4"
                color="green"
                variant="solid"
                loading={createLanguageMutation.isPending}
                disabled={createLanguageMutation.isPending || selectedLanguages.length === 0}
              >
                {createLanguageMutation.isPending ? 'Adding languages...' : 'Confirm: Add new languages'}
              </Button>
            </Col>
          </Row>
        </Box>
      </AdminSection>

      {/* Delete Confirmation Dialog */}
      <LanguageDeleteDialog
        language={deleteDialog.language}
        isOpen={deleteDialog.isOpen}
        onClose={handleCancelDelete}
        onConfirm={handleConfirmDelete}
        isLoading={deleteLanguageMutation.isPending}
      />
    </AdminContentLayout>
  );
};
