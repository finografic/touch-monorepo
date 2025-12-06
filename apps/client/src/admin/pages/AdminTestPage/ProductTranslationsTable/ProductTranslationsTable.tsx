import React, { useCallback, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Button as RadixButton, Flex, Text } from '@radix-ui/themes';
import { FilterMatchMode } from 'primereact/api';
import { Column } from 'primereact/column';
import type { ColumnProps } from 'primereact/column';
import type { DataTableFilterMeta, DataTableProps } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';

import { Button } from 'components/Button';
import { useToast } from 'components/Toast';

import type { LanguageInfo } from 'types/models/supported-language.model';
import { getLanguageFieldName } from '../../TranslationsProductPage/utils/translation-helpers';
import { EditIcon, TrashIcon } from 'styles/icons';
import 'primereact/resources/themes/lara-light-cyan/theme.css';
import 'primereact/resources/primereact.min.css';
import { styles } from './ProductTranslationsTable.styles';
import { getProductTranslationsTableColumns, PAGINATOR_NUM_ENTRIES } from './ProductTranslationsTable.config';

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

  // State for editing - track which item and field is being edited
  const [editingCell, setEditingCell] = useState<{ itemId: string; fieldName: string } | null>(null);
  const [editValue, setEditValue] = useState<string>('');

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

  // ============================================================================
  // Handlers
  // ============================================================================

  const handleEditClick = useCallback((itemId: string, fieldName: string, currentValue: string) => {
    setEditingCell({ itemId, fieldName });
    setEditValue(currentValue || '');
  }, []);

  const handleEditSave = useCallback(() => {
    if (!editingCell) return;

    onItemChange(editingCell.itemId, editingCell.fieldName, editValue);
    setEditingCell(null);
    setEditValue('');
  }, [editingCell, editValue, onItemChange]);

  const handleEditCancel = useCallback(() => {
    setEditingCell(null);
    setEditValue('');
  }, []);

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

  const createLanguageBodyTemplate = (isoCode: string) => {
    const fieldName = getLanguageFieldName(isoCode);
    return (rowData: TranslationItem) => {
      const isEditing = editingCell?.itemId === rowData.id && editingCell?.fieldName === fieldName;
      const value = rowData[fieldName] || '';

      if (isEditing) {
        return (
          <Flex gap="2" align="center">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleEditSave();
                } else if (e.key === 'Escape') {
                  handleEditCancel();
                }
              }}
              autoFocus
              style={{
                padding: '0.25rem 0.5rem',
                border: '1px solid #ccc',
                borderRadius: '4px',
                fontSize: '0.875rem',
                width: '100%',
              }}
            />
            <RadixButton size="1" onClick={handleEditSave} variant="solid" color="green">
              ✓
            </RadixButton>
            <RadixButton size="1" onClick={handleEditCancel} variant="outline" color="gray">
              ✕
            </RadixButton>
          </Flex>
        );
      }

      return (
        <Flex gap="2" align="center" justify="between">
          <Text size="2" style={{ flex: 1 }}>
            {value || '-'}
          </Text>
          <RadixButton
            size="1"
            onClick={() => handleEditClick(rowData.id, fieldName, value)}
            variant="ghost"
            style={{ padding: '0.25rem' }}
          >
            <EditIcon style={{ width: '0.875rem', height: '0.875rem' }} />
          </RadixButton>
        </Flex>
      );
    };
  };

  const actionsBodyTemplate = (rowData: TranslationItem) => {
    return (
      <div className="action-buttons">
        <RadixButton
          className="button button-delete"
          onClick={() => handleDelete(rowData.id, rowData.name)}
          variant="ghost"
          size="4"
          color="red"
        >
          <TrashIcon className="icon-delete" />
        </RadixButton>
      </div>
    );
  };

  // Generate columns dynamically based on supported languages
  const tableColumns = useMemo(() => {
    return getProductTranslationsTableColumns(supportedLanguages);
  }, [supportedLanguages]);

  // Create body renderers for all languages
  const bodyRenderers = useMemo(() => {
    const renderers: Record<string, ColumnProps['body']> = {
      name: nameBodyTemplate,
      actions: actionsBodyTemplate,
    };

    supportedLanguages.forEach((lang) => {
      const fieldName = getLanguageFieldName(lang.isoCode);
      renderers[fieldName] = createLanguageBodyTemplate(lang.isoCode);
    });

    return renderers;
  }, [supportedLanguages, editingCell, editValue, handleEditSave, handleEditCancel, handleEditClick]);

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
              <Button type="button" variant="solid" color="success" onClick={handleSave} disabled={!isDirty} size="sm">
                {t('ui.buttons.save')}
              </Button>
            )}
          </Flex>
        )}
      </Flex>

      <DataTable
        value={items}
        dataKey="id"
        filters={filters}
        filterDisplay="row"
        emptyMessage="No translations found"
        className="product-translations-datatable"
        stripedRows
        removableSort
        {...PAGINATOR_PROPS}
      >
        {tableColumns.map((column) => (
          <Column
            key={column.field}
            field={column.field === 'actions' ? undefined : column.field}
            header={column.header}
            sortable={column.sortable !== undefined ? column.sortable : true}
            filter={column.filter !== undefined ? column.filter : true}
            filterPlaceholder={column.filterPlaceholder ?? 'Search'}
            style={column.style ?? { minWidth: '120px', maxWidth: '200px' }}
            headerStyle={column.headerStyle}
            body={bodyRenderers[column.field]}
          />
        ))}
      </DataTable>
    </section>
  );
};

