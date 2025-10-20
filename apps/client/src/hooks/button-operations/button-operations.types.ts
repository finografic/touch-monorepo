/**
 * Shared types for button operations
 */

export type OperationActionType =
  | 'clear-completed'
  | 'cancel-completed'
  | 'select-all'
  | 'start-process'
  | 'finish-product-process'
  | 'program-time'
  | 'program-product'
  | 'repeat-selection'
  | 'cancel-time-session'
  | 'cancel-product-session';

export interface OperationState {
  isDisabled: boolean;
  isLoading: boolean;
}
