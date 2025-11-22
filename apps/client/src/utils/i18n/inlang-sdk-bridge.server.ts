/**
 * Inlang SDK Bridge - Server-Side Version
 *
 * For use in Node.js/server environments where you have direct file system access
 * This is more reliable than client-side SDK for file operations
 *
 * Use this in your server handlers instead of direct file I/O
 */

import type { InlangProject } from '@inlang/sdk';
import { loadProjectFromDirectory, saveProjectToDirectory } from '@inlang/sdk';
import { Buffer } from 'node:buffer';
import fs from 'node:fs';
import { join } from 'path';

// Project path - adjust based on your monorepo structure
const PROJECT_PATH = join(process.env.WORKSPACE_ROOT, 'apps/client/project.inlang');

/**
 * Initialize Inlang project (server-side)
 */
let inlangProject: InlangProject | null = null;

async function getInlangProject(): Promise<InlangProject> {
  if (!inlangProject) {
    inlangProject = await loadProjectFromDirectory({
      path: PROJECT_PATH,
      fs,
    });
  }
  return inlangProject;
}

/**
 * Read all messages from Inlang project
 * Returns data compatible with your existing API format
 *
 * Uses exportFiles to get messages in the file format, then processes them
 */
export async function getInlangMessages() {
  const project = await getInlangProject();

  // Export files using the message format plugin
  const exportedFiles = await project.exportFiles({
    pluginKey: 'plugin.inlang.messageFormat',
  });

  // Group by namespace (app, admin, shared) and then by section
  const sections: Record<string, any> = {};

  // Process each exported file
  for (const file of exportedFiles) {
    const messages = JSON.parse(Buffer.from(file.content).toString('utf-8'));

    // Infer namespace from first message ID in the file
    let namespace = 'shared'; // default
    for (const messageId of Object.keys(messages)) {
      if (messageId === '$schema') continue;
      const parts = messageId.split('_');
      if (parts[0] && ['app', 'admin', 'shared'].includes(parts[0])) {
        namespace = parts[0];
        break;
      }
    }

    // Process each message in the file
    for (const [messageId, messageValue] of Object.entries(messages)) {
      // Skip schema
      if (messageId === '$schema') continue;

      // Parse message ID to extract section
      // Example: "admin_dashboard_title" -> namespace: "admin", section: "dashboard", item: "title"
      const parts = messageId.split('_');
      // Use inferred namespace or from message ID
      const messageNamespace =
        parts[0] && ['app', 'admin', 'shared'].includes(parts[0]) ? parts[0] : namespace;
      const sectionKey = parts[1] || 'other';
      const itemKey = parts.slice(2).join('_') || parts[parts.length - 1];

      // Create section key that includes namespace for uniqueness
      const fullSectionKey = `${messageNamespace}_${sectionKey}`;

      if (!sections[fullSectionKey]) {
        sections[fullSectionKey] = {
          key: sectionKey, // Keep original section key for compatibility
          namespace: messageNamespace, // Add namespace for reference
          title: `${messageNamespace} ${sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1)}`,
          description: `${messageNamespace} ${sectionKey} related translations`,
          items: [],
        };
      }

      // Handle variant messages (array format)
      if (Array.isArray(messageValue)) {
        // Variant message: [{ selectors: [...], match: {...} }]
        const variant = messageValue[0];
        if (variant?.selectors && variant?.match) {
          // Process variant matches
          for (const [matchKey, matchValue] of Object.entries(variant.match)) {
            // Parse match key: "element=title, role=admin"
            const matchParts = matchKey.split(',').map((s) => s.trim());
            const elementMatch = matchParts.find((p) => p.startsWith('element='));
            const element = elementMatch?.split('=')[1] || 'value';

            // Create item key from element
            const variantItemKey = element;

            // Find or create item
            let item = sections[fullSectionKey].items.find((i: any) => i.key === variantItemKey);
            if (!item) {
              item = {
                key: variantItemKey,
                values: {},
              };
              sections[fullSectionKey].items.push(item);
            }

            // Use locale from file
            const locale = file.locale;
            if (locale) {
              item.values[locale] = matchValue as string;
            }
          }
        }
      } else if (typeof messageValue === 'string') {
        // Regular message (string value)
        // Find or create item
        let item = sections[fullSectionKey].items.find((i: any) => i.key === itemKey);
        if (!item) {
          item = {
            key: itemKey,
            values: {},
          };
          sections[fullSectionKey].items.push(item);
        }

        // Use locale from file
        const locale = file.locale;
        if (locale) {
          item.values[locale] = messageValue as string;
        }
      }
    }
  }

  return {
    sections: Object.values(sections),
  };
}

