/**
 * Button Operations - Orchestrator Hook
 *
 * This hook combines all flow-specific operations into a unified API.
 * It maintains backward compatibility with the original useButtonOperations hook.
 *
 * Architecture:
 * - useMainPageOperations: Timer management, selection, repeat configuration
 * - useTimeFlowOperations: Program time, start time process, cancel time session
 * - useProductFlowOperations: Program product, start/finish product process, cancel product session
 * - useOperationState: Shared disabled/loading state logic
 */

import type { OperationActionType } from './button-operations.types';
import { useMainPageOperations } from './useMainPageOperations';
import { useOperationState } from './useOperationState';
import { useProductFlowOperations } from './useProductFlowOperations';
import { useTimeFlowOperations } from './useTimeFlowOperations';

interface UseButtonOperationsReturn {
  // MainPage operations
  handleClearCompleted: () => void;
  handleCancelCompleted: () => void;
  handleSelectAll: () => void;
  handleRepeatSelection: () => void;

  // Time flow operations
  handleProgramTime: () => void;
  handleStartTimeProcess: (duration: number) => void;
  handleCancelTimeSession: () => void;

  // Product flow operations
  handleProgramProduct: () => void;
  handleStartProductProcess: () => void;
  handleFinishProductProcess: () => void;
  handleCancelProductSession: () => void;

  // State queries
  getOperationDisabled: (actionType: OperationActionType) => boolean;
  getOperationLoading: (actionType: OperationActionType) => boolean;
  isOperationPending: boolean;
}

/**
 * Main orchestrator hook that combines all button operations
 *
 * @example
 * ```tsx
 * const {
 *   handleProgramProduct,
 *   handleStartProductProcess,
 *   getOperationDisabled,
 * } = useButtonOperations();
 *
 * <button
 *   onClick={handleProgramProduct}
 *   disabled={getOperationDisabled('program-product')}
 * >
 *   Program Product
 * </button>
 * ```
 */
export const useButtonOperations = (): UseButtonOperationsReturn => {
  // Flow-specific hooks
  const mainPageOps = useMainPageOperations();
  const timeFlowOps = useTimeFlowOperations();
  const productFlowOps = useProductFlowOperations();

  // Shared state logic
  const operationState = useOperationState(
    mainPageOps.isPending,
    timeFlowOps.isPending,
    productFlowOps.isPending,
    productFlowOps.isTemperatureLoading,
  );

  return {
    // MainPage operations
    handleClearCompleted: mainPageOps.handleClearCompleted,
    handleCancelCompleted: mainPageOps.handleCancelCompleted,
    handleSelectAll: mainPageOps.handleSelectAll,
    handleRepeatSelection: mainPageOps.handleRepeatSelection,

    // Time flow operations
    handleProgramTime: timeFlowOps.handleProgramTime,
    handleStartTimeProcess: timeFlowOps.handleStartTimeProcess,
    handleCancelTimeSession: timeFlowOps.handleCancelTimeSession,

    // Product flow operations
    handleProgramProduct: productFlowOps.handleProgramProduct,
    handleStartProductProcess: productFlowOps.handleStartProductProcess,
    handleFinishProductProcess: productFlowOps.handleFinishProductProcess,
    handleCancelProductSession: productFlowOps.handleCancelProductSession,

    // State queries
    getOperationDisabled: operationState.getOperationDisabled,
    getOperationLoading: operationState.getOperationLoading,
    isOperationPending: operationState.isOperationPending,
  };
};

// Re-export types for convenience
export type { OperationActionType } from './button-operations.types';
export { useMainPageOperations } from './useMainPageOperations';
export { useOperationState } from './useOperationState';
export { useProductFlowOperations } from './useProductFlowOperations';
export { useTimeFlowOperations } from './useTimeFlowOperations';
