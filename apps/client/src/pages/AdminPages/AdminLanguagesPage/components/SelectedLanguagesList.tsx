import React from 'react';
import { Box, Button, Callout, Card, Flex, Heading, IconButton, Text } from '@radix-ui/themes';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { TrashIcon } from 'styles/icons';

interface SelectedLanguage {
  languageCode: string;
  languageName: string;
  countryName: string;
  countryCode: string;
  flagUrl: string;
  nativeName?: string;
  emoji?: string;
}

interface SelectedLanguagesListProps {
  selectedLanguages: SelectedLanguage[];
  onRemoveLanguage: (languageCode: string, countryCode: string) => void;
  onSaveLanguages: () => void;
  showSaveButton?: boolean;
}

export const SelectedLanguagesList: React.FC<SelectedLanguagesListProps> = ({
  selectedLanguages,
  onRemoveLanguage,
  onSaveLanguages,
  showSaveButton = true,
}) => {
  return (
    <Box>
      {/* Header with Save Button */}
      <Flex justify="between" align="center" mb="4">
        <Heading as="h2" size="5" weight="bold">
          Selected Languages ({selectedLanguages.length})
        </Heading>
        {showSaveButton && selectedLanguages.length > 0 && (
          <Button onClick={onSaveLanguages} size="3" color="green">
            Confirm: Add new languages
          </Button>
        )}
      </Flex>

      {/* Content */}
      {selectedLanguages.length === 0 ? (
        <Box style={{ width: '100%' }}>
          <Callout.Root
            className="alert no-selection"
            color="blue"
            variant="surface"
            style={{
              marginTop: '1rem',
              padding: '1.5rem',
              borderRadius: '8px',
              border: '1px solid var(--blue-6)',
              backgroundColor: 'var(--blue-2)',
              width: '100%',
              display: 'flex !important',
              alignItems: 'center',
              gap: '12px',
              flexWrap: 'nowrap',
            }}
          >
            <Callout.Icon style={{ fontSize: '24px', minWidth: '24px', flexShrink: 0 }}>
              <InfoCircledIcon width="24" height="24" />
            </Callout.Icon>
            <Callout.Text
              style={{
                color: 'var(--blue-11)',
                fontWeight: '500',
                flex: '1 1 auto',
                lineHeight: '1.5',
                minWidth: 0,
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              No languages selected yet. Use the search above to add languages.
            </Callout.Text>
          </Callout.Root>
        </Box>
      ) : (
        <Flex direction="column" gap="2" className="selected-languages-list">
          {selectedLanguages.map((language) => (
            <Card key={`${language.languageCode}-${language.countryCode}`} className="language-item">
              <Flex align="center" justify="between" p="3">
                <Flex align="center" gap="3">
                  <img
                    className="language-flag"
                    src={language.flagUrl}
                    alt={`${language.countryName} flag`}
                    width="32"
                    height="24"
                    style={{ borderRadius: '2px' }}
                  />
                  <Flex direction="column">
                    <Text weight="bold" size="3">
                      {language.languageName} - {language.languageCode}
                    </Text>

                    <Flex align="center" gap="2">
                      <Text size="2" color="gray">
                        {language.countryName}
                      </Text>
                      {language.nativeName && language.nativeName !== language.languageName && (
                        <>
                          <Text size="2" color="gray">
                            •
                          </Text>
                          <Text size="2" color="gray">
                            {language.nativeName}
                          </Text>
                        </>
                      )}
                    </Flex>
                  </Flex>
                </Flex>
                <Flex align="center" gap="2">
                  <IconButton
                    className="delete-button"
                    variant="soft"
                    color="orange"
                    onClick={() => onRemoveLanguage(language.languageCode, language.countryCode)}
                  >
                    <TrashIcon />
                  </IconButton>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Box>
  );
};