/**
 * Save messages to Inlang project (server-side)
 *
 * Uses importFiles to update messages in the file format
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
  const project = await getInlangProject();
  const filesUpdated: string[] = [];

  // Get current exported files to preserve existing structure
  const currentFiles = await project.exportFiles({
    pluginKey: 'plugin.inlang.messageFormat',
  });

  // Build a map of files by locale and namespace
  const filesByLocaleAndNamespace: Record<string, Record<string, any>> = {};

  // Initialize from current files
  for (const file of currentFiles) {
    const locale = file.locale || '';
    // Extract namespace from file name or infer from content
    // File names from Inlang are typically just locale, so we need to parse the content
    const messages = JSON.parse(Buffer.from(file.content).toString('utf-8'));
    let namespace = 'shared'; // default

    // Try to infer namespace from first message ID
    for (const messageId of Object.keys(messages)) {
      if (messageId === '$schema') continue;
      const parts = messageId.split('_');
      if (parts[0] && ['app', 'admin', 'shared'].includes(parts[0])) {
        namespace = parts[0];
        break;
      }
    }

    if (!filesByLocaleAndNamespace[locale]) {
      filesByLocaleAndNamespace[locale] = {};
    }

    if (!filesByLocaleAndNamespace[locale][namespace]) {
      filesByLocaleAndNamespace[locale][namespace] = JSON.parse(Buffer.from(file.content).toString('utf-8'));
    }
  }

  // Update messages from incoming data
  for (const section of data.sections) {
    // Extract namespace from section key if present
    let namespace = 'shared';
    let sectionKey = section.key;

    if (sectionKey.startsWith('app_')) {
      namespace = 'app';
      sectionKey = sectionKey.replace('app_', '');
    } else if (sectionKey.startsWith('admin_')) {
      namespace = 'admin';
      sectionKey = sectionKey.replace('admin_', '');
    } else if (sectionKey.startsWith('shared_')) {
      namespace = 'shared';
      sectionKey = sectionKey.replace('shared_', '');
    }

    for (const item of section.items) {
      // Build message ID
      const messageId = `${namespace}_${sectionKey}_${item.key}`;

      // Update for each locale
      for (const [locale, value] of Object.entries(item.values)) {
        if (!value) continue;

        if (!filesByLocaleAndNamespace[locale]) {
          filesByLocaleAndNamespace[locale] = {};
        }

        if (!filesByLocaleAndNamespace[locale][namespace]) {
          filesByLocaleAndNamespace[locale][namespace] = {
            $schema: 'https://inlang.com/schema/inlang-message-format',
          };
        }

        // Update the message in the file structure
        filesByLocaleAndNamespace[locale][namespace][messageId] = value;
      }
    }
  }

  // Import updated files
  const filesToImport = [];
  for (const [locale, namespaces] of Object.entries(filesByLocaleAndNamespace)) {
    for (const [namespace, content] of Object.entries(namespaces)) {
      filesToImport.push({
        locale,
        content: new Uint8Array(Buffer.from(JSON.stringify(content, null, 2), 'utf-8')),
      });
      filesUpdated.push(`${namespace}/${locale}.json`);
    }
  }

  // Import files back into the project
  await project.importFiles({
    pluginKey: 'plugin.inlang.messageFormat',
    files: filesToImport,
  });

  // Save the project back to directory
  await saveProjectToDirectory({
    project,
    path: PROJECT_PATH,
    fs: fs.promises,
  });

  return {
    message: `Successfully updated ${filesUpdated.length} translation files`,
    filesUpdated,
  };
}
