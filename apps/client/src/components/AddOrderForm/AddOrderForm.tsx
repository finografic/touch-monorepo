import React, { useState } from 'react';
import { Box, Button, Card, Flex, Text, TextField } from '@radix-ui/themes';

interface FormState {
  drinkType: string;
  drinkSubtype: string;
  volume: string;
  containerType: string;
}

interface AddOrderFormProps {
  onSubmit: (formData: FormState) => void;
  isLoading?: boolean;
}

export const AddOrderForm: React.FC<AddOrderFormProps> = ({ onSubmit, isLoading = false }) => {
  const [formState, setFormState] = useState<FormState>({
    drinkType: '',
    drinkSubtype: '',
    volume: '',
    containerType: '',
  });

  // Handle field changes
  const handleFieldChange = (field: keyof FormState, value: string) => {
    setFormState((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Handle form submission
  const handleSubmit = () => {
    if (formState.drinkType && formState.volume && formState.containerType) {
      onSubmit(formState);
      // Reset form
      setFormState({
        drinkType: '',
        drinkSubtype: '',
        volume: '',
        containerType: '',
      });
    }
  };

  // Check if form is valid
  const isFormValid = formState.drinkType && formState.volume && formState.containerType;

  return (
    <Card>
      <Box p="4">
        <Text size="3" weight="bold" mb="4">
          Add New Order Entry
        </Text>

        <Flex gap="4" align="end" wrap="wrap">
          {/* Drink Type */}
          <Box style={{ minWidth: '180px' }}>
            <Text size="2" mb="2" weight="medium">
              Drink Type *
            </Text>
            <TextField.Root
              value={formState.drinkType}
              onChange={(e) => handleFieldChange('drinkType', e.target.value)}
              placeholder="e.g., Coffee, Tea, Juice"
              style={{ width: '160px' }}
            />
          </Box>

          {/* Subtype */}
          <Box style={{ minWidth: '180px' }}>
            <Text size="2" mb="2" weight="medium">
              Subtype
            </Text>
            <TextField.Root
              value={formState.drinkSubtype}
              onChange={(e) => handleFieldChange('drinkSubtype', e.target.value)}
              placeholder="Optional"
              style={{ width: '160px' }}
            />
          </Box>

          {/* Volume */}
          <Box style={{ minWidth: '180px' }}>
            <Text size="2" mb="2" weight="medium">
              Volume *
            </Text>
            <TextField.Root
              value={formState.volume}
              onChange={(e) => handleFieldChange('volume', e.target.value)}
              placeholder="e.g., 250ml, 500ml, 1L"
              style={{ width: '160px' }}
            />
          </Box>

          {/* Container Type */}
          <Box style={{ minWidth: '180px' }}>
            <Text size="2" mb="2" weight="medium">
              Container *
            </Text>
            <TextField.Root
              value={formState.containerType}
              onChange={(e) => handleFieldChange('containerType', e.target.value)}
              placeholder="e.g., Cup, Bottle, Can"
              style={{ width: '160px' }}
            />
          </Box>

          {/* Submit Button */}
          <Button onClick={handleSubmit} disabled={!isFormValid || isLoading} loading={isLoading} size="2">
            Add Order
          </Button>
        </Flex>

        {/* Form validation feedback */}
        {!isFormValid && (
          <Text size="1" color="gray" mt="2">
            Please fill in Drink Type, Volume, and Container fields
          </Text>
        )}
      </Box>
    </Card>
  );
};
