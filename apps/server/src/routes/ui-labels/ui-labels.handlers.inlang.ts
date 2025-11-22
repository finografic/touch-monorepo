/**
 * UI Labels Handlers - Inlang Integration
 *
 * Server-side handlers that use Inlang file manager instead of direct file I/O
 * This provides a cleaner interface and better error handling
 */

import * as HttpStatusCodes from 'stoker/http-status-codes';

// Import the Inlang file manager
import { getInlangMessagesFromFiles, saveInlangMessagesToFiles } from 'lib/inlang-file-manager';
import type { AppRouteHandler } from 'types/app.types';
import type { ListRoute, SaveRoute } from './ui-labels.routes';

/**
 * List all UI labels from Inlang message files
 */
export const list: AppRouteHandler<ListRoute> = async (context) => {
  try {
    const data = await getInlangMessagesFromFiles();

    return context.json(
      {
        sections: data.sections,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('[ui-labels] Error loading UI labels from Inlang files:', error);
    return context.json(
      {
        success: false,
        message: `Failed to load UI labels: ${error instanceof Error ? error.message : 'Unknown error'}`,
      },
      HttpStatusCodes.INTERNAL_SERVER_ERROR,
    );
  }
};

/**
 * Save UI labels to Inlang message files
 */
export const save: AppRouteHandler<SaveRoute> = async (context) => {
  const data = context.req.valid('json');
  const { sections } = data;

  try {
    const result = await saveInlangMessagesToFiles({ sections });

    return context.json(
      {
        message: result.message,
        filesUpdated: result.filesUpdated,
      },
      HttpStatusCodes.OK,
    );
  } catch (error) {
    console.error('[ui-labels] Error saving UI labels to Inlang files:', error);
    return context.json(
      {
        success: false,
        error: {
          issues: [
            {
              code: 'FILE_PROCESSING_ERROR',
              path: [],
              message: `Failed to save translation files: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
          name: 'FileProcessingError',
        },
      },
      HttpStatusCodes.UNPROCESSABLE_ENTITY,
    );
  }
};
