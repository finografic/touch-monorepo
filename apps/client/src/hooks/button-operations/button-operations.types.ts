/**
 * Shared types for button operations
 */

import type { ButtonActionValue } from 'types/button.types';

/**
 * Operation actions are all button action values EXCEPT navigation actions.
 * Navigation actions (navigate-back, navigate-next) are handled separately.
 */
export type OperationActionType = Exclude<ButtonActionValue, 'navigate-back' | 'navigate-next'>;

export interface OperationState {
  isDisabled: boolean;
  isLoading: boolean;
}
