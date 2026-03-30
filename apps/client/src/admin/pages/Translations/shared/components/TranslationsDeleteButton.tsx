import React from 'react';

import { Button } from '@finografic/design-system/components';

import { TrashIcon } from '@finografic/icons';

interface TranslationsDeleteButtonProps {
  onDelete: () => void;
  isDeleting?: boolean;
}

/**
 * Shared component for delete button in translations tables
 * Used by both TranslationsPage and TranslationsProductPage
 */
export const TranslationsDeleteButton: React.FC<TranslationsDeleteButtonProps> = ({
  onDelete,
  isDeleting = false,
}) => {
  return (
    <Button
      className="button button-delete"
      aria-label="Delete"
      variant="ghost"
      size="md"
      palette="danger"
      onClick={onDelete}
      disabled={isDeleting}
    >
      <TrashIcon />
    </Button>
  );
};
