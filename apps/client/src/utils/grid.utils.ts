// Grid utilities for consistent column-major numbering and iteration
interface GridRowsColumns {
  rows: number;
  columns: number;
}

// NOTE: MAIN GRID BUILDER UTILITY: Domain-friendly alias
export function mapGridByColumns<T>(
  { rows, columns }: GridRowsColumns,
  mapCell: (slotNumber: number, row?: number, col?: number) => T,
): T[] {
  return mapColumnMajor({ rows, columns }, mapCell);
}

/**
 * Iterate column-major and collect results using a mapper callback.
 */
function mapColumnMajor<T>(
  { rows, columns }: GridRowsColumns,
  mapCell: (slotNumber: number, row: number, col: number) => T,
): T[] {
  const results: T[] = [];
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      const slotNumber = getSlotNumberAt(row, col, rows);
      results.push(mapCell(slotNumber, row, col));
    }
  }
  return results;
}

/**
 * Compute 1-based slot number at a given (row, col) in column-major order.
 * rows is fixed at 3 in our grids, but kept as a parameter for reuse.
 */
function getSlotNumberAt(rowIndex: number, colIndex: number, rows: number): number {
  return colIndex * rows + rowIndex + 1;
}
