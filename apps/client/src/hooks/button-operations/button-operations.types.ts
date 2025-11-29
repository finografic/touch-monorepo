/**
 * Shared types for button operations
 */

import type { ButtonActionType } from 'types/button.types';

/**
 * Operation actions are all button actions EXCEPT navigation actions.
 * Navigation actions (navigate-back, navigate-next) are handled separately.
 */
export type OperationActionType = Exclude<ButtonActionType, 'navigate-back' | 'navigate-next'>;

export interface OperationState {
  isDisabled: boolean;
  isLoading: boolean;
}
