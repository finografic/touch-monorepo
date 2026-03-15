import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { MIN_TABLE_ROWS } from 'forms/FormMiddleware/FormMiddleware.constants';

import type { MockDataHandlers } from '../mock-orders.utils';
import { OrdersFormDevTools } from '../OrderFormDevTools/OrdersFormDevTools';
import { PROFILE_ITEM_VALUES_EMPTY } from '../orders-form.utils';
import type { OrdersFormValues } from '../OrdersForm.schema';
import { TimesRepeaterTable } from '../TimesRepeaterTable';
import { ChevronDownIcon, ChevronLeftIcon } from '@finografic/icons';
import { styles } from './ProfilesPanel.styles';

interface ProfilesPanelProps {
  populatedRowsCount: number;
  formValues: OrdersFormValues;
  methods: UseFormReturn<OrdersFormValues>;
  mockDataHandlers: MockDataHandlers;
  canAddRow: boolean;
  onAddRow: () => void;
  language: string;
  onCanAddRowChange: (canAdd: boolean) => void;
  onGenerateRandomValues: (rowIndex: number) => void;
}

export const ProfilesPanel: React.FC<ProfilesPanelProps> = ({
  populatedRowsCount,
  formValues,
  methods,
  mockDataHandlers,
  canAddRow,
  onAddRow,
  language,
  onCanAddRowChange,
  onGenerateRandomValues,
}) => {
  const [isPanelCollapsed, setIsPanelCollapsed] = useState(false);

  const toggleIcon = isPanelCollapsed ? (
    <ChevronLeftIcon className="panel-toggle-icon icon-is-collapsed" />
  ) : (
    <ChevronDownIcon className="panel-toggle-icon icon-is-open" />
  );

  return (
    <div css={styles} className="temperature-profiles-panel-wrapper">
      <div className="temperature-profiles-panel" data-collapsed={isPanelCollapsed}>
        <div
          className="p-panel-header"
          onClick={() => setIsPanelCollapsed((v) => !v)}
          style={{ cursor: 'pointer' }}
        >
          <span className="p-panel-title">Temperature Profiles</span>
          <button
            className="p-panel-header-icon"
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsPanelCollapsed((v) => !v);
            }}
            aria-expanded={!isPanelCollapsed}
            aria-label="Toggle panel"
          >
            {toggleIcon}
          </button>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateRows: isPanelCollapsed ? '0fr' : '1fr',
            transition: 'grid-template-rows 300ms ease-in-out',
          }}
        >
          <div style={{ overflow: 'hidden' }}>
            <div className="p-panel-content">
              <TimesRepeaterTable
                name="timeRows"
                emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
                minRows={MIN_TABLE_ROWS}
                language={language}
                onCanAddRowChange={onCanAddRowChange}
                onGenerateRandomValues={onGenerateRandomValues}
              />
            </div>
          </div>
        </div>

        <div className="panel-footer">
          <div className="total-rows-counter">
            <span>
              Filas completas: {populatedRowsCount} / {MIN_TABLE_ROWS}
            </span>
          </div>
          <OrdersFormDevTools
            formValues={formValues}
            methods={methods}
            mockDataHandlers={mockDataHandlers}
            canAddRow={canAddRow}
            onAddRow={onAddRow}
          />
        </div>
      </div>
    </div>
  );
};
