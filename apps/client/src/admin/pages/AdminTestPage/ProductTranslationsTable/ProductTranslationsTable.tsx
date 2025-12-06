import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { InputText } from 'primereact/inputtext';
import type { ColumnEditorOptions } from 'primereact/column';
import { Flex, Text } from '@radix-ui/themes';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import type { DataTableRowEditCompleteEvent } from 'primereact/datatable';
import type { DataTableFilterMeta, DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { useDebouncedCallback } from 'use-debounce';

import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../../TranslationsProductPage/utils/translation-helpers';
import { slugify } from 'utils/string.utils';
import { TrashIcon } from 'styles/icons';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import { styles } from './ProductTranslationsTable.styles';
import { PAGINATOR_NUM_ENTRIES } from './ProductTranslationsTable.config';

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
  supportedLanguages: LanguageInfo[];
  onItemChange: (itemId: string, fieldName: string, value: string) => void;
  onSave?: () => Promise<any>;
  onReset?: () => void;
  isDirty?: boolean;
}

// ============================================================================
// Constants
// ============================================================================

export const PAGINATOR_PROPS = {
  paginator: true,
  rows: PAGINATOR_NUM_ENTRIES,
  paginatorTemplate:
    'FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown',
  currentPageReportTemplate: 'Showing {first} to {last} of {totalRecords} entries',
} satisfies Partial<DataTableProps<any>>;

// ============================================================================
// Component
// ============================================================================

export const ProductTranslationsTable: React.FC<ProductTranslationsTableProps> = ({
  sectionKey,
  items,
  supportedLanguages,
  onItemChange,
  onSave,
  onReset,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();

  // Find es-ES language field name
  const esESFieldName = useMemo(() => {
    const esESLang = supportedLanguages.find((lang) => lang.isoCode === 'es-ES');
    return esESLang ? getLanguageFieldName(esESLang.isoCode) : null;
  }, [supportedLanguages]);

  // Track previous es-ES values to detect changes
  const prevEsESValuesRef = useRef<Map<string, string>>(new Map());

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

  // ============================================================================
  // Body Templates (Custom Cell Renderers)
  // ============================================================================

  const nameBodyTemplate = (rowData: TranslationItem) => {
    return (
      <Text size="2" weight="bold" className="td-name">
        {rowData.name}
      </Text>
    );
  };

  // Language field body template - just display the value
  const createLanguageBodyTemplate = (isoCode: string) => {
    const fieldName = getLanguageFieldName(isoCode);
    return (rowData: TranslationItem) => {
      const value = rowData[fieldName] || '';
      return (
        <Text size="2" style={{ flex: 1 }}>
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
  }, [supportedLanguages]);

  return (
    <section css={styles} className="table-container">
      <Flex justify="between" align="center" mb="4" gap="2">
        <Text size="2" color="gray">
          {items.length} {items.length === 1 ? 'item' : 'items'}
        </Text>
        {(onSave || onReset) && (
          <Flex gap="2">
            {onReset && (
              <Button
                type="button"
                variant="outline"
                color="warning"
                onClick={onReset}
                disabled={!isDirty}
                size="sm"
              >
                {t('ui.buttons.reset')}
              </Button>
            )}
            {onSave && (
              <Button
                type="button"
                variant="solid"
                color="success"
                onClick={handleSave}
                disabled={!isDirty}
                size="sm"
              >
                {t('ui.buttons.save')}
              </Button>
            )}
          </Flex>
        )}
      </Flex>

      <DataTable
        value={items}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditComplete}
        filters={filters}
        filterDisplay="row"
        emptyMessage="No translations found"
        className="product-translations-datatable"
        stripedRows
        removableSort
        {...PAGINATOR_PROPS}
      >
        {/* Name column - read-only */}
        <Column
          field="name"
          header="Name (Key)"
          sortable
          filter
          filterPlaceholder="Search"
          style={{ minWidth: '150px', maxWidth: '200px' }}
          headerStyle={{ width: '150px' }}
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
              sortable
              filter
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
