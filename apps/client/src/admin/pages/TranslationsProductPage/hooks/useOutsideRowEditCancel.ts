import { useEffect, useRef } from 'react';
import { useOnClickOutside } from 'usehooks-ts';

/**
 * Handles closing PrimeReact row editing when clicking outside the DataTable.
 * Falls back to triggering the built-in cancel button if closeEditingRows is a no-op.
 */
export const useOutsideRowEditCancel = (dataTableRef: React.MutableRefObject<any>) => {
  const dataTableElementRef = useRef<HTMLDivElement | null>(null);

  // Capture the actual DataTable element once available
  useEffect(() => {
    const el = dataTableRef.current?.getElement?.();
    if (el) {
      dataTableElementRef.current = el as HTMLDivElement;
    }
  }, [dataTableRef]);

  useOnClickOutside(dataTableElementRef, () => {
    const dt = dataTableRef.current;
    dt?.closeEditingRows?.();
    const cancelBtn = dataTableElementRef.current?.querySelector('.p-row-editor-cancel');
    if (cancelBtn instanceof HTMLElement) {
      cancelBtn.click();
    }
  });
};

