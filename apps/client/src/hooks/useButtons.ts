import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useButtonOperations } from 'hooks/useButtonOperations';
import { useButtonConfig } from 'hooks/useButtonConfig';

/**
 * Facade hook that provides a unified interface for button operations
 * This hides the complexity of the three separate button hooks
 */
export const useButtons = () => {
  const { footerButtons, contentButtons } = useButtonConfig();

  const { handleNavigateBack, handleNavigateNext, handleProgramProduct, isNavigationPending } =
    useButtonNavigation();

  const {
    handleClearCompleted,
    handleCancelCompleted,
    handleSelectAll,
    handleStartProcess,
    handleProgramTime,
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
        return handleStartProcess();
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
    handleStartProcess,
    handleProgramTime,
    handleRepeatSelection,
  };
};
