import React, { memo, useMemo } from 'react';

import { PadPower } from 'components/Pads/PadPower';
import { PadSlot } from 'components/Pads/PadSlot';

import { useGetSlotSpecialConfig } from 'queries/app-configuration/useGetSlotSpecialConfig';

import { mapGridByColumns } from 'utils/grid.utils';
import type { SlotConfiguration } from 'types/slot-config.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { ALT_SLOT_NUMBER, NUM_ROWS_DEFAULT } from 'config/app/slots.config';
import { resolveSlotGridLayout } from './utils/slot-grid-layout';
import { styles } from './MainSlotGrid.styles';

interface MainSlotGridProps {
  slots: SlotConfiguration[];
  columns: number;
  rows: number;
  /** Show the special slot (e.g. Slot 10) only when true (columns >= 3 and Special grid switch ON). */
  showSpecialSlot?: boolean;
  /** Show the alt special slot when true (columns >= 3 and Special alt switch ON). */
  showSpecialAltSlot?: boolean;
  /** Slot number to display for the alt special slot (from slot_special_alt config). */
  altSlotNumber?: number;
}

const MainSlotGridComponent: React.FC<MainSlotGridProps> = ({
  slots,
  columns,
  rows = NUM_ROWS_DEFAULT,
  showSpecialSlot = false,
  showSpecialAltSlot = false,
  altSlotNumber = ALT_SLOT_NUMBER,
}) => {
  const slotSpecialGridConfig = useGetSlotSpecialConfig('special_grid');
  const slotSpecialPowerConfig = useGetSlotSpecialConfig('special_power');
  const slotSpecialAltConfig = useGetSlotSpecialConfig('special_alt');

  /**
   * ------------------------------------------------------------------
   * Shared layout resolution (single source of truth)
   * ------------------------------------------------------------------
   */
  const layout = useMemo(
    () =>
      resolveSlotGridLayout({
        slots,
        columns,
        rows,
        getSlotNumber: (s) => s.slotNumber,
        isActive: (s) => s.isActive,
        showSpecialSlot,
        showSpecialAltSlot,
      }),
    [slots, columns, rows, showSpecialSlot, showSpecialAltSlot],
  );

  /**
   * Calculate dynamic width based on columns
   * Each pad ≈110px, gap 2.5rem (40px)
   */
  const padWidth = 110;
  const gapSize = 40;
  const gridWidth = columns * padWidth + (columns - 1) * gapSize;

  return (
    <div css={styles} className="main-page-slot-grid">
      <div
        className="slot-grid"
        style={{
          gridTemplateColumns: `repeat(${columns}, 1fr)`,
          gridTemplateRows: `repeat(${rows}, 1fr)`,
          width: `${gridWidth}px`,
        }}
      >
        {mapGridByColumns({ rows, columns }, (slotNumber) => {
          const slot = layout.regularSlots.get(slotNumber);

          return slot ? (
            <PadSlot
              key={slot.slotNumber}
              slotType={slot.slotType}
              slotNumber={slot.slotNumber}
              mutualExclusionAltSlotNumber={altSlotNumber}
            />
          ) : null;
        })}
      </div>

      <div className="slot-col-lg">
        <div className="slot-special-row">
          <div className="slot-item-special">
            {layout.primarySpecialSlot && (
              <PadSlot
                key={layout.primarySpecialSlot.slotNumber}
                slotType={SlotType.C}
                slotNumber={layout.primarySpecialSlot.slotNumber}
                variant="large"
                className="pad-special-grid"
                mutualExclusionAltSlotNumber={altSlotNumber}
              />
            )}

            {layout.showAltInPrimary && (
              <PadSlot
                key={`alt-${altSlotNumber}`}
                slotType={SlotType.C}
                slotNumber={altSlotNumber}
                variant="large"
                className="pad-special-alt"
                interactive={true}
                mutualExclusionAltSlotNumber={altSlotNumber}
              />
            )}
          </div>

          {layout.showSecondaryAlt && (
            <div className="slot-item-special">
              <PadSlot
                key={`alt-${altSlotNumber}`}
                slotType={SlotType.C}
                slotNumber={altSlotNumber}
                variant="large"
                className="pad-special-alt"
                interactive={true}
                mutualExclusionAltSlotNumber={altSlotNumber}
              />
            </div>
          )}
        </div>

        {/* Only render power pad when config has loaded and is visible */}
        {slotSpecialPowerConfig.data?.isActive &&
          slotSpecialPowerConfig.data.data?.is_visible && (
            <PadPower key="pad-power" slotType={SlotSpecial.ENF} variant="large" />
          )}
      </div>
    </div>
  );
};

export const MainSlotGrid = memo(MainSlotGridComponent);
