import React, { useCallback, useEffect, useRef } from 'react';
import type { ColumnEditorOptions } from 'primereact/column';
import type { DataTableRowEditCompleteEvent } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { slugify } from 'utils/string.utils';
import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../utils/translation-helpers';
import type { RegionLocale } from '@workspace/i18n';

// ============================================================================
// Types
// ============================================================================

interface TranslationItem {
  id: string;
  name: string;
  drinkTypeId?: string;
  [key: string]: any;
}

interface UseEditRowOptions {
  items: TranslationItem[];
  supportedLanguages: RegionLocale[];
  onItemChange: (itemId: string, fieldName: string, value: string) => void;
  /**
   * Optional: Function to get drink type name for compound name generation
   * If provided, names will be generated as: `${drinkTypeName}--${subtypeName}`
   * If not provided, names will be generated as: `${subtypeName}`
   */
  getDrinkTypeName?: (drinkTypeId: string) => string | undefined;
  /**
   * Optional: Function to find original data for a row
   * If not provided, will use items[index] pattern
   */
  findOriginalData?: (newData: TranslationItem) => TranslationItem | undefined;
  /**
   * Optional: Function to check if a row should be excluded from editing
   * (e.g., placeholder rows)
   */
  shouldExcludeRow?: (rowData: TranslationItem) => boolean;
  /**
   * Optional: Fields to exclude from row edit completion
   */
  excludeFields?: string[];
  /**
   * Optional: DataTable ref for programmatic row editing
   */
  dataTableRef?: React.RefObject<any>;
  /**
   * Optional: Track previous items length to detect new items
   */
  prevItemsLengthRef?: React.MutableRefObject<number>;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to handle row editing logic including:
 * - Text editors for language fields
 * - es-ES editor with debounced name updates
 * - Row edit completion handler
 * - Auto-focus on new rows
 */
export const useEditRow = ({
  items,
  supportedLanguages,
  onItemChange,
  getDrinkTypeName,
  findOriginalData,
  shouldExcludeRow,
  excludeFields = ['id'],
  dataTableRef,
  prevItemsLengthRef,
}: UseEditRowOptions) => {
  // Find es-ES language field name
  const esESFieldName = supportedLanguages.find((lang) => lang === 'es-ES')
    ? getLanguageFieldName('es-ES')
    : null;

  // Track previous es-ES values to detect changes
  const prevEsESValuesRef = useRef<Map<string, string>>(new Map());

  // Internal ref for tracking previous items length if not provided
  const internalPrevItemsLengthRef = useRef<number>(items.length);
  const itemsLengthRef = prevItemsLengthRef || internalPrevItemsLengthRef;

  // Debounced function to update name field from es-ES translation
  const debouncedUpdateName = useDebouncedCallback(
    (itemId: string, esESValue: string, drinkTypeId?: string) => {
      if (!esESValue || !esESValue.trim()) return;

      const slugifiedName = slugify(esESValue);
      if (!slugifiedName) return;

      // Generate compound name if getDrinkTypeName is provided
      if (getDrinkTypeName && drinkTypeId) {
        const drinkTypeName = getDrinkTypeName(drinkTypeId) || '';
        const compoundName = `${drinkTypeName}--${slugifiedName}`;
        onItemChange(itemId, 'name', compoundName);
      } else {
        // Simple name update
        onItemChange(itemId, 'name', slugifiedName);
      }
    },
    100, // 100ms debounce
  );

  // Initialize previous values on mount
  useEffect(() => {
    if (!esESFieldName) return;

    items.forEach((item) => {
      const currentEsESValue = item[esESFieldName] || '';
      if (!prevEsESValuesRef.current.has(item.id)) {
        prevEsESValuesRef.current.set(item.id, currentEsESValue);
      }
    });
  }, [items, esESFieldName]);

  // Watch for changes to es-ES translations and update name field (live with debounce)
  useEffect(() => {
    if (!esESFieldName) return;

    items.forEach((item) => {
      const currentEsESValue = item[esESFieldName] || '';
      const prevEsESValue = prevEsESValuesRef.current.get(item.id) || '';

      // If es-ES value changed, update the name field with debounce
      if (currentEsESValue !== prevEsESValue && currentEsESValue) {
        prevEsESValuesRef.current.set(item.id, currentEsESValue);
        debouncedUpdateName(item.id, currentEsESValue, item.drinkTypeId);
      }
    });
  }, [items, esESFieldName, debouncedUpdateName]);

  // Text editor for language fields
  const textEditor = useCallback((options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value || ''}
        onChange={(e) => options.editorCallback?.(e.target.value)}
        style={{ width: '100%' }}
      />
    );
  }, []);

  // Custom editor for es-ES field that also updates the name field live
  const esESEditor = useCallback(
    (options: ColumnEditorOptions) => {
      const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;
        options.editorCallback?.(newValue);

        // Update name field live with debounce when es-ES changes
        if (newValue && newValue.trim()) {
          const rowData = options.rowData as TranslationItem;
          if (rowData?.id) {
            debouncedUpdateName(rowData.id, newValue, rowData.drinkTypeId);
          }
        }
      };

      return (
        <InputText
          type="text"
          value={options.value || ''}
          onChange={handleChange}
          style={{ width: '100%' }}
        />
      );
    },
    [debouncedUpdateName],
  );

  // Handle row edit completion - this is called when user clicks save (checkmark)
  const onRowEditComplete = useCallback(
    (e: DataTableRowEditCompleteEvent) => {
      const { newData, index } = e;

      // Check if row should be excluded
      if (shouldExcludeRow && shouldExcludeRow(newData as TranslationItem)) {
        return;
      }

      // Find original data
      const originalData = findOriginalData ? findOriginalData(newData as TranslationItem) : items[index];

      if (!originalData) return;

      // Update all changed fields in the row
      Object.keys(newData).forEach((fieldName) => {
        if (!excludeFields.includes(fieldName) && newData[fieldName] !== originalData[fieldName]) {
          onItemChange(originalData.id, fieldName, newData[fieldName] || '');
        }
      });

      // Sync name field with es-ES translation if es-ES was changed
      if (esESFieldName && newData[esESFieldName] && newData[esESFieldName] !== originalData[esESFieldName]) {
        const esESValue = newData[esESFieldName] || '';
        if (esESValue.trim()) {
          const slugifiedName = slugify(esESValue);
          if (slugifiedName) {
            // Generate compound name if getDrinkTypeName is provided
            if (getDrinkTypeName && originalData.drinkTypeId) {
              const drinkTypeName = getDrinkTypeName(originalData.drinkTypeId) || '';
              const compoundName = `${drinkTypeName}--${slugifiedName}`;
              onItemChange(originalData.id, 'name', compoundName);
            } else {
              // Simple name update
              onItemChange(originalData.id, 'name', slugifiedName);
            }
            prevEsESValuesRef.current.set(originalData.id, esESValue);
          }
        }
      }
    },
    [items, onItemChange, esESFieldName, getDrinkTypeName, findOriginalData, shouldExcludeRow, excludeFields],
  );

  // Effect to start editing when a new row is added (detected by items length increase)
  useEffect(() => {
    if (!dataTableRef) return;

    const currentLength = items.length;
    const prevLength = itemsLengthRef.current;

    // If items increased, a new item was added
    if (currentLength > prevLength && dataTableRef.current) {
      const newItem = items[currentLength - 1]; // Last item is the new one

      if (newItem) {
        // Start editing the new row after a brief delay to ensure DOM is updated
        setTimeout(() => {
          try {
            const table = dataTableRef.current;
            if (table) {
              // PrimeReact API difference: initRowEdit is the supported method; startRowEdit may not exist
              if (typeof table.initRowEdit === 'function') {
                table.initRowEdit(newItem);
              } else if (typeof table.startRowEdit === 'function') {
                table.startRowEdit(newItem);
              }
            }

            // Focus the es-ES field after editor is rendered
            setTimeout(() => {
              if (esESFieldName) {
                // Find the es-ES input in the editing row
                const editingRow = document.querySelector('.p-datatable-tbody tr.p-row-editing');
                if (editingRow) {
                  // Find the es-ES column index
                  const esESIndex = supportedLanguages.findIndex((lang) => lang === 'es-ES');
                  if (esESIndex >= 0) {
                    // Name column is first (index 0), then language columns start at index 1
                    // +1 for name column, +1 for nth-child (1-based)
                    const cellIndex = 2 + esESIndex;
                    const esESCell = editingRow.querySelector(
                      `td:nth-child(${cellIndex}) .p-cell-editor input`,
                    );
                    if (esESCell) {
                      (esESCell as HTMLInputElement).focus();
                      (esESCell as HTMLInputElement).select();
                    }
                  }
                }
              }
            }, 200);
          } catch (error) {
            console.warn('Failed to start row edit programmatically:', error);
          }
        }, 100);
      }
    }

    // Update previous length
    itemsLengthRef.current = currentLength;
  }, [items, esESFieldName, supportedLanguages, dataTableRef, itemsLengthRef]);

  return {
    textEditor,
    esESEditor,
    onRowEditComplete,
    esESFieldName,
  };
};
