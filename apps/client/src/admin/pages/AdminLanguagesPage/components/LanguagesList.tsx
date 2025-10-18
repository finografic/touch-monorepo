import React from 'react';

import { Card, Flex, IconButton, Switch, Text } from '@radix-ui/themes';
import type { LanguageInfo } from '@workspace/i18n/types';
import clsx from 'clsx';

import { useToggleSupportedLanguageActive } from 'queries/supported-languages';
import { LockIcon, TrashIcon } from 'styles/icons';
import { canDeleteLanguage } from 'utils/i18n/language.utils';
import { LanguageItem } from './LanguageItem';

interface LanguagesListProps {
  languages: LanguageInfo[];
  onDeleteLanguage: (languageCode: string) => void;
  canDelete: boolean;
}

export const LanguagesList: React.FC<LanguagesListProps> = ({ languages, onDeleteLanguage, canDelete }) => {
  const toggleActiveMutation = useToggleSupportedLanguageActive();

  const handleToggleActive = async (languageId: string, currentIsActive: boolean) => {
    try {
      await toggleActiveMutation.mutateAsync({
        id: languageId,
        isActive: !currentIsActive,
      });
    } catch (error) {
      console.error('Error toggling language active status:', error);
    }
  };

  return (
    <Flex direction="column" gap="3" className="languages-list">
      {languages.map((language) => {
        const isDeletable = canDelete && canDeleteLanguage(language, languages.length);
        const isLoading = toggleActiveMutation.isPending;

        return (
          <Card key={language.id || language.code} className="language-item">
            <Flex className="language-item-row">
              <LanguageItem language={language} />

              <Flex align="stretch" gap="3">
                {language.isDefault && (
                  <Flex align="center" className="col col-default">
                    {/* Default Badge */}

                    <Text
                      size="2"
                      color="green"
                      weight="bold"
                      style={{
                        backgroundColor: 'var(--green-3)',
                        padding: '2px 16px',
                        borderRadius: '4px',
                        border: '1px solid var(--green-6)',
                      }}
                    >
                      DEFAULT
                    </Text>
                  </Flex>
                )}

                {/* Active Toggle */}
                <Flex className="col col-active">
                  <Switch
                    checked={language.isActive ?? true}
                    color="green"
                    disabled={language.isDefault || isLoading}
                    onCheckedChange={() => {
                      if (language.id && !language.isDefault) {
                        handleToggleActive(language.id, language.isActive ?? true);
                      }
                    }}
                    size="2"
                  />
                </Flex>

                {/* Delete Button */}
                <Flex align="center" className="col col-delete">
                  <IconButton
                    className={clsx('delete-button', {
                      'is-disabled': !isDeletable,
                    })}
                    variant="soft"
                    color="red"
                    onClick={() => onDeleteLanguage(language.code)}
                    disabled={!isDeletable}
                    title={
                      !isDeletable
                        ? language.isDefault
                          ? 'Cannot delete default language'
                          : 'Cannot delete when only one language remains'
                        : 'Delete language'
                    }
                    size="2"
                  >
                    {isDeletable ? <TrashIcon /> : <LockIcon />}
                  </IconButton>
                </Flex>
              </Flex>
            </Flex>
          </Card>
        );
      })}
    </Flex>
  );
};
