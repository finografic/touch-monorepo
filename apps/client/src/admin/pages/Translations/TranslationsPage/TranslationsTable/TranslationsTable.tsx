import React, { useEffect, useMemo, useRef, useState } from 'react';
import { FormProvider } from 'react-hook-form';
import type { RegionLocale } from '@workspace/config/i18n.config';
import type { I18nTranslationsDomain } from '@workspace/i18n/types';

import createCuid from '@bugsnag/cuid';
import clsx from 'clsx';
import { Flex } from 'styled-system/jsx';
import { useDebouncedCallback } from 'use-debounce';

import { TableFormButtons } from '../../shared/components/TableFormButtons';
import { isPagesTableGroup, isTranslationRowBlocked } from '../../shared/constants/translationsTable.constants';
import type { TranslationsFormItem } from '../../shared/types/translations.types';
import { addTranslationsGroupRow, computePageGrouping } from './components/TranslationsGroupRow';
import { TranslationsRow } from './components/TranslationsRow';
import type { UserRoleDisplayConfig } from './utils/roles.utils';
import { computeDomainSubGrouping } from '../utils/domain.utils';
import { useTranslationsTableForm } from './hooks/useTranslationsTableForm';
import { useTranslationsTableHandlers } from './hooks/useTranslationsTableHandlers';
import { styles } from '../../shared/styles/TranslationsTable.styles';

interface TranslationsTableProps {
  domain: I18nTranslationsDomain;
  group: string;
  items: TranslationsFormItem[];
  supportedLanguages: RegionLocale[];
  canAddNew: boolean;
  onSave?: (
    { items }: { items: TranslationsFormItem[] },
  ) => Promise<{ savedItems: TranslationsFormItem[] }>;
  onDelete?: (itemId: string) => Promise<{ success: boolean; deletedId: string }>;
  isSaving?: boolean;
  isDeleting?: boolean;
  showKeyColumn: boolean;
  setShowKeyColumn: (showKeyColumn: boolean) => void;
  /** When set with `display: true`, page rows/group headers show `(admin)` / `(public)` from segment + optional `default`. */
  userRole?: UserRoleDisplayConfig;
}

export const TranslationsTable: React.FC<TranslationsTableProps> = ({
  domain,
  group,
  items,
  supportedLanguages,
  canAddNew,
  onSave,
  onDelete,
  isSaving = false,
  isDeleting = false,
  showKeyColumn,
  setShowKeyColumn,
  userRole,
}) => {
  const initialItemsRef = useRef<TranslationsFormItem[]>(items);
  const [editingRowIndex, setEditingRowIndex] = useState<number | null>(null);
  const hasGrouping = isPagesTableGroup(group) && Boolean(domain);

  useEffect(
    function initialItemsState() {
      initialItemsRef.current = items;
    },
    [items],
  );

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

  const pageGrouping = useMemo(
    () => computePageGrouping(Boolean(hasGrouping), items, fields),
    [hasGrouping, items, fields],
  );

  // Proxy sub-groups for domains.{segment}.* clusters within a page (display only)
  const domainSubGrouping = useMemo(
    () => computeDomainSubGrouping(items, fields, pageGrouping, domain),
    [items, fields, pageGrouping, domain],
  );

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
  // Add New Handler (table-specific)
  // ======================================================================== //

  const handleAddNewRow = useDebouncedCallback(
    () => {
      if (hasEmptyRow) return;

      append({
        id: `temp-${createCuid()}`, // temp ID, replaced on save
        key: '',
        ...Object.fromEntries(languageKeys.map((k) => [k, ''])),
      } as TranslationsFormItem);
    },
    250,
    { leading: true, trailing: false },
  );

  // ======================================================================== //
  // Render
  // ======================================================================== //

  return (
    <section css={styles} className="table-container">
      <FormProvider {...methods} formState={methods.formState}>
        <Flex justify="end" align="center" mb={4} gap={2}>
          <TableFormButtons
            onReset={handleReset}
            onSave={handleSave}
            onAddNew={canAddNew ? handleAddNewRow : undefined}
            isDirty={methods.formState.isDirty}
            isAddNewDisabled={!isDirtyLastItem}
            isSaving={isSaving}
            setShowKeyColumn={() => setShowKeyColumn(!showKeyColumn)}
            showKeyColumn={showKeyColumn}
          />
        </Flex>

        <table
          className={clsx('translations-table', {
            'is-hidden-key-column': !showKeyColumn,
            'grouped-rows': hasGrouping,
          })}
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
            {fields.map((field, index) => {
              // Skip rows whose values are all non-translatable (symbols, interpolation placeholders)
              if (isTranslationRowBlocked(watchedItems[index] ?? field, languageKeys)) {
                return null;
              }

              const rows: React.ReactNode[] = [];
              const fieldKey = (field as any).fieldId || field.id || `field-${index}`;
              const itemKey = field.key || field.id || '';

              addTranslationsGroupRow({
                domain,
                group,
                items,
                fields,
                index,
                fieldKey,
                supportedLanguages,
                showKeyColumn,
                pageGrouping,
                domainSubGrouping,
                rows,
                userRole,
              });

              rows.push(
                <TranslationsRow
                  key={`row-${fieldKey}`}
                  translationKey={itemKey}
                  index={index}
                  onDelete={canAddNew ? handleDelete : undefined}
                  supportedLanguages={supportedLanguages}
                  canAddNew={canAddNew}
                  showKeyColumn={showKeyColumn}
                  isEditing={editingRowIndex === index}
                  onEditingChange={(isEditing) => {
                    setEditingRowIndex(isEditing ? index : null);
                  }}
                  isSaving={isSaving}
                  isDeleting={isDeleting}
                />,
              );

              return <React.Fragment key={fieldKey}>{rows}</React.Fragment>;
            })}
          </tbody>
        </table>
      </FormProvider>
    </section>
  );
};
