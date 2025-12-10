import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text } from '@radix-ui/themes';
import { PAGINATOR_NUM_ENTRIES as ADMIN_PAGINATOR_NUM_ENTRIES } from 'admin/config/admin.tables.config';
import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { Column } from 'primereact/column';
import type { DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { useOnClickOutside } from 'usehooks-ts';
import { useToast } from 'components/Toast';
import type { LanguageInfo } from 'types/models/supported-language.model';
import { useDirtyFields } from '../hooks/useDirtyFields';
import { useEditRow } from '../hooks/useEditRow';
import { useSaveHandler } from '../hooks/useSaveHandler';
import { TableFormButtons } from '../TableFormButtons/TableFormButtons';
import { getLanguageFieldName } from '../utils/translation-helpers';
import { EditIcon, TrashIcon } from 'styles/icons';
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
  onDelete?: (itemId: string) => void;
  onDeleteImmediate?: (itemId: string) => Promise<void>;
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
  onDelete,
  onDeleteImmediate,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { getHeader } = useTableHeaders();

  // Ref for DataTable to programmatically control row editing
  const dataTableRef = useRef<any>(null);
  const tableContainerRef = useRef<HTMLDivElement | null>(null);
  // Track previous items length to detect new items
  const prevItemsLengthRef = useRef<number>(items.length);

  // Use dirty fields hook
  const { isFieldDirty } = useDirtyFields({
    items,
    initialItems,
    excludeFields: ['id'],
  });

  // Use edit row hook
  const { textEditor, esESEditor, onRowEditComplete, esESFieldName } = useEditRow({
    items,
    supportedLanguages,
    onItemChange,
    dataTableRef,
    prevItemsLengthRef,
    excludeFields: ['id'],
  });

  // Use save handler hook
  const { handleSave } = useSaveHandler({
    onSave,
    errorMessage: 'Failed to save translations',
  });

  // Cancel row editing when clicking outside the table container
  useOnClickOutside(tableContainerRef, () => {
    log('CLICKED_OUTSIDE', 'red', dataTableRef.current);
    dataTableRef.current?.closeEditingRows?.();
  });

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleDelete = useCallback(
    async (itemId: string, itemName: string) => {
      // eslint-disable-next-line no-alert
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      );
      if (confirmDelete) {
        if (onDeleteImmediate) {
          await onDeleteImmediate(itemId);
        } else if (onDelete) {
          onDelete(itemId);
        }
      }
    },
    [onDelete, onDeleteImmediate],
  );

  const handleAddNew = useCallback(() => {
    if (!onAddNew) return;
    onAddNew();
  }, [onAddNew]);

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
    <section ref={tableContainerRef} css={styles} className="table-container">
      <Flex justify="between" align="center" mb="4" gap="2">
        <Flex />
        <TableFormButtons onReset={onReset} onSave={handleSave} onAddNew={handleAddNew} isDirty={isDirty} />
      </Flex>

      <DataTable
        ref={dataTableRef}
        value={items}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditComplete}
        emptyMessage="No translations found"
        className="product-translations-datatable"
        removableSort
        rowEditorInitIcon={<EditIcon />}
        {...getPaginatorProps(items.length)}
      >
        {/* Name column - read-only */}
        <Column
          field="name"
          filterPlaceholder="Search"
          style={{ minWidth: '150px' }}
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
              header={lang.isoCode}
              filterPlaceholder="Search"
              style={{ minWidth: '200px', maxWidth: '250px' }}
              body={bodyRenderers[fieldName]}
              editor={(options) => (isEsES ? esESEditor(options) : textEditor(options))}
            />
          );
        })}

        {/* Row editor column - PrimeReact built-in edit/save/cancel controls */}
        <Column rowEditor bodyStyle={{ textAlign: 'center' }} />

        {/* Actions column - delete button (LAST) */}
        <Column
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
