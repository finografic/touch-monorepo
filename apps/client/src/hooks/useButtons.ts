import { BUTTON_TYPE } from 'types/button.types';
import { useButtonConfig } from 'hooks/useButtonConfig';
import { useButtonNavigation } from 'hooks/useButtonNavigation';
import { useMainPageOperations } from './button-operations/useMainPageOperations';
import { useProductFlowOperations } from './button-operations/useProductFlowOperations';
import { useTimeFlowOperations } from './button-operations/useTimeFlowOperations';

/**
 * Facade hook that provides a unified interface for button operations
 * This hides the complexity of the three separate button hooks
 */
export const useButtons = () => {
  const { footerButtons, contentButtons } = useButtonConfig();
  const { handleNavigateBack, handleNavigateNext, isNavigationPending } = useButtonNavigation();

  const { handleResetCompleted, handleCancelSelected, handleSelectAll, handleRepeatSelection } =
    useMainPageOperations();
  const { handleProgramTime } = useTimeFlowOperations();
  const { handleProgramProduct } = useProductFlowOperations();

  // Unified button click handler
  const handleButtonClick = (actionType: string, args?: any) => {
    switch (actionType) {
      // navigation buttons
      case BUTTON_TYPE.NAVIGATE_BACK:
        return handleNavigateBack();
      case BUTTON_TYPE.NAVIGATE_NEXT:
        return handleNavigateNext();

      // MainPage - bottom buttons (small)
      case BUTTON_TYPE.CANCEL_SELECTED:
        return handleCancelSelected();
      case BUTTON_TYPE.RESET_COMPLETED:
        return handleResetCompleted();
      case BUTTON_TYPE.SELECT_ALL_SLOTS:
        return handleSelectAll();

      // MainPage - right buttons (large)
      case BUTTON_TYPE.PROGRAM_TIME:
        return handleProgramTime();
      case BUTTON_TYPE.PROGRAM_PRODUCT:
        return handleProgramProduct();
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
    handleResetCompleted,
    handleCancelSelected,
    handleSelectAll,
    handleProgramTime,
    handleRepeatSelection,
  };
};
