import { useButtonOperations } from 'hooks/button-operations';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { useButtonNavigation } from 'hooks/useButtonNavigation';

/**
 * Facade hook that provides a unified interface for button operations
 * This hides the complexity of the three separate button hooks
 */
export const useButtons = () => {
  const { footerButtons, contentButtons } = useButtonConfig();
  const { handleNavigateBack, handleNavigateNext, isNavigationPending } = useButtonNavigation();

  const {
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleStartProductProcess,
    handleProgramTime,
    handleProgramProduct,
    handleRepeatSelection,
  } = useButtonOperations();

  // Unified button click handler
  const handleButtonClick = (actionType: string) => {
    switch (actionType) {
      case 'navigate-back':
        return handleNavigateBack();
      case 'navigate-next':
        return handleNavigateNext();
      case 'program-product':
        return handleProgramProduct();
      case 'clear-completed':
        return handleClearCompleted();
      case 'cancel-completed':
        return handleCancelCompleted();
      case 'select-all':
        return handleSelectAll();
      case 'start-process':
        return handleStartProductProcess();
      case 'program-time':
        return handleProgramTime();
      case 'repeat-selection':
        return handleRepeatSelection();
      default:
        console.warn(`Unknown action type: ${actionType}`);
    }
  };

  return {
    // Button state
    footerButtons,
    contentButtons,

    // Button handlers
    handleButtonClick,

    // Loading state
    isNavigationPending,

    // Individual handlers for direct access if needed
    handleNavigateBack,
    handleNavigateNext,
    handleProgramProduct,
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleStartProductProcess,
    handleProgramTime,
    handleRepeatSelection,
  };
};
