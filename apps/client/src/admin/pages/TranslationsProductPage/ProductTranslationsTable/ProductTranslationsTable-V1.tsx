import React, { useCallback, useMemo, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex } from '@radix-ui/themes';
import { PAGINATOR_NUM_ENTRIES as ADMIN_PAGINATOR_NUM_ENTRIES } from 'admin/config/admin.tables.config';
import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { Column } from 'primereact/column';
import type { DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
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
import { useOutsideRowEditCancel } from '../hooks/useOutsideRowEditCancel';
import { styles } from './ProductTranslationsTable.styles';
import { useLanguageBodyTemplates } from './useLanguageBodyTemplates';
import { useNameBodyTemplate } from './useNameBodyTemplate';

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

  // Revert a row to its initial values (for cancel)
  const handleRowEditCancel = useCallback(
    (event: any) => {
      const rowData = event?.data as TranslationItem | undefined;
      if (!rowData) return;

      const original = initialItems.find((item) => item.id === rowData.id);
      if (!original) return;

      // Restore name
      if (original.name !== rowData.name) {
        onItemChange(rowData.id, 'name', original.name);
      }

      // Restore language fields
      supportedLanguages.forEach((lang) => {
        const fieldName = getLanguageFieldName(lang.isoCode);
        const currentVal = (rowData as any)[fieldName] || '';
        const originalVal = (original as any)[fieldName] || '';
        if (currentVal !== originalVal) {
          onItemChange(rowData.id, fieldName, originalVal);
        }
      });
    },
    [initialItems, onItemChange, supportedLanguages],
  );

  // Cancel row editing when clicking outside the table
  useOutsideRowEditCancel(dataTableRef);

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
  const nameBodyTemplate = useNameBodyTemplate({ isFieldDirty });
  const languageTemplates = useLanguageBodyTemplates({
    isFieldDirty,
    supportedLanguages,
  });

  const bodyRenderers = useMemo(
    () => ({
      name: nameBodyTemplate,
      actions: actionsBodyTemplate,
      ...languageTemplates,
    }),
    [nameBodyTemplate, actionsBodyTemplate, languageTemplates],
  );

  return (
    <section css={styles} className="table-container">
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
        onRowEditCancel={handleRowEditCancel}
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
