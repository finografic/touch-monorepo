import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Flex, Text } from '@radix-ui/themes';
import { PAGINATOR_NUM_ENTRIES as ADMIN_PAGINATOR_NUM_ENTRIES } from 'admin/config/admin.tables.config';
import { FilterMatchMode } from 'primereact/api';
import type { ColumnEditorOptions } from 'primereact/column';
import { Column } from 'primereact/column';
import type {
  DataTableFilterMeta,
  DataTableProps,
  DataTableRowEditCompleteEvent,
} from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { InputText } from 'primereact/inputtext';
import { useDebouncedCallback } from 'use-debounce';
import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import { slugify } from 'utils/string.utils';
import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../../TranslationsProductPage/utils/translation-helpers';
import { TableFormButtons } from '../TableFormButtons/TableFormButtons';
import { PAGINATOR_NUM_ENTRIES } from './ProductTranslationsTable.config';
import { TrashIcon } from 'styles/icons';
import 'primereact/resources/primereact.min.css';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import { styles } from './ProductTranslationsTable.styles';

// ============================================================================
// Types
// ============================================================================

interface TranslationItem {
  id: string;
  name: string;
  [key: string]: any; // For language fields and other properties
}

export interface ProductTranslationsTableProps {
  sectionKey: string;
  items: TranslationItem[];
  initialItems?: TranslationItem[]; // Original items for dirty field detection
  supportedLanguages: LanguageInfo[];
  onItemChange: (itemId: string, fieldName: string, value: string) => void;
  onAddNew?: () => void;
  onSave?: () => Promise<any>;
  onReset?: () => void;
  isDirty?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

// Get paginator props - hide paginator if items count is <= threshold
const getPaginatorProps = (itemsCount: number) => {
  const shouldShowPaginator = itemsCount > ADMIN_PAGINATOR_NUM_ENTRIES;
  return {
    paginator: shouldShowPaginator,
    rows: ADMIN_PAGINATOR_NUM_ENTRIES,
    paginatorTemplate:
      'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
    currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
  } satisfies Partial<DataTableProps<any>>;
};

// ============================================================================
// Component
// ============================================================================

export const ProductTranslationsTable: React.FC<ProductTranslationsTableProps> = ({
  sectionKey,
  items,
  initialItems = [],
  supportedLanguages,
  onItemChange,
  onAddNew,
  onSave,
  onReset,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Ref for DataTable to programmatically control row editing
  const dataTableRef = useRef<any>(null);
  // Track previous items length to detect new items
  const prevItemsLengthRef = useRef<number>(items.length);

  // Find es-ES language field name
  const esESFieldName = useMemo(() => {
    const esESLang = supportedLanguages.find((lang) => lang.isoCode === 'es-ES');
    return esESLang ? getLanguageFieldName(esESLang.isoCode) : null;
  }, [supportedLanguages]);

  // Track previous es-ES values to detect changes
  const prevEsESValuesRef = useRef<Map<string, string>>(new Map());

  // Create a map of dirty fields: itemId -> Set of fieldNames that are dirty
  const dirtyFieldsMap = useMemo(() => {
    const dirtyMap = new Map<string, Set<string>>();

    if (initialItems.length === 0) return dirtyMap;

    // Create a map of initial items by id for quick lookup
    const initialItemsMap = new Map<string, TranslationItem>();
    initialItems.forEach((item) => {
      initialItemsMap.set(item.id, item);
    });

    // Compare current items with initial items
    items.forEach((currentItem) => {
      const initialItem = initialItemsMap.get(currentItem.id);
      if (!initialItem) {
        // New item - all fields are considered dirty
        const dirtyFields = new Set<string>();
        Object.keys(currentItem).forEach((key) => {
          if (key !== 'id') dirtyFields.add(key);
        });
        dirtyMap.set(currentItem.id, dirtyFields);
        return;
      }

      // Compare each field
      const dirtyFields = new Set<string>();
      Object.keys(currentItem).forEach((fieldName) => {
        if (fieldName === 'id') return;
        const currentValue = currentItem[fieldName] || '';
        const initialValue = initialItem[fieldName] || '';
        if (currentValue !== initialValue) {
          dirtyFields.add(fieldName);
        }
      });

      if (dirtyFields.size > 0) {
        dirtyMap.set(currentItem.id, dirtyFields);
      }
    });

    return dirtyMap;
  }, [items, initialItems]);

  // Helper function to check if a field is dirty
  const isFieldDirty = useCallback(
    (itemId: string, fieldName: string): boolean => {
      return dirtyFieldsMap.get(itemId)?.has(fieldName) ?? false;
    },
    [dirtyFieldsMap],
  );

  // Initialize filters for PrimeReact DataTable
  const [filters, setFilters] = useState<DataTableFilterMeta>(() => {
    const filterMeta: DataTableFilterMeta = {
      name: { value: null, matchMode: FilterMatchMode.CONTAINS },
    };
    supportedLanguages.forEach((lang) => {
      const fieldName = getLanguageFieldName(lang.isoCode);
      filterMeta[fieldName] = { value: null, matchMode: FilterMatchMode.CONTAINS };
    });
    return filterMeta;
  });

  // Debounced function to update name field from es-ES translation
  const debouncedUpdateName = useDebouncedCallback(
    (itemId: string, esESValue: string) => {
      if (!esESValue || !esESValue.trim()) return;

      const slugifiedName = slugify(esESValue);
      if (slugifiedName) {
        onItemChange(itemId, 'name', slugifiedName);
      }
    },
    100, // 500ms debounce
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
        debouncedUpdateName(item.id, currentEsESValue);
      }
    });
  }, [items, esESFieldName, debouncedUpdateName]);

  // ============================================================================
  // Editors
  // ============================================================================

  // Text editor for language fields
  const textEditor = (options: ColumnEditorOptions) => {
    return (
      <InputText
        type="text"
        value={options.value || ''}
        onChange={(e) => options.editorCallback?.(e.target.value)}
        style={{ width: '100%' }}
      />
    );
  };

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
            debouncedUpdateName(rowData.id, newValue);
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

  // ============================================================================
  // Handlers
  // ============================================================================

  // Handle row edit completion - this is called when user clicks save (checkmark)
  const onRowEditComplete = useCallback(
    (e: DataTableRowEditCompleteEvent) => {
      const { newData, index } = e;
      const originalData = items[index];

      if (!originalData) return;

      // Update all changed fields in the row
      Object.keys(newData).forEach((fieldName) => {
        if (fieldName !== 'id' && newData[fieldName] !== originalData[fieldName]) {
          onItemChange(originalData.id, fieldName, newData[fieldName] || '');
        }
      });

      // Sync name field with es-ES translation if es-ES was changed
      if (esESFieldName && newData[esESFieldName] && newData[esESFieldName] !== originalData[esESFieldName]) {
        const esESValue = newData[esESFieldName] || '';
        if (esESValue.trim()) {
          const slugifiedName = slugify(esESValue);
          if (slugifiedName) {
            // Update immediately (no debounce needed since user confirmed the edit)
            onItemChange(originalData.id, 'name', slugifiedName);
            prevEsESValuesRef.current.set(originalData.id, esESValue);
          }
        }
      }
    },
    [items, onItemChange, esESFieldName],
  );

  const handleDelete = useCallback(
    (itemId: string, itemName: string) => {
      // eslint-disable-next-line no-alert
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      );
      if (confirmDelete) {
        // TODO: Implement delete functionality
        toast({
          variant: 'info',
          message: 'Delete functionality not yet implemented',
        });
      }
    },
    [toast],
  );

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    try {
      await onSave();
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        variant: 'error',
        message: 'Failed to save translations',
      });
    }
  }, [onSave, toast]);

  const handleAddNew = useCallback(() => {
    if (!onAddNew) return;
    onAddNew();
  }, [onAddNew]);

  // Effect to start editing when a new row is added (detected by items length increase)
  useEffect(() => {
    const currentLength = items.length;
    const prevLength = prevItemsLengthRef.current;

    // If items increased, a new item was added
    if (currentLength > prevLength && dataTableRef.current) {
      const newItem = items[currentLength - 1]; // Last item is the new one

      if (newItem) {
        // Start editing the new row after a brief delay to ensure DOM is updated
        setTimeout(() => {
          try {
            if (dataTableRef.current) {
              dataTableRef.current.startRowEdit(newItem);
            }

            // Focus the es-ES field after editor is rendered
            setTimeout(() => {
              if (esESFieldName) {
                // Find the es-ES input in the editing row
                const editingRow = document.querySelector('.p-datatable-tbody tr.p-row-editing');
                if (editingRow) {
                  // Find the es-ES column index
                  const esESIndex = supportedLanguages.findIndex((lang) => lang.isoCode === 'es-ES');
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
    prevItemsLengthRef.current = currentLength;
  }, [items, esESFieldName, supportedLanguages]);

  // ============================================================================
  // Body Templates (Custom Cell Renderers)
  // ============================================================================

  const nameBodyTemplate = (rowData: TranslationItem) => {
    const isDirty = isFieldDirty(rowData.id, 'name');
    return (
      <Text size="2" weight="bold" className={isDirty ? 'td-name field-dirty' : 'td-name'}>
        {rowData.name}
      </Text>
    );
  };

  // Language field body template - just display the value with dirty styling
  const createLanguageBodyTemplate = (isoCode: string) => {
    const fieldName = getLanguageFieldName(isoCode);
    return (rowData: TranslationItem) => {
      const value = rowData[fieldName] || '';
      const isDirty = isFieldDirty(rowData.id, fieldName);
      return (
        <Text size="2" style={{ flex: 1 }} className={isDirty ? 'field-dirty' : ''}>
          {value || '-'}
        </Text>
      );
    };
  };

  const actionsBodyTemplate = (rowData: TranslationItem) => {
    return (
      <div className="action-buttons">
        <button
          className="button button-delete"
          onClick={() => handleDelete(rowData.id, rowData.name)}
          type="button"
          aria-label="Delete"
        >
          <TrashIcon className="icon-delete" />
        </button>
      </div>
    );
  };

  // Create body renderers for all languages
  const bodyRenderers = useMemo(() => {
    const renderers: Record<string, any> = {
      name: nameBodyTemplate,
      actions: actionsBodyTemplate,
    };

    supportedLanguages.forEach((lang) => {
      const fieldName = getLanguageFieldName(lang.isoCode);
      renderers[fieldName] = createLanguageBodyTemplate(lang.isoCode);
    });

    return renderers;
  }, [supportedLanguages, isFieldDirty]);

  return (
    <section css={styles} className="table-container">
      <Flex justify="between" align="center" mb="4" gap="2">
        <Text size="2" color="gray">
          {/* {items.length} {items.length === 1 ? 'item' : 'items'} */}
        </Text>
        <TableFormButtons onReset={onReset} onSave={handleSave} onAddNew={handleAddNew} isDirty={isDirty} />
      </Flex>

      <DataTable
        ref={dataTableRef}
        value={items}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditComplete}
        filters={filters}
        // filterDisplay="row"
        emptyMessage="No translations found"
        className="product-translations-datatable"
        // stripedRows
        removableSort
        {...getPaginatorProps(items.length)}
      >
        {/* Name column - read-only */}
        <Column
          field="name"
          header="db key"
          // sortable
          // filter
          filterPlaceholder="Search"
          style={{ minWidth: '250px', maxWidth: '300px' }}
          headerStyle={{ width: '250px' }}
          body={bodyRenderers.name}
        />

        {/* Language columns - editable */}
        {supportedLanguages.map((lang) => {
          const fieldName = getLanguageFieldName(lang.isoCode);
          const isEsES = lang.isoCode === 'es-ES';
          return (
            <Column
              key={fieldName}
              field={fieldName}
              header={`${lang.displayName} (${lang.isoCode})`}
              // sortable
              // filter
              filterPlaceholder="Search"
              style={{ minWidth: '150px', maxWidth: '200px' }}
              body={bodyRenderers[fieldName]}
              editor={(options) => (isEsES ? esESEditor(options) : textEditor(options))}
            />
          );
        })}

        {/* Row editor column - PrimeReact built-in edit/save/cancel controls */}
        <Column
          rowEditor
          headerStyle={{ width: '10%', minWidth: '8rem' }}
          bodyStyle={{ textAlign: 'center' }}
        />

        {/* Actions column - delete button (LAST) */}
        <Column
          header="Actions"
          sortable={false}
          filter={false}
          style={{ minWidth: '80px', maxWidth: '100px' }}
          headerStyle={{ width: '80px' }}
          body={bodyRenderers.actions}
        />
      </DataTable>
    </section>
  );
};
