import { useCallback, useState } from 'react';

interface UseUiSectionFormOptions<TResponse = unknown> {
  sectionKey: string;
  isDirty: boolean;
  onReset: () => void;
  onSubmit: () => Promise<TResponse>;
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
}: UseUiSectionFormOptions<TResponse>): UseUiSectionFormResult => {
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

      setStatusType('success');
      setStatusMessage(
        filesUpdated > 0
          ? `Section “${sectionKey}” saved (${filesUpdated} file${filesUpdated === 1 ? '' : 's'} updated)`
          : `Section “${sectionKey}” saved`,
      );
    } catch (error) {
      setStatusType('error');
      setStatusMessage(error instanceof Error ? error.message : 'Failed to save section');
    } finally {
      setIsSaving(false);
    }
  }, [isDirty, isSaving, onSubmit, sectionKey]);

  return {
    isDirty,
    isSaving,
    statusMessage,
    statusType,
    handleReset,
    handleSubmit,
  };
};
