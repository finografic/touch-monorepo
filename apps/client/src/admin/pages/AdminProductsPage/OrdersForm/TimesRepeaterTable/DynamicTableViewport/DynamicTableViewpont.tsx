import React, { useEffect, useRef, useState } from 'react';
import { useBoundingRect } from '@workspace/core/hooks';

export const DynamicTableViewport = () => {
  const headerRef = useRef<HTMLDivElement>(null);
  const tableRef = useRef<HTMLDivElement>(null);
  const { rect: headerRect } = useBoundingRect(headerRef);
  const [tableHeight, setTableHeight] = useState<number | undefined>(undefined);

  useEffect(() => {
    const updateHeight = () => {
      const windowHeight = window.innerHeight;
      const headerBottom = headerRect?.bottom ?? 0;
      const padding = 32; // extra margin from bottom
      const availableHeight = windowHeight - headerBottom - padding;
      setTableHeight(Math.max(200, availableHeight));
    };

    updateHeight();
  }, [headerRect]);

  return (
    <div className="page-wrapper" style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
      <div ref={headerRef} className="form-section" style={{ paddingBottom: '0.5rem' }}>
        {/* Form Inputs / Filters / Controls */}
      </div>

      <div
        ref={tableRef}
        className="table-rows-container"
        style={{
          overflowY: 'auto',
          border: '1px solid',
          borderRadius: '0.375rem',
          height: tableHeight ? `${tableHeight}px` : 'auto',
          transition: 'height 0.2s ease',
        }}
      >
        {/* Your table rows */}
      </div>
    </div>
  );
};
