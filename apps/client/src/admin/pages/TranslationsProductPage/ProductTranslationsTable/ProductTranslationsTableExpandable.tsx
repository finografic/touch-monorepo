import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider, useFieldArray, useForm, useController, useFormContext } from 'react-hook-form';
import { useDebouncedCallback } from 'use-debounce';
import { Flex, Text } from '@radix-ui/themes';
import { ChevronRightIcon, ChevronDownIcon } from '@radix-ui/react-icons';
import createCuid from '@bugsnag/cuid';
import clsx from 'clsx';
import { TrashIcon } from 'styles/icons';
import { Button } from 'components/Button';
import { Input } from 'forms/Input/Input';

import { TableFormButtons } from 'admin/pages/TranslationsProductPage/TableFormButtons/TableFormButtons';
import { languagesCodeToKey, regenerateSlug } from 'admin/pages/TranslationsProductPage/utils/language.utils';
import { styles } from './ProductTranslationsTable.styles';
import { useGetDrinkTypes } from 'queries/drink-types';
import { useToast } from 'components/Toast/ToastContext';

import type { RegionLocale } from '@workspace/config/i18n.config';
import type { TranslationFormItem } from 'admin/pages/TranslationsProductPage/translations.types';
import { colors } from 'styles/colors/colors-direct';

interface ProductTranslationsTableExpandableProps {
  sectionKey: string;
  items: TranslationFormItem[];
  supportedLanguages: RegionLocale[];
  onSave?: (params: {
    sectionKey: string;
    items: TranslationFormItem[];
  }) => Promise<{ success: boolean; savedItems: TranslationFormItem[] }>;
  onDelete?: (itemId: string, drinkTypeId?: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
}

interface GroupedSubtypes {
  drinkTypeId: string;
  drinkTypeName: string;
  subtypes: TranslationFormItem[];
}

interface ExpandableSubtypeRowProps {
  className?: string;
  index: number;
  onDelete: (index: number) => Promise<void>;
  supportedLanguages: RegionLocale[];
  isEditing: boolean;
  onEditingChange: (isEditing: boolean) => void;
  isDeleting?: boolean;
}
/**
 * Row component for expandable table that includes chevron column + regular row cells
 */
const ExpandableSubtypeRow: React.FC<ExpandableSubtypeRowProps> = ({
  index,
  onDelete,
  supportedLanguages,
  isEditing,
  onEditingChange,
  isDeleting = false,
}) => {
  const { control, register, formState, watch, setValue } = useFormContext();

  const COL_CHEVRON_WIDTH = '30px';

  const { field: nameField } = useController({
    name: `items.${index}.name`,
    control,
  });

  const values = watch(`items.${index}`);

  const updateSlug = useDebouncedCallback((translations: Record<string, string>) => {
    const nextSlug = regenerateSlug(translations, supportedLanguages);
    if (nextSlug !== nameField.value) {
      setValue(`items.${index}.name`, nextSlug, { shouldDirty: true, shouldTouch: true });
    }
  }, 100);

  useEffect(() => {
    if (!values) return;
    const translations: Record<string, string> = {};
    for (const lang of supportedLanguages) {
      const key = languagesCodeToKey(lang);
      translations[lang] = values[key];
    }
    updateSlug(translations);
  }, [values?.esEs, values?.enGb, values?.caEs, supportedLanguages, setValue]);

  const rowDirtyFields = formState.dirtyFields?.items?.[index];
  const isDirty = Boolean(rowDirtyFields);

  const rowClasses = clsx({
    'row-editing': isEditing,
    'row-dirty': isDirty,
  });

  return (
    <tr
      className={rowClasses}
      onFocus={() => onEditingChange(true)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node)) {
          onEditingChange(false);
        }
      }}
    >
      {/* Empty cell for chevron column alignment */}
      <td style={{ width: COL_CHEVRON_WIDTH }}></td>

      {/* SLUG / KEY */}
      <td className="col-key">
        <Input
          value={nameField.value || ''}
          readOnly
          className={clsx({ 'input-dirty': rowDirtyFields?.name })}
        />
      </td>

      {/* DYNAMIC LANGUAGE COLUMNS */}
      {supportedLanguages.map((lang) => {
        const fieldKey = languagesCodeToKey(lang);
        const fieldName = `items.${index}.${fieldKey}` as const;
        const value = watch(`items.${index}.${fieldKey}`);

        return (
          <td key={lang}>
            <Input
              {...register(fieldName)}
              placeholder="--"
              className={clsx({
                'input-dirty': rowDirtyFields?.[fieldKey],
                'input-empty': !value,
              })}
            />
          </td>
        );
      })}

      {/* DELETE */}
      <td>
        <Button
          className="button button-delete"
          aria-label="Delete"
          variant="ghost"
          size="md"
          color="danger"
          onClick={() => onDelete(index)}
          disabled={isDeleting}
        >
          <TrashIcon />
        </Button>
      </td>
    </tr>
  );
};

/**
 * Expandable table for drink subtypes, grouped by parent drink type.
 * Uses RHF for form management, similar to ProductTranslationsTable.
 */
