import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex, Text } from '@radix-ui/themes';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import createCuid from '@bugsnag/cuid';

// import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import { TableFormButtons } from '../../TranslationPages/components/TableFormButtons';
import { styles } from '../../TranslationPages/TranslationsTable.styles';
import { DEFAULT_SHOW_KEY_COLUMN_PRODUCT } from '../../TranslationPages/constants/translationsTable.constants';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useToast } from 'components/Toast/ToastContext';
import { useTranslationsTableForm } from './hooks/useTranslationsTableForm';
import { useTranslationsTableHandlers } from './hooks/useTranslationsTableHandlers';

import { ExpandedSubtypeRow } from './components/TranslationsRowExpanded';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type {
  GroupedSubtypes,
  TranslationsFormItem,
} from 'admin/pages/TranslationsProductPage/translationsProduct.types';
import { colors } from 'styles/colors/colors-direct';

import {
  COL_CHEVRON_WIDTH,
  COL_SLUG_WIDTH,
} from '../../TranslationPages/constants/translations-table.config';

interface TranslationsTableExpandableProps {
  sectionKey: string;
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
  onSave?: ({ items }: { items: TranslationsFormItem[] }) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string, drinkTypeId?: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

export const TranslationsTableExpandable: React.FC<TranslationsTableExpandableProps> = ({
  sectionKey,
  items,
  supportedLanguages,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
}) => {
  const { toast } = useToast();
  const { data: drinkTypes = [] } = useGetDrinkTypes();
  const [editingRowIndex, setEditingRowIndex] = useState<{ groupIndex: number; rowIndex: number } | null>(
    null,
  );
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  const [showKeyColumn, setShowKeyColumn] = useState<boolean>(DEFAULT_SHOW_KEY_COLUMN_PRODUCT);
  // TODO: TEMPORARY VALUE, BEFORE CONSOLIDATION -- CAN BE SHARED... LIFT VALUE TO PARENT ??
  const hasGrouping = true;

  // ======================================================================== //
  // Group Subtypes by Drink Type
  // ======================================================================== //

  const groupedSubtypes = useMemo<GroupedSubtypes[]>(() => {
    // Group existing subtypes by drinkTypeId
    const groupsMap = new Map<string, TranslationsFormItem[]>();
    items.forEach((item) => {
      const drinkTypeId = (item as any).drinkTypeId;
      if (drinkTypeId) {
        if (!groupsMap.has(drinkTypeId)) {
          groupsMap.set(drinkTypeId, []);
        }
        groupsMap.get(drinkTypeId)!.push(item);
      }
    });

    // Create groups for ALL drink types (even those with no subtypes)
    const groups: GroupedSubtypes[] = drinkTypes.map((dt) => ({
      drinkTypeId: dt.id,
      drinkTypeName: dt.name,
      subtypes: groupsMap.get(dt.id) || [],
    }));

    // Sort groups by drink type name
    groups.sort((a, b) => a.drinkTypeName.localeCompare(b.drinkTypeName));

    // Sort subtypes within each group by name
    groups.forEach((group) => {
      group.subtypes.sort((a, b) => a.name.localeCompare(b.name));
    });

    return groups;
  }, [items, drinkTypes]);

  // ======================================================================== //
  // Shared Form Logic
  // ======================================================================== //

  const {
    methods,
    fields,
    remove,
    append,
    watchedItems,
    languageKeys,
    hasEmptyRow,
    isDirtyLastItem,
    isItemEmpty,
  } = useTranslationsTableForm({ items, supportedLanguages });

  // Track initial items for DELETE detection
  const initialItemsRef = useRef<TranslationsFormItem[]>(items);
  useEffect(() => {
    initialItemsRef.current = items;
  }, [items]);

  // ======================================================================== //
  // Shared Handlers
  // ======================================================================== //

  const { handleDelete, handleSave, handleReset } = useTranslationsTableHandlers({
    methods,
    watchedItems,
    remove,
    languageKeys,
    isItemEmpty,
    onSave,
    onDelete,
    initialItemsRef,
  });

  // ======================================================================== //
  // Add New Handler (expandable-specific)
  // ======================================================================== //

  const handleAddNewRow = useDebouncedCallback(
    () => {
      if (hasEmptyRow) return;

      // Find the first expanded group (or use the first group if none expanded)
      const expandedGroupId =
        expandedGroups.size > 0 ? Array.from(expandedGroups)[0] : groupedSubtypes[0]?.drinkTypeId;

      if (!expandedGroupId) {
        toast({
          variant: 'warning',
          message: 'Please expand a drink type group first',
          subText: 'Click on a drink type to expand it before adding a new subtype',
        });
        return;
      }

      append({
        id: `temp-${createCuid()}`,
        name: '',
        drinkTypeId: expandedGroupId,
        ...Object.fromEntries(languageKeys.map((k) => [k, ''])),
      } as TranslationsFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  const toggleGroup = (drinkTypeId: string) => {
    setExpandedGroups((prev) => {
      const next = new Set(prev);
      if (next.has(drinkTypeId)) {
        next.delete(drinkTypeId);
      } else {
        // Close all other groups (only one open at a time)
        next.clear();
        next.add(drinkTypeId);
      }
      return next;
    });
  };

  // Check if any group is expanded (for ADD NEW button)
  const hasExpandedGroup = expandedGroups.size > 0;

  // ======================================================================== //
  // Render
  // ======================================================================== //

  return (
    <section css={styles} className="table-container">
      <FormProvider {...methods} formState={methods.formState}>
        <Flex justify="end" align="center" mb="4" gap="2">
          <TableFormButtons
            onReset={handleReset}
            onSave={handleSave}
            onAddNew={handleAddNewRow}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={!isDirtyLastItem || !hasExpandedGroup}
            isSaving={isSaving}
          />
        </Flex>

        {/* <table className="translations-table expandable"> */}
        <table
          className={`translations-table expandable ${showKeyColumn ? 'is-visible-key-column' : 'is-hidden-key-column'}`}
        >
          <thead>
            <tr>
              <th className="col-key"></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{hasGrouping ? <></> : <>{lang}</>}</th>
              ))}
              <th className="col-actions"></th>
            </tr>
          </thead>

          <tbody>
            {groupedSubtypes.map((group, groupIndex) => {
              const isExpanded = expandedGroups.has(group.drinkTypeId);

              // Find all fields that belong to this group
              const numRows: number[] = [];
              fields.forEach((field, globalIndex) => {
                const item = watchedItems[globalIndex];
                if (item && (item as any).drinkTypeId === group.drinkTypeId) {
                  numRows.push(globalIndex);
                }
              });

              const hasSubtypes = numRows.length > 0;

              return (
                <React.Fragment key={group.drinkTypeId}>
                  {/* Group Header Row */}
                  <tr
                    className={`group-header ${isExpanded ? 'expanded' : ''}`}
                    onClick={() => toggleGroup(group.drinkTypeId)}
                  >
                    <td style={{ width: COL_CHEVRON_WIDTH, textAlign: 'center' }}>
                      {isExpanded ? <ChevronDownIcon /> : <ChevronRightIcon />}
                    </td>
                    <td className="col-key" colSpan={supportedLanguages.length + 2}>
                      <Flex
                        className="group-header-content"
                        justify="between"
                        align="center"
                        style={{ width: '100%' }}
                      >
                        <Text size="3" weight="bold" style={{ color: 'inherit' }}>
                          {group.drinkTypeName}
                        </Text>
                        <Text
                          size="2"
                          style={{
                            color: hasSubtypes ? colors.info : colors.textXLight,
                            opacity: hasSubtypes ? 1 : 0.5,
                          }}
                        >
                          [ {numRows.length} ]
                        </Text>
                      </Flex>
                    </td>
                  </tr>

                  {/* Column Header Row (mimics thead) - only show when expanded */}
                  {isExpanded && (
                    <tr className="group-subheader">
                      <td className="col-key"></td>
                      {supportedLanguages.map((lang) => (
                        <td key={lang}>{lang}</td>
                      ))}
                      <td className="col-actions"></td>
                    </tr>
                  )}

                  {isExpanded && numRows.length === 0 && (
                    <tr className="group-placeholder">
                      <td colSpan={supportedLanguages.length + 2}>Ningu na entrada suptipo</td>
                    </tr>
                  )}

                  {/* Subtype Rows (only if expanded) */}
                  {isExpanded &&
                    numRows.map((globalIndex, subtypeIndex) => {
                      const field = fields[globalIndex];
                      if (!field) return null;

                      return (
                        <ExpandedSubtypeRow
                          className="subtype-row"
                          key={field.fieldId}
                          index={globalIndex}
                          onDelete={handleDelete}
                          supportedLanguages={supportedLanguages}
                          isEditing={
                            editingRowIndex?.groupIndex === groupIndex &&
                            editingRowIndex?.rowIndex === subtypeIndex
                          }
                          onEditingChange={(isEditing) => {
                            setEditingRowIndex(isEditing ? { groupIndex, rowIndex: subtypeIndex } : null);
                          }}
                          isSaving={isSaving}
                          isDeleting={isDeleting}
                        />
                      );
                    })}
                </React.Fragment>
              );
            })}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
