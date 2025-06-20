import type { Calculation, OrderWithMetadata } from './AdminToolsDialog.types';

export const cleanOrderData = (orders: OrderWithMetadata[]) => {
  if (!orders?.[0]) return null;
  // @ts-ignore - isSelected and process may not exist on all order types
  const { id, hasSubtypes, isActive, isSelected, process, ...cleanOrder } = orders[0];
  return cleanOrder;
};

export const cleanCalculationData = (calculation: Calculation | null) => {
  if (!calculation) return null;
  const { timeTableId, adjustmentFactors, ...cleanCalc } = calculation;
  return cleanCalc;
};

export const loadCalculationFromStorage = (itemNumber: string): Calculation | null => {
  const storedCalc = localStorage.getItem(`temperatureCalculation_${itemNumber}`);
  if (!storedCalc) return null;

  try {
    const parsedCalc = JSON.parse(storedCalc);
    return {
      status: parsedCalc.phases[0].description.toLowerCase().includes('cooling') ? 'cooling' : 'heating',
      temperatureDelta: Math.abs(parsedCalc.phases[0].endTemp - parsedCalc.phases[0].startTemp),
      estimatedDuration: {
        minutes: Math.floor(parsedCalc.estimatedDurationSeconds / 60),
        seconds: parsedCalc.estimatedDurationSeconds % 60,
      },
      recommendations: parsedCalc.recommendations,
      timeTableId: parsedCalc.timeTableId,
    };
  } catch (error) {
    console.error('Error parsing calculation data:', error);
    return null;
  }
};
