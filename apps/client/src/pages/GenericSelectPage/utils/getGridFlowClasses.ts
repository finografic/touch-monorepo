const VERTICAL_FLOW_THRESHOLD = 4;
const THREE_COLUMN_THRESHOLD = 9;
const FOUR_COLUMN_THRESHOLD = 13;

/**
 * Returns the appropriate grid flow classes based on the number of items
 * - For items <= 4: vertical flow + centered
 * - For items 5-8: two columns (default)
 * - For items 9-12: three columns
 * - For items >= 13: four columns
 */
export const getGridFlowClasses = (itemCount: number): string => {
  const baseClass = 'items-grid';

  if (itemCount <= VERTICAL_FLOW_THRESHOLD) {
    return `${baseClass} vertical-flow centered-flow`;
  }

  if (itemCount >= FOUR_COLUMN_THRESHOLD) {
    return `${baseClass} four-columns`;
  }

  if (itemCount >= THREE_COLUMN_THRESHOLD) {
    return `${baseClass} three-columns`;
  }

  return baseClass;
};
