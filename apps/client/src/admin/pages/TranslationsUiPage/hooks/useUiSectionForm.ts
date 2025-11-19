import { useCallback, useState } from 'react';

import { useToast } from 'components/Toast';

interface UseUiSectionFormOptions<TResponse = unknown> {
  sectionKey: string;
  isDirty: boolean;
  onReset: () => void;
  onSubmit: () => Promise<TResponse>;
  showToast?: boolean; // Optional: enable/disable toast notifications
}

interface UseUiSectionFormResult {
  isDirty: boolean;
  isSaving: boolean;
  statusMessage: string | null;
  statusType: 'success' | 'error' | null;
  handleReset: () => void;
  handleSubmit: () => Promise<void>;
}

export const useUiSectionForm = <TResponse = unknown>({
  sectionKey,
  isDirty,
  onReset,
  onSubmit,
  showToast = true,
}: UseUiSectionFormOptions<TResponse>): UseUiSectionFormResult => {
  const { toast } = useToast();
  const [isSaving, setIsSaving] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [statusType, setStatusType] = useState<'success' | 'error' | null>(null);

  const handleReset = useCallback(() => {
    onReset();
    setStatusMessage(null);
    setStatusType(null);
  }, [onReset]);

  const handleSubmit = useCallback(async () => {
    if (!isDirty || isSaving) {
      return;
    }

    setIsSaving(true);

    try {
      const response = await onSubmit();
      const filesUpdated = (response as any)?.data?.filesUpdated?.length ?? 0;

      const successMessage =
        filesUpdated > 0
          ? `Section "${sectionKey}" saved (${filesUpdated} file${filesUpdated === 1 ? '' : 's'} updated)`
          : `Section "${sectionKey}" saved`;

      setStatusType('success');
      setStatusMessage(successMessage);

      if (showToast) {
        toast({
          variant: 'success',
          message: successMessage,
        });
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to save section';
      setStatusType('error');
      setStatusMessage(errorMessage);

      if (showToast) {
        toast({
          variant: 'error',
          message: `Failed to save "${sectionKey}"`,
          subText: errorMessage,
        });
      }
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, onSubmit, sectionKey, showToast, toast]);

  return {
    isDirty,
    isSaving,
    statusMessage,
    statusType,
    handleReset,
    handleSubmit,
  };
};
