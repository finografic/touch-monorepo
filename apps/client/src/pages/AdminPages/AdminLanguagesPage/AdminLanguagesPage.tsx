import React, { useState } from 'react';
import { Box, Button, Callout, Card, Flex, IconButton, Text, TextField } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';
import { InfoCircledIcon, PlusIcon, TrashIcon } from '@radix-ui/react-icons';
import { AdminContentLayout, AdminSection } from '../shared';
import { flagAssets } from 'components/LanguageSelector/flags/images';
import { getFlagDataByIso } from 'components/LanguageSelector/language-selector.utils';
import { LANGUAGE_CONFIG } from 'constants/language.constants';
import type { LanguageInfo, RegionLocale } from '@workspace/types';
import { styles } from './AdminLanguagesPage.styles';

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

          {/* Add New Language Form */}
          <Card className="add-language-form">
            <Flex direction="column" gap="4">
              <Text size="4" weight="bold">
                Add New Language
              </Text>

              <Flex gap="3" align="end">
                <Box style={{ flex: 1 }}>
                  <Text as="label" size="2" weight="medium">
                    Language Code
                  </Text>
                  <TextField.Root
                    placeholder="e.g., fr-FR, de-DE"
                    value={newLanguageCode}
                    onChange={(e) => setNewLanguageCode(e.target.value)}
                  />
                </Box>

                <Box style={{ flex: 1 }}>
                  <Text as="label" size="2" weight="medium">
                    English Label
                  </Text>
                  <TextField.Root
                    placeholder="e.g., French, German"
                    value={newLanguageLabel}
                    onChange={(e) => setNewLanguageLabel(e.target.value)}
                  />
                </Box>

                <Box style={{ flex: 1 }}>
                  <Text as="label" size="2" weight="medium">
                    Native Label
                  </Text>
                  <TextField.Root
                    placeholder="e.g., Français, Deutsch"
                    value={newLanguageNative}
                    onChange={(e) => setNewLanguageNative(e.target.value)}
                  />
                </Box>

                <Button
                  onClick={handleAddLanguage}
                  disabled={!newLanguageCode || !newLanguageLabel || !newLanguageNative}
                >
                  <PlusIcon /> Add
                </Button>
              </Flex>
            </Flex>
          </Card>

          {/* Languages List */}
          <Flex direction="column" gap="3" className="languages-list">
            <Text size="4" weight="bold">
              Configured Languages ({languages.length})
            </Text>

            {languages.map((language) => (
              <Card key={language.code} className="language-item">
                <Flex justify="between" align="center" p="3">
                  <Flex align="center" gap="3">
                    <img
                      src={language.flag}
                      alt={language.label}
                      width="32"
                      height="24"
                      style={{ borderRadius: '2px' }}
                    />
                    <Flex direction="column">
                      <Text weight="bold" size="3">
                        {language.code}
                      </Text>
                      <Text size="2" color="gray">
                        {language.label} - {language.nativeLabel}
                      </Text>
                    </Flex>
                  </Flex>

                  <Flex align="center" gap="2">
                    <IconButton
                      variant="soft"
                      color="red"
                      onClick={() => handleDeleteLanguage(language.code)}
                      disabled={languages.length <= 1}
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Card>
            ))}
          </Flex>
        </AdminSection>
      </AdminContentLayout>
    </div>
  );
};
