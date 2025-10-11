const VERTICAL_FLOW_THRESHOLD = 4;

/**
 * Returns the appropriate grid flow classes based on the number of items
 * - For items <= 4: vertical flow + centered
 * - For items > 4: horizontal flow (default)
 */
export const getGridFlowClasses = (itemCount: number): string => {
  const baseClass = 'items-grid';

  if (itemCount <= VERTICAL_FLOW_THRESHOLD) {
    return `${baseClass} vertical-flow centered-flow`;
  }

  return baseClass;
};
