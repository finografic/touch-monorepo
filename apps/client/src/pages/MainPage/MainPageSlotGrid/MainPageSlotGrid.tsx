import React, { memo, useMemo } from 'react';

import { PadPower } from 'components/Pads/PadPower';
import { PadSlot } from 'components/Pads/PadSlot';

import { mapGridByColumns } from 'utils/grid.utils';
import type { SlotConfiguration } from 'types/slot-config.types';
import { SlotSpecial, SlotType } from 'types/slots.types';
import { NUM_ROWS_DEFAULT } from 'config/app/slots.config';
import { styles } from './MainPageSlotGrid.styles';

interface MainPageSlotGridProps {
  slots: SlotConfiguration[];
  columns: number;
  rows: number;
  /** When true, all slots are in the grid (no separate "special" slot). Used for minimal 4-slot 2×2. */
  minimalLayout?: boolean;
}

const MainPageSlotGridComponent: React.FC<MainPageSlotGridProps> = ({
  slots,
  columns,
  rows = NUM_ROWS_DEFAULT,
  minimalLayout = false,
}) => {
  const activeSlots = useMemo(() => slots.filter((s) => s.isActive), [slots]);
  const totalSlots = activeSlots.length;
  const mainGridSlots = minimalLayout
    ? activeSlots
    : activeSlots.slice(0, totalSlots - 1); // All except the last (or all when minimal)
  const lastSlot = minimalLayout ? null : activeSlots[totalSlots - 1] ?? null;

  // Calculate dynamic width based on columns
  // Each pad is ~110px, gap is 2.5rem (40px), so: (columns * 110) + ((columns - 1) * 40)
  const padWidth = 110;
  const gapSize = 40; // 2.5rem
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
          const slot = mainGridSlots.find((s) => s.slotNumber === slotNumber);
          return slot ? (
            <PadSlot key={slot.slotNumber} slotType={slot.slotType} slotNumber={slot.slotNumber} />
          ) : null;
        })}
      </div>

      <div className="slot-col-lg">
        {!minimalLayout && lastSlot && (
          <PadSlot
            key={lastSlot.slotNumber}
            slotType={SlotType.C}
            slotNumber={lastSlot.slotNumber}
            variant="large"
          />
        )}
        <PadPower key="pad-power" slotType={SlotSpecial.ENF} variant="large" />
      </div>
    </div>
  );
};

export const MainPageSlotGrid = memo(MainPageSlotGridComponent);
