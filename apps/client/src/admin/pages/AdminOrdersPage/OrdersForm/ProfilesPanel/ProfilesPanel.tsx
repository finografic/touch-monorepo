import React, { useState } from 'react';
import type { UseFormReturn } from 'react-hook-form';

import { Text } from '@radix-ui/themes';
import { MIN_TABLE_ROWS } from 'forms/FormMiddleware/FormMiddleware.constants';
import { Panel } from 'primereact/panel';

import { OrdersFormDevTools } from '../OrderFormDevTools/OrdersFormDevTools';
import type { MockDataHandlers } from '../mock-orders.utils';
import { PROFILE_ITEM_VALUES_EMPTY } from '../orders-form.utils';
import type { OrdersFormValues } from '../OrdersForm.schema';
import { TimesRepeaterTable } from '../TimesRepeaterTable';
import { ChevronDownIcon, ChevronLeftIcon } from 'styles/icons';
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
      <Panel
        headerTemplate={(options) => (
          <div className={options.className} onClick={options.onTogglerClick}>
            <span className={options.titleClassName}>Temperature Profiles</span>
            <button className={options.togglerClassName} onClick={options.onTogglerClick} type="button">
              {toggleIcon}
            </button>
          </div>
        )}
        className="temperature-profiles-panel"
        toggleable
        collapsed={isPanelCollapsed}
        onToggle={(e) => setIsPanelCollapsed(e.value)}
        transitionOptions={{ timeout: 300, easing: 'ease-in-out' }}
        data-collapsed={isPanelCollapsed}
        footer={
          <div className="panel-footer">
            <div className="total-rows-counter">
              <Text size="3" weight="bold" color="gray">
                Filas completas: {populatedRowsCount} / {MIN_TABLE_ROWS}
              </Text>
            </div>
            <OrdersFormDevTools
              formValues={formValues}
              methods={methods}
              mockDataHandlers={mockDataHandlers}
              canAddRow={canAddRow}
              onAddRow={onAddRow}
            />
          </div>
        }
      >
        <TimesRepeaterTable
          name="timeRows"
          emptyRowValues={PROFILE_ITEM_VALUES_EMPTY}
          minRows={MIN_TABLE_ROWS}
          language={language}
          onCanAddRowChange={onCanAddRowChange}
          onGenerateRandomValues={onGenerateRandomValues}
        />
      </Panel>
    </div>
  );
};
