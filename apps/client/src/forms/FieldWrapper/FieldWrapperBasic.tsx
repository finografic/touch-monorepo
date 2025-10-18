import React, { useEffect, useState } from 'react';

import type { FieldError } from 'react-hook-form';
import { useFormContext } from 'react-hook-form';

import { Box, Text } from '@radix-ui/themes';
import clsx from 'clsx';
import { useDebouncedCallback } from 'use-debounce';

import { Cross2Icon, ExclamationTriangleIcon } from 'styles/icons';

import { getFieldValidationState } from './field-wrapper.utils';

import { styles } from './FieldWrapper.styles';

interface FieldWrapperProps {
  name?: string; // Field name for RHF integration
  label?: string;
  hint?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  error?: FieldError; // Legacy prop - will be overridden by RHF state if name provided
}

export const FieldWrapperBasic: React.FC<FieldWrapperProps> = ({
  name,
  label,
  hint,
  required = false,
  children,
  className,
  error: externalError,
}) => {
  const fieldId = name || `field-${Math.random().toString(36).substring(2, 9)}`;

  return (
    <Box css={styles} className={clsx('field-wrapper', className)}>
      {label && (
        <label className="field-label" htmlFor={fieldId}>
          <span>
            {label} {required && '*'}
          </span>
          {hint && (
            <Text size="2" weight="medium">
              <span className="label-hint">{hint}</span>
            </Text>
          )}
        </label>
      )}

      <Box className="field-element">
        {/* Clone children to add id if it's an input */}
        {React.Children.map(children, (child) => {
          if (React.isValidElement(child)) {
            return React.cloneElement(child as React.ReactElement<any>, { id: fieldId });
          }
          return child;
        })}
      </Box>
    </Box>
  );
};
