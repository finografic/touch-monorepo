import React from 'react';
import { Switch } from '@workspace/design-system/forms';
import type { LanguageInfo } from '@workspace/i18n/types';
import { LockIcon, TrashIcon } from '@workspace/icons';

import clsx from 'clsx';
import { Flex } from 'styled-system/jsx';
import { card, dsSwitch } from 'styled-system/recipes';
import { Button } from 'components/Button';

import { useToggleSupportedLanguageActive } from 'queries/supported-languages';

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
    <Flex direction="column" gap={3} className="languages-list">
      {languages.map((language) => {
        const isDeletable = canDelete && canDeleteLanguage(language, languages.length);
        const isLoading = toggleActiveMutation.isPending;

        return (
          <div key={language.id || language.code} className={`${card()} language-item`}>
            <Flex className="language-item-row">
              <LanguageItem language={language} />

              <Flex align="stretch" gap={3}>
                {language.isDefault && (
                  <Flex align="center" className="col col-default">
                    <span
                      style={{
                        backgroundColor: 'var(--colors-success-xlight)',
                        padding: '2px 16px',
                        borderRadius: '4px',
                        border: '1px solid var(--colors-success-light)',
                      }}
                    >
                      DEFAULT
                    </span>
                  </Flex>
                )}

                <Flex className="col col-active">
                  <Switch.Root
                    checked={language.isActive ?? true}
                    disabled={language.isDefault || isLoading}
                    onCheckedChange={() => {
                      if (language.id && !language.isDefault) {
                        handleToggleActive(language.id, language.isActive ?? true);
                      }
                    }}
                  >
                    <Switch.Control className={dsSwitch({ size: 'md' })}>
                      <Switch.Thumb className="switch-thumb" />
                    </Switch.Control>
                    <Switch.HiddenInput />
                  </Switch.Root>
                </Flex>

                <Flex align="center" className="col col-delete">
                  <Button
                    className={clsx('button-delete', {
                      'is-disabled': !isDeletable,
                    })}
                    variant="soft"
                    color="danger"
                    onClick={() => onDeleteLanguage(language.code)}
                    disabled={!isDeletable}
                    size="sm"
                    title={
                      !isDeletable
                        ? language.isDefault
                          ? 'Cannot delete default language'
                          : 'Cannot delete when only one language remains'
                        : 'Delete language'
                    }
                  >
                    {isDeletable ? <TrashIcon /> : <LockIcon />}
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </div>
        );
      })}
    </Flex>
  );
};
