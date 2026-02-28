import React from 'react';

import type { LanguageInfo } from '@workspace/i18n/types';
import { Dialog } from '@workspace/design-system/forms';
import { Flex } from 'styled-system/jsx';

import { Button } from 'components/Button';

interface LanguageDeleteDialogProps {
  language: LanguageInfo | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const LanguageDeleteDialog: React.FC<LanguageDeleteDialogProps> = ({
  language,
  isOpen,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!language) return null;

  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Backdrop />
      <Dialog.Positioner>
        <Dialog.Content size="sm" role="alertdialog">
          <Dialog.Header>
            <Dialog.Title>Delete Language</Dialog.Title>
            <Dialog.CloseTrigger asChild>
              <Button variant="ghost" size="sm" aria-label="Close dialog" disabled={isLoading} />
            </Dialog.CloseTrigger>
          </Dialog.Header>

          <Dialog.Body>
            <Dialog.Description className="ds-dialog__description--visible">
              Are you sure you want to delete <strong>{language.label}</strong> ({language.code})?
              <br /><br />
              This will:
              <br />• Remove the language from the supported languages list
              <br />• Delete all translation columns for this language from the database
              <br />• Permanently remove all translations for this language
              <br /><br />
              <span style={{ color: 'var(--colors-danger-dark)', fontWeight: 700 }}>
                This action cannot be undone.
              </span>
            </Dialog.Description>
          </Dialog.Body>

          <Dialog.Footer>
            <Flex gap={3} justify="end" width="100%">
              <Dialog.CloseTrigger asChild>
                <Button variant="outline" color="grey" disabled={isLoading}>
                  Cancel
                </Button>
              </Dialog.CloseTrigger>
              <Button
                variant="solid"
                color="danger"
                onClick={onConfirm}
                loading={isLoading}
                disabled={isLoading}
              >
                {isLoading ? 'Deleting…' : 'Delete Language'}
              </Button>
            </Flex>
          </Dialog.Footer>
        </Dialog.Content>
      </Dialog.Positioner>
    </Dialog.Root>
  );
};
