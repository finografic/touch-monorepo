import { useCallback } from 'react';
import type { UseFormReturn } from 'react-hook-form';
import type { MockDataHandlers } from '../OrdersForm/orders-form.utils';

interface UseOrdersFormDevToolsProps {
  methods: UseFormReturn<any>;
  mockDataHandlers: MockDataHandlers;
  formValues: any;
  onAddRow: () => void;
  canAddRow: boolean;
}

export const useOrdersFormDevTools = ({
  methods,
  mockDataHandlers,
  formValues,
  onAddRow,
  canAddRow,
}: UseOrdersFormDevToolsProps) => {
  // Mock partial form data
  const handleMockPartial = useCallback(() => {
    const formValues = mockDataHandlers.handleMockPartial();
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
    methods.trigger();
  }, [mockDataHandlers, methods]);

  // Mock two rows with data
  const handleMockTwoRows = useCallback(() => {
    const formValues = mockDataHandlers.handleMockTwoRows();
    methods.reset(formValues, {
      keepDirty: true,
      keepErrors: false,
      keepTouched: false,
      keepIsSubmitted: false,
      keepSubmitCount: false,
    });
    methods.trigger();
  }, [mockDataHandlers, methods]);

  // Mock all form fields
  const handleMockAll = useCallback(() => {
    mockDataHandlers.handleMockValues();
  }, [mockDataHandlers]);

  // Mock all table rows
  const handleMockAllRows = useCallback(() => {
    const currentRows = formValues.timeRows || [];
    currentRows.forEach((_: any, index: number) => {
      mockDataHandlers.generateRandomValuesForRow(index);
    });
  }, [formValues.timeRows, mockDataHandlers]);

  return {
    handleMockPartial,
    handleMockTwoRows,
    handleMockAll,
    handleMockAllRows,
    handleAddRow: onAddRow,
    canAddRow,
  };
};
