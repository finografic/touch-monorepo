import React, { memo } from 'react';
import { Button, Flex } from '@radix-ui/themes';
import { useTranslation } from 'react-i18next';

interface FormActionsProps {
  isSubmitting: boolean;
  onCancel: () => void;
}

export const FormActions: React.FC<FormActionsProps> = memo(({ isSubmitting, onCancel }) => {
  const { t } = useTranslation();

  return (
    <Flex gap="3" justify="end" className="form-actions">
      <Button type="button" variant="soft" color="gray" onClick={onCancel} disabled={isSubmitting}>
        {t('ui.buttons.cancel')}
      </Button>

      <Button type="submit" variant="solid" color="blue" disabled={isSubmitting} loading={isSubmitting}>
        {isSubmitting ? t('ui.buttons.saving') : t('ui.buttons.save')}
      </Button>
    </Flex>
  );
});
