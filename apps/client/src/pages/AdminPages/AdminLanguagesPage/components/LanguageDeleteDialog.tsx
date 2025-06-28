import React from 'react';
import { AlertDialog, Button, Flex, Text } from '@radix-ui/themes';
import type { LanguageInfo } from 'types/language.types';

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
    <AlertDialog.Root open={isOpen} onOpenChange={onClose}>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Delete Language</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to delete <strong>{language.label}</strong> ({language.code})?
          <br />
          <br />
          This will:
          <br />
          • Remove the language from the supported languages list
          <br />
          • Delete all translation columns for this language from the database
          <br />
          • Permanently remove all translations for this language
          <br />
          <br />
          <Text color="red" weight="bold">
            This action cannot be undone.
          </Text>
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray" disabled={isLoading}>
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button variant="solid" color="red" onClick={onConfirm} loading={isLoading} disabled={isLoading}>
              {isLoading ? 'Deleting...' : 'Delete Language'}
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};
