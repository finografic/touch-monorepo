import { useButtonConfig } from 'hooks/buttons/useButtonConfig';
import type { PadActionProps } from 'types/button.types';

interface UseButtonsReturn {
  footerButtons: PadActionProps[];
  contentButtons: PadActionProps[];
  getButtonProps: (buttonType: string) => PadActionProps;
}

/**
 * Thin wrapper around useButtonConfig.
 * Prefer importing useButtonConfig directly.
 */
export const useButtons = (): UseButtonsReturn => {
  return useButtonConfig();
};
