/**
 * @deprecated This file is kept for backward compatibility.
 * The implementation has been refactored into separate flow-based hooks.
 *
 * New location: hooks/button-operations/
 * - useMainPageOperations: Timer management, selection, repeat configuration
 * - useTimeFlowOperations: Program time, start time process, cancel time session
 * - useProductFlowOperations: Program product, start/finish product process, cancel product session
 *
 * Please import from 'hooks/button-operations' instead:
 * import { useButtonOperations } from 'hooks/button-operations';
 */

export { useButtonOperations } from './button-operations';
export { useMainPageOperations, useProductFlowOperations, useTimeFlowOperations } from './button-operations';
export type { OperationActionType } from './button-operations/button-operations.types';
