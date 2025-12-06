import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Flex, Text } from '@radix-ui/themes';
import { PAGINATOR_NUM_ENTRIES as ADMIN_PAGINATOR_NUM_ENTRIES } from 'admin/config/admin.tables.config';
import { useTableHeaders } from 'admin/hooks/useTableHeaders';
import { Column } from 'primereact/column';
import type { DataTableProps, DataTableRowToggleEvent } from 'primereact/datatable';
import { DataTable } from 'primereact/datatable';
import { useToast } from 'components/Toast';
import { useGetDrinkTypes } from 'queries/drink-types';
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
  drinkTypeId?: string; // For subtypes
  [key: string]: any; // For language fields and other properties
}

export interface ProductTranslationsTableExpandableProps {
  sectionKey: string;
  items: TranslationItem[];
  initialItems?: TranslationItem[]; // Original items for dirty field detection
  supportedLanguages: LanguageInfo[];
  onItemChange: (itemId: string, fieldName: string, value: string) => void;
  onAddNew?: () => void;
  onSave?: () => Promise<any>;
  onReset?: () => void;
  onDelete?: (itemId: string) => void;
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

export const ProductTranslationsTableExpandable: React.FC<ProductTranslationsTableExpandableProps> = ({
  sectionKey,
  items,
  initialItems = [],
  supportedLanguages,
  onItemChange,
  onAddNew,
  onSave,
  onReset,
  onDelete,
  isDirty = false,
}) => {
  const { t } = useTranslation();
  const { toast } = useToast();
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const { getHeader } = useTableHeaders();

  // NEW: CURRENLTY OPENED ROW
  const expandedRowRef = useRef<string | null>(null);

  // Ref for DataTable to programmatically control row editing
  const dataTableRef = useRef<any>(null);

  // Track previous items length to detect new items
  const prevItemsLengthRef = useRef<number>(items.length);

  // Track expanded rows - PrimeReact expects an object where keys are group values (drink type names)
  // For rowGroupMode="subheader" with expandableRowGroups, expandedRows should be Record<string, boolean>
  // BUT: PrimeReact calls .some() during initial render, so we must start as [] (array)
  // It will become an object when rows are expanded (e.data from onRowToggle is always an object)
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean> | any[]>([]);

  // Create drink type map for quick lookup
  const drinkTypeMap = useMemo(() => {
    const map = new Map<string, string>();
    drinkTypes.forEach((dt) => {
      map.set(dt.id, dt.name);
    });
    return map;
  }, [drinkTypes]);

  // Function to get drink type name for compound name generation
  const getDrinkTypeName = useCallback(
    (drinkTypeId: string) => {
      return drinkTypeMap.get(drinkTypeId);
    },
    [drinkTypeMap],
  );

  // Add drinkTypeName field to each item for grouping
  // PrimeReact needs a field to group by - we'll use a computed field
  // IMPORTANT: Show ALL drink types as groups, not just those with existing subtypes
  const itemsWithGroupField = useMemo(() => {
    // Create a map of drinkTypeId -> subtypes for quick lookup
    const subtypesByDrinkType = new Map<string, TranslationItem[]>();
    items.forEach((item) => {
      if (item.drinkTypeId) {
        if (!subtypesByDrinkType.has(item.drinkTypeId)) {
          subtypesByDrinkType.set(item.drinkTypeId, []);
        }
        subtypesByDrinkType.get(item.drinkTypeId)!.push(item);
      }
    });

    // Separate existing items from new items (temp IDs) to preserve order
    const existingItems = items.filter((item) => item.drinkTypeId && !item.id.startsWith('temp-'));
    const newItems = items.filter((item) => item.drinkTypeId && item.id.startsWith('temp-'));

    // Process existing items with sorting
    const processedExisting = existingItems
      .map((item) => {
        const drinkTypeName = drinkTypeMap.get(item.drinkTypeId || '') || 'Unknown';
        return {
          ...item,
          _drinkTypeName: drinkTypeName, // Field for grouping (prefixed with _ to avoid conflicts)
          _drinkTypeId: item.drinkTypeId, // Store drinkTypeId for group header template
        };
      })
      .sort((a, b) => {
        // Sort by drink type name first, then by subtype name
        const typeCompare = a._drinkTypeName.localeCompare(b._drinkTypeName);
        if (typeCompare !== 0) return typeCompare;
        return a.name.localeCompare(b.name);
      });

    // Process new items (preserve their order, append to end)
    const processedNew = newItems.map((item) => {
      const drinkTypeName = drinkTypeMap.get(item.drinkTypeId || '') || 'Unknown';
      return {
        ...item,
        _drinkTypeName: drinkTypeName,
        _drinkTypeId: item.drinkTypeId,
      };
    });

    // Create placeholder rows for drink types that have no subtypes
    // This ensures ALL drink types appear as groups, even if empty
    // Placeholder rows are marked with _isPlaceholder flag and won't be saved
    const placeholderRows: Array<
      TranslationItem & { _drinkTypeName: string; _drinkTypeId: string; _isPlaceholder: boolean }
    > = [];
    drinkTypes.forEach((drinkType) => {
      const hasSubtypes = subtypesByDrinkType.has(drinkType.id);
      if (!hasSubtypes) {
        // Create a placeholder row for this drink type (no subtypes exist)
        placeholderRows.push({
          id: `_placeholder_${drinkType.id}`, // Special ID to identify placeholder rows (won't be saved)
          name: '', // Empty name
          drinkTypeId: drinkType.id,
          _drinkTypeName: drinkType.name,
          _drinkTypeId: drinkType.id,
          _isPlaceholder: true, // Flag to identify placeholder rows
        } as any);
      }
    });

    // Sort placeholder rows by drink type name
    placeholderRows.sort((a, b) => a._drinkTypeName.localeCompare(b._drinkTypeName));

    // Combine: placeholder rows + existing items + new items
    // Placeholder rows create groups for drink types with no subtypes
    // PrimeReact will group by _drinkTypeName, so placeholders will create empty groups
    return [...placeholderRows, ...processedExisting, ...processedNew];
  }, [items, drinkTypeMap, drinkTypes]);

  // Use dirty fields hook
  const { isFieldDirty } = useDirtyFields({
    items,
    initialItems,
    excludeFields: ['id', 'drinkTypeId'],
  });

  // Function to find original data from itemsWithGroupField
  const findOriginalData = useCallback(
    (newData: TranslationItem) => {
      return itemsWithGroupField.find((item) => item.id === newData.id);
    },
    [itemsWithGroupField],
  );

  // Function to check if a row should be excluded (placeholder rows)
  const shouldExcludeRow = useCallback((rowData: TranslationItem) => {
    return (rowData as any)._isPlaceholder || rowData.id.startsWith('_placeholder_');
  }, []);

  // Use edit row hook with compound name support
  const { textEditor, esESEditor, onRowEditComplete, esESFieldName } = useEditRow({
    items,
    supportedLanguages,
    onItemChange,
    getDrinkTypeName,
    findOriginalData,
    shouldExcludeRow,
    excludeFields: ['id', 'drinkTypeId', '_drinkTypeName', '_drinkTypeId'],
    dataTableRef,
    prevItemsLengthRef,
  });

  // Use save handler hook
  const { handleSave } = useSaveHandler({
    onSave,
    onSaveSuccess: () => {
      // Clear expandedRows after successful save
      setExpandedRows([]);
    },
    errorMessage: 'Failed to save translations',
  });

  // ============================================================================
  // Handlers
  // ============================================================================

  // Handle row expansion toggle
  // For rowGroupMode="subheader" with expandableRowGroups, e.data contains the updated expandedRows
  // Following PrimeReact example pattern: set expandedRows directly from e.data
  const onRowToggle = useCallback((e: DataTableRowToggleEvent) => {
    const clickedGroup = Object.values(e.data).find((row) => row.drinkTypeId);

    console.log('%c >>>', 'color:yellow', clickedGroup);

    setTimeout(() => {
      console.log('%c >>>', 'color:magenta', expandedRowRef.current);
      setExpandedRows(e.data);
    }, 50);
  }, []);

  const handleDelete = useCallback(
    (itemId: string, itemName: string) => {
      // eslint-disable-next-line no-alert
      const confirmDelete = window.confirm(
        `Are you sure you want to delete "${itemName}"? This action cannot be undone.`,
      );
      if (confirmDelete && onDelete) {
        onDelete(itemId);
      }
    },
    [onDelete],
  );

  const handleAddNew = useCallback(() => {
    if (!onAddNew) return;

    // If there's a currently opened group, ensure the new item will have the correct drinkTypeId
    // The parent's addNewItem will create the item, but we need to set drinkTypeId after creation
    // We'll handle this in the useEffect that detects new items
    if (!expandedRowRef.current) {
      toast({
        variant: 'warning',
        message: 'Please open a drink type group first',
        subText: 'Click on a drink type to expand it before adding a new subtype',
      });
      return;
    }

    onAddNew();
  }, [onAddNew, toast]);

  // Effect to handle new items for expandable table (sets drinkTypeId and adds to expandedRows)
  // Note: Auto-focus and row editing is handled by useEditRow hook
  useEffect(() => {
    const currentLength = items.length;
    const prevLength = prevItemsLengthRef.current;

    // If items increased, a new item was added
    if (currentLength > prevLength) {
      const newItem = items[currentLength - 1]; // Last item is the new one

      // If there's a currently opened group, set the new item's drinkTypeId to match it
      if (newItem && expandedRowRef.current && !newItem.drinkTypeId) {
        onItemChange(newItem.id, 'drinkTypeId', expandedRowRef.current);
        // Update the item locally for immediate UI update
        newItem.drinkTypeId = expandedRowRef.current;
      }

      if (newItem && newItem.drinkTypeId) {
        // Ensure the new item is added to expandedRows array so it appears in expandedFiltered
        setExpandedRows((prev) => {
          if (Array.isArray(prev)) {
            // Check if item already exists in the array
            const exists = prev.some((item) => item.id === newItem.id);
            if (!exists) {
              return [...prev, newItem];
            }
            return prev;
          }
          // If prev is not an array, convert to array with the new item
          return [newItem];
        });
      }
    }

    // Update previous length
    prevItemsLengthRef.current = currentLength;
  }, [items, onItemChange]);

  // ============================================================================
  // Body Templates (Custom Cell Renderers)
  // ============================================================================

  // Group header template (drink type name - shown when collapsed)
  // data can be either a subtype item or a placeholder row - both have _drinkTypeName and _drinkTypeId
  const rowGroupHeaderTemplate = (
    data: TranslationItem & { _drinkTypeName?: string; _drinkTypeId?: string },
  ) => {
    const drinkTypeName = data._drinkTypeName || 'Unknown';
    // Get drinkTypeId from either _drinkTypeId (placeholder) or drinkTypeId (subtype)
    const drinkTypeId = (data as any)._drinkTypeId || data.drinkTypeId;

    return (
      <Text size="3" weight="bold" className="rowgroup-header">
        {drinkTypeName}
      </Text>
    );
  };

  // Group footer template (optional - shows count) - hidden via CSS
  const rowGroupFooterTemplate = (
    data: TranslationItem & { _drinkTypeName?: string; _isPlaceholder?: boolean },
  ) => {
    const drinkTypeName = data._drinkTypeName || 'Unknown';
    // Count only actual subtypes (exclude placeholder rows)
    const count = itemsWithGroupField.filter(
      (item) => item._drinkTypeName === drinkTypeName && !(item as any)._isPlaceholder,
    ).length;
    return (
      <td colSpan={supportedLanguages.length + 3} style={{ paddingLeft: '1rem' }}>
        <Text size="2" color="gray">
          Total Subtypes: {count}
        </Text>
      </td>
    );
  };

  // Name body template for subtypes (used in nested table only)
  const nameBodyTemplate = (rowData: TranslationItem & { _isPlaceholder?: boolean }) => {
    // Hide placeholder rows - they're only used to create groups
    if ((rowData as any)._isPlaceholder) {
      return null;
    }

    const isDirty = isFieldDirty(rowData.id, 'name');
    // Extract just the subtype name from compound name (drinkType--subtype)
    const displayName = rowData.name.includes('--') ? rowData.name.split('--')[1] : rowData.name;
    return (
      <Text size="2" weight="bold" className={isDirty ? 'td-name field-dirty' : 'td-name'}>
        {displayName}
      </Text>
    );
  };

  // Language field body template - just display the value with dirty styling (used in nested table only)
  const createLanguageBodyTemplate = (isoCode: string) => {
    const fieldName = getLanguageFieldName(isoCode);
    return (rowData: TranslationItem & { _isPlaceholder?: boolean }) => {
      // Hide placeholder rows - they're only used to create groups
      if ((rowData as any)._isPlaceholder) {
        return null;
      }

      const value = rowData[fieldName] || '';
      const isDirty = isFieldDirty(rowData.id, fieldName);
      return (
        <Text size="2" style={{ flex: 1 }} className={isDirty ? 'field-dirty' : ''}>
          {value || '-'}
        </Text>
      );
    };
  };

  const actionsBodyTemplate = (rowData: TranslationItem & { _isPlaceholder?: boolean }) => {
    // Hide placeholder rows - they're only used to create groups
    if ((rowData as any)._isPlaceholder) {
      return null;
    }

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

  const expandedFiltered = useMemo(() => {
    if (!expandedRowRef.current) {
      return [];
    }

    // Filter itemsWithGroupField to only show items for the currently opened group
    // Exclude placeholder rows (they're only for creating groups, not for display)
    // This includes both existing items and newly added items
    const filtered = itemsWithGroupField.filter(
      (item) =>
        item.drinkTypeId === expandedRowRef.current &&
        !(item as any)._isPlaceholder &&
        !item.id.startsWith('_placeholder_'),
    );

    // Also include any items from expandedRows array that match (for newly added items not yet in itemsWithGroupField)
    // Append them to the END of the array
    if (expandedRows && Array.isArray(expandedRows)) {
      const fromExpandedRows = expandedRows.filter(
        (row) => row.drinkTypeId === expandedRowRef.current && !filtered.some((item) => item.id === row.id),
      );
      // Append new items to the END
      return [...filtered, ...fromExpandedRows];
    }

    return filtered;
  }, [expandedRows, itemsWithGroupField]);

  console.log('%c EXPANDED', 'color:grey', expandedRows);

  return (
    <section css={styles} className="table-container">
      <Flex justify="end" align="center" mb="4" gap="2">
        <TableFormButtons onReset={onReset} onSave={handleSave} onAddNew={handleAddNew} isDirty={isDirty} />
      </Flex>

      <DataTable
        ref={dataTableRef}
        value={itemsWithGroupField}
        rowGroupMode="subheader"
        groupRowsBy="_drinkTypeName"
        sortMode="single"
        sortField="_drinkTypeName"
        sortOrder={1}
        expandableRowGroups
        expandedRows={expandedFiltered}
        onRowToggle={(e) => onRowToggle(e)}
        onRowExpand={(e) => {
          // e.data can be a placeholder row or a subtype - get drinkTypeId from either
          const drinkTypeId = (e.data as any)._drinkTypeId || e.data.drinkTypeId;
          if (expandedRowRef.current !== drinkTypeId) {
            expandedRowRef.current = drinkTypeId;
          }
        }}
        onRowCollapse={(e) => {
          // e.data can be a placeholder row or a subtype - get drinkTypeId from either
          const drinkTypeId = (e.data as any)._drinkTypeId || e.data.drinkTypeId;
          if (expandedRowRef.current === drinkTypeId) {
            expandedRowRef.current = null;
          }
        }}
        rowGroupHeaderTemplate={rowGroupHeaderTemplate}
        rowGroupFooterTemplate={rowGroupFooterTemplate}
        editMode="row"
        dataKey="id"
        onRowEditComplete={onRowEditComplete}
        rowClassName={(rowData) => {
          // Add class to placeholder rows so they can be hidden with CSS
          if ((rowData as any)._isPlaceholder || rowData.id.startsWith('_placeholder_')) {
            return 'row-placeholder';
          }
          return '';
        }}
        emptyMessage="No subtypes found"
        className="product-translations-datatable"
        removableSort
        rowEditorInitIcon={<EditIcon />}
        {...getPaginatorProps(itemsWithGroupField.length)}
      >
        {/* Name column - read-only (shows subtype name, extracted from compound key) */}
        <Column
          field="name"
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
              header={lang.isoCode}
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
