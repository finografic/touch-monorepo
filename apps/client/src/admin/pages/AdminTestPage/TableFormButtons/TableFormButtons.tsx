import React from 'react';
import { useTranslation } from 'react-i18next';

import { Flex } from '@radix-ui/themes';
import { Button } from 'components/Button';

import { PlusIcon } from 'styles/icons';
import { styles } from './TableFormButtons.styles';

// ============================================================================
// Types
// ============================================================================

export interface TableFormButtonsProps {
  onReset?: () => void;
  onSave?: () => void | Promise<void>;
  onAddNew?: () => void;
  isDirty?: boolean;
}

// ============================================================================
// Component
// ============================================================================

export const TableFormButtons: React.FC<TableFormButtonsProps> = ({
  onReset,
  onSave,
  onAddNew,
  isDirty = false,
}) => {
  const { t } = useTranslation();

  return (
    <Flex
      css={styles}
      // gap="2"
      className="table-form-buttons"
    >
      {onReset && (
        <Button type="button" variant="outline" color="grey" onClick={onReset} disabled={!isDirty} size="md">
          {t('ui.buttons.cancel')}
        </Button>
      )}
      {onSave && (
        <Button type="button" variant="solid" color="success" onClick={onSave} disabled={!isDirty} size="md">
          {t('ui.buttons.save')}
        </Button>
      )}
      {onAddNew && (
        <Button
          type="button"
          variant="solid"
          color="info"
          onClick={onAddNew}
          size="md"
          aria-label={t('ui.buttons.addNew') || 'Add new translation entry'}
          title={t('ui.buttons.addNew') || 'Add new translation entry'}
          className="button-add-new"
        >
          <PlusIcon />
        </Button>
      )}
    </Flex>
  );
};
