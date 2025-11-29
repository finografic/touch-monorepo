import { BUTTON_ACTION } from 'types/button.types';
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
      case BUTTON_ACTION.NAVIGATE_BACK:
        return handleNavigateBack();
      case BUTTON_ACTION.NAVIGATE_NEXT:
        return handleNavigateNext();
      case BUTTON_ACTION.PROGRAM_PRODUCT:
        return handleProgramProduct();
      case BUTTON_ACTION.CLEAR_COMPLETED:
        return handleClearCompleted();
      case BUTTON_ACTION.CANCEL_COMPLETED:
        return handleCancelCompleted();
      case BUTTON_ACTION.SELECT_ALL:
        return handleSelectAll();
      case BUTTON_ACTION.START_PROCESS:
        return handleStartProductProcess();
      case BUTTON_ACTION.PROGRAM_TIME:
        return handleProgramTime();
      case BUTTON_ACTION.REPEAT_SELECTION:
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
