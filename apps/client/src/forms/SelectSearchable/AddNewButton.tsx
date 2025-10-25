import React from 'react';

import { Button } from 'components/Button';

import { AddIcon } from 'styles/icons';

interface SearchableSelectProps {
  handleAddNew: () => void;
  searchValue: string;
}

export const AddNewButton: React.FC<SearchableSelectProps> = ({ handleAddNew, searchValue }) => {
  return (
    <div className="add-new-option">
      <Button
        type="button"
        variant="outline"
        size="md"
        color="success"
        onClick={handleAddNew}
        className="delete-button"
      >
        <AddIcon /> Añadir:
      </Button>
      <span className="new-option-label">
        <span className="new-option-value">"{searchValue}"</span>
      </span>
    </div>
  );
};
