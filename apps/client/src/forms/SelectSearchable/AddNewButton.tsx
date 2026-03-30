import React from 'react';
import { AddIcon } from '@finografic/icons';

import { Button } from '@finografic/design-system/components';

interface SearchableSelectProps {
  handleAddNew: () => void;
  searchValue: string;
}

export const AddNewButton: React.FC<SearchableSelectProps> = ({ handleAddNew, searchValue }) => {
  return (
    <div className="add-new-option">
      <Button
        type="button"
        variant="ghost"
        size="sm"
        palette="success"
        onClick={handleAddNew}
        className="button-delete"
      >
        <AddIcon /> Añadir:
      </Button>
      <span className="new-option-label">
        <span className="new-option-value">{searchValue ? <>"{searchValue}"</> : <></>}</span>
      </span>
    </div>
  );
};
