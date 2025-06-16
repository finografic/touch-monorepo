import React, { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { Box, Flex, Heading, Text, TextField } from '@radix-ui/themes';
import { TranslationSection } from './TranslationSection';

export const TranslationForm: React.FC = memo(() => {
  const {
    formState: { errors },
  } = useFormContext();

  return (
    <Flex direction="column" gap="6">
      <TranslationSection
        title="Drink Subtypes"
        description="Wine and beer subtypes (rubia, negra, tinto, blanco)"
        fieldName="drinkSubtypes"
        errors={errors.drinkSubtypes}
      />

      <TranslationSection
        title="Volumes"
        description="Container volumes (2L, 1.5L, 50cl, 33cl, etc.)"
        fieldName="volumes"
        errors={errors.volumes}
      />

      <TranslationSection
        title="Drink Types"
        description="Main drink categories (cerveza, vino, cava, licor, etc.)"
        fieldName="drinkTypes"
        errors={errors.drinkTypes}
      />

      <TranslationSection
        title="Container Types"
        description="Container materials (plastico, vidrio, metal)"
        fieldName="containerTypes"
        errors={errors.containerTypes}
      />
    </Flex>
  );
});
