import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex } from '@radix-ui/themes';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from 'components/Button';
import { styles } from './TableFormButtons.styles';
import { ChevronLeftIcon, ChevronRightIcon, EyeOffIcon, EyeOnIcon, PlusIcon } from 'styles/icons';

// ============================================================================
// Types
// ============================================================================

export interface TableFormButtonsProps {
  onReset?: () => void;
  onSave?: () => void | Promise<void>;
  onAddNew?: () => void;
  onToggleKeyColumn?: () => void;
  isDirty?: boolean;
  isAddNewDisabled?: boolean;
  isSaving?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const TableFormButtons: React.FC<TableFormButtonsProps> = ({
  onReset,
  onSave,
  onAddNew,
  onToggleKeyColumn,
  isDirty = false,
  isAddNewDisabled = false,
  isSaving = false,
}) => {
  const { t } = useTranslation();
  const debouncedAddNew = useDebouncedCallback(() => onAddNew?.(), 500, { leading: true, trailing: false });
  const [toggleButton, setToggleButton] = useState<boolean>(true);
  return (
    <Flex css={styles} className="table-form-buttons">
      {onToggleKeyColumn && (
        <Button
          className="button-toggle-key-column"
          type="button"
          variant="solid"
          color="grey"
          onClick={() => {
            onToggleKeyColumn?.();
            setToggleButton(!toggleButton);
          }}
          disabled={isAddNewDisabled || isSaving}
          size="md"
          aria-label={toggleButton ? 'Hide key column' : 'Show key column'}
          title={toggleButton ? 'Hide key column' : 'Show key column'}
        >
          {toggleButton ? <EyeOnIcon /> : <EyeOffIcon />}
        </Button>
      )}

      {onReset && (
        <Button
          type="button"
          variant="outline"
          color="grey"
          onClick={onReset}
          disabled={!isDirty || isSaving}
          size="md"
        >
          {t('ui.buttons.cancel')}
        </Button>
      )}

      {onSave && (
        <Button
          type="button"
          variant="solid"
          color="success"
          onClick={onSave}
          disabled={!isDirty || isSaving}
          size="md"
        >
          {isSaving ? 'Saving...' : t('ui.buttons.save')}
        </Button>
      )}

      {onAddNew && (
        <Button
          type="button"
          variant="solid"
          color="info"
          onClick={debouncedAddNew}
          disabled={isAddNewDisabled || isSaving}
          size="md"
          aria-label={t('ui.buttons.add') || 'Add new translation entry'}
          title={
            isAddNewDisabled
              ? 'Please fill the empty row before adding a new one'
              : t('ui.buttons.add') || 'Add new translation entry'
          }
          className="button-add-new"
        >
          <PlusIcon />
        </Button>
      )}
    </Flex>
  );
};
