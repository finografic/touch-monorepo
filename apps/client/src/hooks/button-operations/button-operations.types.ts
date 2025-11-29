/**
 * Shared types for button operations
 */

import type { ButtonActionType } from 'types/button.types';

/**
 * Operation actions are all button actions EXCEPT navigation actions.
 * Navigation actions (NAVIGATE_BACK, NAVIGATE_NEXT) are handled separately.
 */
export type OperationActionType = Exclude<ButtonActionType, 'NAVIGATE_BACK' | 'NAVIGATE_NEXT'>;

export interface OperationState {
  isDisabled: boolean;
  isLoading: boolean;
}
