const VERTICAL_FLOW_THRESHOLD = 4;
const THREE_COLUMN_THRESHOLD = 9;

/**
 * Returns the appropriate grid flow classes based on the number of items
 * - For items <= 4: vertical flow + centered
 * - For items >= 9: three columns
 * - For items 5-8: two columns (default)
 */
export const getGridFlowClasses = (itemCount: number): string => {
  const baseClass = 'items-grid';

  if (itemCount <= VERTICAL_FLOW_THRESHOLD) {
    return `${baseClass} vertical-flow centered-flow`;
  }

  if (itemCount >= THREE_COLUMN_THRESHOLD) {
    return `${baseClass} three-columns`;
  }

  return baseClass;
};
