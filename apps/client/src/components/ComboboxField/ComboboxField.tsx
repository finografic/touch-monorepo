import React, { useEffect, useMemo, useState } from 'react';
import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';
import { ChevronDownIcon, ChevronUpIcon, PlusIcon } from '@radix-ui/react-icons';

interface ComboboxOption {
  value: string;
  label: string;
}

export interface ComboboxFieldProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: ComboboxOption[];
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  allowAddNew?: boolean;
  onAddNew?: (value: string) => void;
}

export const ComboboxField: React.FC<ComboboxFieldProps> = ({
  label,
  value,
  onChange,
  options,
  placeholder = 'Type to search or add new...',
  required = false,
  disabled = false,
  allowAddNew = true,
  onAddNew,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState(value);

  // Sync inputValue with value prop when it changes externally
  useEffect(() => {
    setInputValue(value);
  }, [value]);

  // Filter options based on input
  const filteredOptions = useMemo(() => {
    if (!inputValue) return options;

    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(inputValue.toLowerCase()) ||
        option.value.toLowerCase().includes(inputValue.toLowerCase()),
    );
  }, [options, inputValue]);

  // Check if current input matches any existing option
  const exactMatch = options.find(
    (option) =>
      option.value.toLowerCase() === inputValue.toLowerCase() ||
      option.label.toLowerCase() === inputValue.toLowerCase(),
  );

  const handleInputChange = (newValue: string) => {
    setInputValue(newValue);
    onChange(newValue);
    setIsOpen(newValue.length > 0);
  };

  const handleOptionSelect = (option: ComboboxOption) => {
    setInputValue(option.value);
    onChange(option.value);
    setIsOpen(false);
  };

  const handleAddNew = () => {
    if (inputValue.trim() && onAddNew) {
      onAddNew(inputValue.trim());
      setIsOpen(false);
    }
  };

  const handleInputFocus = () => {
    if (options.length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputBlur = () => {
    // Small delay to allow option selection
    setTimeout(() => {
      setIsOpen(false);
    }, 200);
  };

  return (
    <Box
      //  style={{ position: 'relative', minWidth: '180px' }}
      className="combobox-field"
    >
      <Text size="2" mb="2" weight="medium" className="field-label">
        {label} {required && '*'}
      </Text>

      <Flex align="center" gap="2">
        <Box style={{ position: 'relative', flex: 1 }}>
          <TextField.Root
            value={inputValue}
            onChange={(e) => handleInputChange(e.target.value)}
            onFocus={handleInputFocus}
            onBlur={handleInputBlur}
            placeholder={placeholder}
            disabled={disabled}
            style={{ width: '100%' }}
          />

          {/* Dropdown Button */}
          <Button
            variant="ghost"
            size="1"
            onClick={() => setIsOpen(!isOpen)}
            disabled={disabled}
            style={{
              position: 'absolute',
              right: '4px',
              top: '50%',
              transform: 'translateY(-50%)',
              padding: '2px',
            }}
          >
            {isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
          </Button>

          {/* Dropdown Options */}
          {isOpen && (
            <Card
              style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                zIndex: 1000,
                maxHeight: '200px',
                overflowY: 'auto',
                marginTop: '2px',
                padding: '4px',
              }}
            >
              {filteredOptions.length > 0 ? (
                filteredOptions.map((option) => (
                  <Button
                    key={option.value}
                    variant="ghost"
                    size="1"
                    onClick={() => handleOptionSelect(option)}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    {option.label}
                  </Button>
                ))
              ) : (
                <Text size="1" color="gray" style={{ padding: '8px' }}>
                  No options found
                </Text>
              )}

              {/* Add New Option */}
              {allowAddNew && inputValue.trim() && !exactMatch && (
                <>
                  <Box style={{ height: '1px', backgroundColor: 'var(--gray-6)', margin: '4px 0' }} />
                  <Button
                    variant="ghost"
                    size="1"
                    onClick={handleAddNew}
                    style={{
                      width: '100%',
                      justifyContent: 'flex-start',
                      padding: '8px',
                      color: 'var(--blue-11)',
                    }}
                  >
                    <PlusIcon style={{ marginRight: '4px' }} />
                    Add "{inputValue}"
                  </Button>
                </>
              )}
            </Card>
          )}
        </Box>
      </Flex>
    </Box>
  );
};
