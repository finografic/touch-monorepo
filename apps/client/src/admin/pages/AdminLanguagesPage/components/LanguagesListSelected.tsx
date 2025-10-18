import React from 'react';
import { InfoCircledIcon } from '@radix-ui/react-icons';
import { Box, Callout, Card, Flex, Heading, IconButton } from '@radix-ui/themes';
import clsx from 'clsx';
import type { LanguageInfo } from '@workspace/i18n/types';

import { LanguageItem } from './LanguageItem';
import { TrashIcon } from 'styles/icons';

interface LanguagesListSelectedProps {
  selectedLanguages: LanguageInfo[];
  onRemoveLanguage: (languageCode: string, countryCode?: string) => void;
  isLoading?: boolean;
}

export const LanguagesListSelected: React.FC<LanguagesListSelectedProps> = ({
  selectedLanguages,
  onRemoveLanguage,
  isLoading = false,
}) => {
  return (
    <Box pt="2">
      {/* Header */}
      <Heading as="h2" weight="bold">
        <span style={{ color: selectedLanguages.length > 0 ? 'var(--green-11)' : 'var(--gray-12)' }}>
          Selected Languages ({selectedLanguages.length})
        </span>
      </Heading>

      {/* Content */}
      {selectedLanguages.length === 0 ? (
        <Box style={{ width: '100%' }}>
          <Callout.Root className="alert no-selection" color="blue" variant="surface">
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
        <Flex direction="column" gap="3" className="languages-list">
          {selectedLanguages.map((language) => (
            <Card key={language.id || `${language.code}-${language.countryCode}`} className="language-item">
              <Flex className="language-item-row">
                <LanguageItem language={language} />

                <Flex align="stretch" gap="3">
                  {/* Delete Button */}
                  <Flex align="center" className="col col-delete">
                    <IconButton
                      className={clsx('delete-button')}
                      variant="soft"
                      color="orange"
                      onClick={() => onRemoveLanguage(language.code, language.countryCode)}
                      disabled={isLoading}
                      title="Remove from selection"
                      size="2"
                    >
                      <TrashIcon />
                    </IconButton>
                  </Flex>
                </Flex>
              </Flex>
            </Card>
          ))}
        </Flex>
      )}
    </Box>
  );
};