export const ProductTranslationsTableExpandable: React.FC<ProductTranslationsTableExpandableProps> = ({
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

  const COL_CHEVRON_WIDTH = '30px'; // does nothing..

  // ======================================================================== //
  // Drink Type Mapping
  // ======================================================================== //

  const drinkTypeMap = useMemo(() => {
    const map = new Map<string, string>();
    drinkTypes.forEach((dt) => {
      map.set(dt.id, dt.name);
    });
    return map;
  }, [drinkTypes]);

  // ======================================================================== //
  // Group Subtypes by Drink Type
  // ======================================================================== //

  const groupedSubtypes = useMemo<GroupedSubtypes[]>(() => {
    // Group existing subtypes by drinkTypeId
    const groupsMap = new Map<string, TranslationFormItem[]>();
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
  // RHF Setup
  // ======================================================================== //

  const methods = useForm({
    mode: 'onChange',
    defaultValues: { items },
  });

  const { control, watch } = methods;

  const { fields, remove, append } = useFieldArray({
    control,
    name: 'items',
    keyName: 'fieldId',
  });

  // Track initial items for DELETE detection
  const initialItemsRef = useRef<TranslationFormItem[]>(items);
  const isInitialMount = useRef(true);

  // Update ref when items prop changes (after successful save/delete)
  useEffect(() => {
    initialItemsRef.current = items;
  }, [items]);

  // Reset form when items prop changes (after refetch/navigation)
  // This ensures form state matches fresh data from the server
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return; // Skip reset on initial mount
    }

    // Reset form with new items as default values
    // This clears dirty state when navigating back to the page
    methods.reset({ items }, { keepValues: false, keepDefaultValues: true });
  }, [items, methods]);

  // ======================================================================== //
  // Empty Row Detection
  // ======================================================================== //

  const languageKeys = useMemo(() => supportedLanguages.map(languagesCodeToKey), [supportedLanguages]);

  const watchedItems = watch('items');
  const isDirtyLastItem = Boolean(watchedItems.at(-1)?.name);

  const isItemEmpty = (item: TranslationFormItem, languageKeys: string[]) =>
    languageKeys.every((key) => !item[key]?.trim());

  const hasEmptyRow = useMemo(() => {
    return watchedItems?.some((item: TranslationFormItem) =>
      languageKeys.every((key) => !item?.[key]?.trim()),
    );
  }, [watchedItems, languageKeys]);

  // ======================================================================== //
  // Handlers
  // ======================================================================== //

  const handleDelete = async (index: number) => {
    const item = watchedItems[index];

    if (item.id.startsWith('temp-')) {
      remove(index);
      return;
    }

    const itemName = item.name || 'this item';
    const confirmed = window.confirm(
      `Are you sure you want to delete "${itemName}"?\n\nThis action cannot be undone.`,
    );

    if (!confirmed) return;

    if (!onDelete) {
      remove(index);
      return;
    }

    try {
      const drinkTypeId = (item as any).drinkTypeId;
      const result = await onDelete(item.id, drinkTypeId);
      if (result?.success) {
        remove(index);
        initialItemsRef.current = initialItemsRef.current.filter((i) => i.id !== result.deletedId);
      }
    } catch (error) {
      console.error('[Delete] Failed:', error);
    }
  };

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
      } as TranslationFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  const handleSave = methods.handleSubmit(async (data) => {
    const cleanedItems = data.items.filter((item) => !isItemEmpty(item, languageKeys));

    const result = await onSave?.({
      sectionKey,
      items: cleanedItems,
    });

    if (result?.savedItems) {
      methods.reset(
        { items: result.savedItems },
        {
          keepErrors: false,
          keepDirty: false,
          keepTouched: false,
        },
      );
    }
  });

  const handleReset = () => {
    methods.reset();
  };

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

        <table className="translations-table">
          <thead>
            <tr>
              <th style={{ width: COL_CHEVRON_WIDTH }}></th>
              <th></th>
              {supportedLanguages.map((lang) => (
                <th key={lang}>{lang}</th>
              ))}
              <th></th>
            </tr>
          </thead>
          <tbody>
            {groupedSubtypes.map((group, groupIndex) => {
              const isExpanded = expandedGroups.has(group.drinkTypeId);

              // Find all fields that belong to this group
              const groupFieldIndices: number[] = [];
              fields.forEach((field, globalIndex) => {
                const item = watchedItems[globalIndex];
                if (item && (item as any).drinkTypeId === group.drinkTypeId) {
                  groupFieldIndices.push(globalIndex);
                }
              });

              const hasSubtypes = groupFieldIndices.length > 0;

              return (
                <React.Fragment key={group.drinkTypeId}>
                  {/* Group Header Row */}
                  <tr className="group-header" onClick={() => toggleGroup(group.drinkTypeId)}>
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
                          [ {groupFieldIndices.length} ]
                        </Text>
                      </Flex>
                    </td>
                  </tr>

                  {/* {isExpanded && (
                    <thead>
                      <tr>
                        <th></th>
                        {supportedLanguages.map((lang) => (
                          <th key={lang}>{lang}</th>
                        ))}
                        <th></th>
                      </tr>
                    </thead>
                  )} */}

                  {/* Subtype Rows (only if expanded) */}
                  {isExpanded &&
                    groupFieldIndices.map((globalIndex, subtypeIndex) => {
                      const field = fields[globalIndex];
                      if (!field) return null;

                      return (
                        <ExpandableSubtypeRow
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
