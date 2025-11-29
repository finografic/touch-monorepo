import { BUTTON_TYPE } from 'types/button.types';
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
      case BUTTON_TYPE.NAVIGATE_BACK:
        return handleNavigateBack();
      case BUTTON_TYPE.NAVIGATE_NEXT:
        return handleNavigateNext();
      case BUTTON_TYPE.PROGRAM_PRODUCT:
        return handleProgramProduct();
      case BUTTON_TYPE.CLEAR_COMPLETED:
        return handleClearCompleted();
      case BUTTON_TYPE.CANCEL_SELECTED:
        return handleCancelCompleted();
      case BUTTON_TYPE.SELECT_ALL:
        return handleSelectAll();
      case BUTTON_TYPE.START_PROCESS:
        return handleStartProductProcess();
      case BUTTON_TYPE.PROGRAM_TIME:
        return handleProgramTime();
      case BUTTON_TYPE.REPEAT_SELECTION:
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
