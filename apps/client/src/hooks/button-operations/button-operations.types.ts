/**
 * Shared types for button operations
 */

import type { ButtonType } from 'types/button.types';

/**
 * Operation actions are all button actions EXCEPT navigation actions.
 * Navigation actions (NAVIGATE_BACK, NAVIGATE_NEXT) are handled separately.
 */
export type OperationActionType = Exclude<ButtonType, 'NAVIGATE_BACK' | 'NAVIGATE_NEXT'>;

export interface OperationState {
  isDisabled: boolean;
  isLoading: boolean;
}
