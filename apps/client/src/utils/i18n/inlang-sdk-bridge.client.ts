/**
 * Inlang SDK Bridge - Client-Side Version
 *
 * NOTE: The Inlang SDK cannot directly access the file system from the browser.
 * This client-side bridge uses REST API calls to the server, which then uses
 * the server-side Inlang SDK bridge (inlang-sdk-bridge.server.ts) to manipulate files.
 *
 * For direct SDK usage in the browser, you would need to:
 * 1. Fetch the project.inlang directory as a blob
 * 2. Use loadProjectInMemory({ blob }) to load it
 * 3. This is complex and not recommended - use REST API instead
 *
 * This bridge provides:
 * - Same API interface as server-side bridge
 * - REST API calls that delegate to server-side Inlang SDK
 * - Fallback to REST API if SDK is unavailable
 */

/**
 * Read all messages from Inlang project via REST API
 * The server-side handler uses the Inlang SDK to read files
 */
export async function getInlangMessages() {
  // Client-side: Use REST API which delegates to server-side Inlang SDK
  const { EndpointHelper } = await import('api/api.endpoints');
  return await EndpointHelper.getUiLabels();
}

/**
 * Save messages to Inlang project via REST API
 * The server-side handler uses the Inlang SDK to write files
 */
export async function saveInlangMessages(data: {
  sections: Array<{
    key: string;
    items: Array<{
      key: string;
      values: Record<string, string>;
    }>;
  }>;
}) {
  // Client-side: Use REST API which delegates to server-side Inlang SDK
  const { EndpointHelper } = await import('api/api.endpoints');
  return await EndpointHelper.saveUiLabels(data);
}

/**
 * Hybrid approach: Use Inlang SDK but keep REST API as fallback
 * This allows gradual migration
 */
export async function getMessagesHybrid() {
  try {
    // Try Inlang SDK first
    return await getInlangMessages();
  } catch (error) {
    console.warn('[Inlang Bridge] SDK failed, falling back to REST API:', error);
    // Fallback to REST API
    const { EndpointHelper } = await import('api/api.endpoints');
    return await EndpointHelper.getUiLabels();
  }
}

export async function saveMessagesHybrid(data: Parameters<typeof saveInlangMessages>[0]) {
  try {
    // Try Inlang SDK first
    return await saveInlangMessages(data);
  } catch (error) {
    console.warn('[Inlang Bridge] SDK failed, falling back to REST API:', error);
    // Fallback to REST API
    const { EndpointHelper } = await import('api/api.endpoints');
    return await EndpointHelper.saveUiLabels(data);
  }
}
