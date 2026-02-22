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
}

const MainPageSlotGridComponent: React.FC<MainPageSlotGridProps> = ({
  slots,
  columns,
  rows = NUM_ROWS_DEFAULT,
}) => {
  const activeSlots = useMemo(() => slots.filter((s) => s.isActive), [slots]);
  const gridCount = columns * rows;
  const mainGridSlots = activeSlots.slice(0, gridCount);
  const lastSlot = activeSlots[gridCount] ?? null;

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
        {lastSlot && (
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
