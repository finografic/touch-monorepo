import { useCallback } from 'react';
import { useToast } from 'components/Toast';

// ============================================================================
// Types
// ============================================================================

interface UseSaveHandlerOptions {
  onSave?: () => Promise<any>;
  /**
   * Optional: Callback after successful save
   */
  onSaveSuccess?: () => void;
  /**
   * Optional: Custom error message
   */
  errorMessage?: string;
}

// ============================================================================
// Hook
// ============================================================================

/**
 * Hook to handle save logic with error handling and toast notifications
 */
export const useSaveHandler = ({ onSave, onSaveSuccess, errorMessage = 'Failed to save translations' }: UseSaveHandlerOptions) => {
  const { toast } = useToast();

  const handleSave = useCallback(async () => {
    if (!onSave) return;

    try {
      await onSave();
      onSaveSuccess?.();
    } catch (error) {
      console.error('Failed to save:', error);
      toast({
        variant: 'error',
        message: errorMessage,
      });
    }
  }, [onSave, onSaveSuccess, errorMessage, toast]);

  return {
    handleSave,
  };
};

