import React from 'react';
import type { LanguageInfo } from '@workspace/i18n/types';

import clsx from 'clsx';
import { Box, Flex } from 'styled-system/jsx';
import { callout, card } from 'styled-system/recipes';
import { Button } from 'components/Button';

import { LanguageItem } from './LanguageItem';
import { InfoCircledIcon, TrashIcon } from '@workspace/icons';

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
    <Box pt={2}>
      {/* Header */}
      <h2>
        <span
          style={{ color: selectedLanguages.length > 0 ? 'var(--colors-success-dark)' : 'var(--colors-fg)' }}
        >
          Selected Languages ({selectedLanguages.length})
        </span>
      </h2>

      {/* Content */}
      {selectedLanguages.length === 0 ? (
        <Box style={{ width: '100%' }}>
          <div className={`${callout({ status: 'info' })} alert no-selection`} role="alert">
            <InfoCircledIcon width="24" height="24" />
            <span
              style={{
                color: 'var(--colors-info-dark)',
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
            </span>
          </div>
        </Box>
      ) : (
        <Flex direction="column" gap={3} className="languages-list">
          {selectedLanguages.map((language) => (
            <div
              key={language.id || `${language.code}-${language.countryCode}`}
              className={`${card()} language-item`}
            >
              <Flex className="language-item-row">
                <LanguageItem language={language} />

                <Flex align="stretch" gap={3}>
                  {/* Delete Button */}
                  <Flex align="center" className="col col-delete">
                    <Button
                      className={clsx('button-delete')}
                      variant="soft"
                      color="warning"
                      onClick={() => onRemoveLanguage(language.code, language.countryCode)}
                      disabled={isLoading}
                      title="Remove from selection"
                      size="sm"
                    >
                      <TrashIcon />
                    </Button>
                  </Flex>
                </Flex>
              </Flex>
            </div>
          ))}
        </Flex>
      )}
    </Box>
  );
};
