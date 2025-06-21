import React from 'react';
import { Card, Flex, IconButton, Text } from '@radix-ui/themes';
import { TrashIcon } from 'styles/icons';

interface Language {
  code: string;
  label: string;
  nativeLabel: string;
  flag: string;
}

interface ConfiguredLanguagesListProps {
  languages: Language[];
  onDeleteLanguage: (languageCode: string) => void;
  canDelete: boolean;
}

export const ConfiguredLanguagesList: React.FC<ConfiguredLanguagesListProps> = ({
  languages,
  onDeleteLanguage,
  canDelete,
}) => {
  return (
    <Flex direction="column" gap="3" className="languages-list">
      {languages.map((language) => (
        <Card key={language.code} className="language-item">
          <Flex justify="between" align="center" p="3">
            <Flex align="center" gap="3">
              <img
                className="language-flag"
                src={language.flag}
                alt={`${language.label} flag`}
                width="32"
                height="24"
                style={{ borderRadius: '2px' }}
              />

              <Flex direction="column">
                <Text weight="bold" size="3">
                  {language.label} - {language.code}
                </Text>
                <Text size="2" color="gray">
                  {language.label} - {language.nativeLabel}
                </Text>
              </Flex>
            </Flex>

            <Flex align="center" gap="2">
              <IconButton
                className="delete-button"
                variant="soft"
                color="red"
                onClick={() => onDeleteLanguage(language.code)}
                disabled={!canDelete}
              >
                <TrashIcon />
              </IconButton>
            </Flex>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};
