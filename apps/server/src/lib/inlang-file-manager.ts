/**
 * Inlang File Manager - Server-Side
 *
 * Direct file manipulation utility that understands Inlang message format
 * Works with both flat messages and variant messages
 *
 * Located in server since it needs file system access
 */

import { findProjectRoot } from '@finografic/project-scripts/utils';

import { existsSync } from 'fs';
import { readFile, writeFile } from 'fs/promises';
import { join } from 'path';

// Path to Inlang message files
const rootDir = findProjectRoot();
const MESSAGES_BASE_PATH = join(rootDir, 'apps/client/messages');

// Message file structure: messages/{folder}/{locale}.json
const MESSAGE_FOLDERS = ['app', 'admin', 'shared'] as const;
type MessageFolder = (typeof MESSAGE_FOLDERS)[number];
type MessagesLocaleSection = Record<Locale, Record<string, any>>;

// Supported locales - should match project.inlang/settings.json
const SUPPORTED_LOCALES = ['en-GB', 'es-ES', 'ca-ES'] as const;
type Locale = (typeof SUPPORTED_LOCALES)[number];

/**
 * Section metadata for UI display
 */
const SECTION_METADATA: Record<string, { title: string; description: string }> = {
  dashboard: {
    title: 'Dashboard',
    description: 'Dashboard titles and descriptions',
  },
  items: {
    title: 'Items',
    description: 'Items management translations',
  },
  languages: {
    title: 'Languages',
    description: 'Language management translations',
  },
  maintenance: {
    title: 'Maintenance',
    description: 'Maintenance related translations',
  },
  mode: {
    title: 'Mode',
    description: 'Mode selection translations',
  },
  relays: {
    title: 'Relays',
    description: 'Relay management translations',
  },
  slot_config: {
    title: 'Slot Configuration',
    description: 'Slot configuration translations',
  },
  sounds: {
    title: 'Sounds',
    description: 'Sound management translations',
  },
  translations: {
    title: 'Translations',
    description: 'Translation management translations',
  },
  ui_labels: {
    title: 'UI Labels',
    description: 'User interface labels',
  },
};

/**
 * Read all messages from Inlang files
 * Returns data compatible with your existing API format
 */
export async function getInlangMessagesFromFiles() {
  const sections: Record<string, any> = {};

  // Read all message files
  for (const folder of MESSAGE_FOLDERS) {
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = join(MESSAGES_BASE_PATH, folder, `${locale}.json`);

      if (!existsSync(filePath)) {
        console.warn(`[Inlang File Manager] File not found: ${filePath}`);
        continue;
      }

      try {
        const fileContent = await readFile(filePath, 'utf-8');
        const messages = JSON.parse(fileContent);

        // Process each message in the file
        for (const [messageId, messageValue] of Object.entries(messages)) {
          // Skip schema
          if (messageId === '$schema') continue;

          // Handle variant messages (array format)
          if (Array.isArray(messageValue)) {
            // Variant message: [{ selectors: [...], match: {...} }]
            const variant = messageValue[0];
            if (variant?.selectors && variant?.match) {
              // Extract section from message ID
              // Example: "admin_dashboard" -> namespace: "admin", section: "dashboard"
              const parts = messageId.split('_');
              const namespace = parts[0]; // "admin"
              const sectionKey = parts.slice(1).join('_') || 'other'; // "dashboard"

              // Process variant matches
              for (const [matchKey, matchValue] of Object.entries(variant.match)) {
                // Parse match key: "element=title, role=admin"
                const matchParts = matchKey.split(',').map((s) => s.trim());
                const elementMatch = matchParts.find((p) => p.startsWith('element='));
                const roleMatch = matchParts.find((p) => p.startsWith('role='));

                const element = elementMatch?.split('=')[1] || 'value';
                const role = roleMatch?.split('=')[1] || 'default';

                // Create item key from element
                const itemKey = element;

                // Create section key (group by namespace, section, and role)
                const fullSectionKey = `${namespace}_${sectionKey}_${role}`;

                if (!sections[fullSectionKey]) {
                  const metadata = SECTION_METADATA[sectionKey] || {
                    title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
                    description: `${sectionKey} related translations`,
                  };

                  sections[fullSectionKey] = {
                    key: sectionKey,
                    namespace,
                    role,
                    title: `${metadata.title} (${role})`,
                    description: metadata.description,
                    items: [],
                  };
                }

                // Find or create item
                let item = sections[fullSectionKey].items.find((i: any) => i.key === itemKey);
                if (!item) {
                  item = {
                    key: itemKey,
                    values: {},
                  };
                  sections[fullSectionKey].items.push(item);
                }

                // Set value for this locale
                item.values[locale] = matchValue as string;
              }
            }
          } else if (typeof messageValue === 'string') {
            // Flat message: "admin_items_title": "Records Management"
            const parts = messageId.split('_');
            const namespace = parts[0]; // "admin"
            const sectionKey = parts[1] || 'other'; // "items"
            const itemKey = parts.slice(2).join('_') || parts[parts.length - 1]; // "title"

            const fullSectionKey = `${namespace}_${sectionKey}`;

            if (!sections[fullSectionKey]) {
              const metadata = SECTION_METADATA[sectionKey] || {
                title: sectionKey.charAt(0).toUpperCase() + sectionKey.slice(1),
                description: `${sectionKey} related translations`,
              };

              sections[fullSectionKey] = {
                key: sectionKey,
                namespace,
                title: `${namespace} ${metadata.title}`,
                description: metadata.description,
                items: [],
              };
            }

            // Find or create item
            let item = sections[fullSectionKey].items.find((i: any) => i.key === itemKey);
            if (!item) {
              item = {
                key: itemKey,
                values: {},
              };
              sections[fullSectionKey].items.push(item);
            }

            // Set value for this locale
            item.values[locale] = messageValue;
          }
        }
      } catch (error) {
        console.error(`[Inlang File Manager] Error reading ${filePath}:`, error);
      }
    }
  }

  return {
    sections: Object.values(sections).sort((a: any, b: any) => {
      // Sort by namespace, then section key
      if (a.namespace !== b.namespace) {
        return a.namespace.localeCompare(b.namespace);
      }
      return a.key.localeCompare(b.key);
    }),
  };
}

/**
 * Save messages to Inlang files
 * Handles both flat and variant message formats
 */
export async function saveInlangMessagesToFiles(data: {
  sections: Array<{
    key: string;
    items: Array<{
      key: string;
      values: Record<string, string>;
    }>;
  }>;
}) {
  const filesUpdated: string[] = [];

  // Group messages by namespace and locale
  const messagesByFolderAndLocale: Record<MessageFolder, MessagesLocaleSection> = {
    app: {} as MessagesLocaleSection,
    admin: {} as MessagesLocaleSection,
    shared: {} as MessagesLocaleSection,
  };

  // Initialize structure
  for (const folder of MESSAGE_FOLDERS) {
    for (const locale of SUPPORTED_LOCALES) {
      messagesByFolderAndLocale[folder][locale] = {
        $schema: 'https://inlang.com/schema/inlang-message-format',
      };
    }
  }

  // Process sections and items
  for (const section of data.sections) {
    // Determine namespace from section structure
    // Sections may have format: "dashboard", "dashboard_admin", "dashboard_public"
    let namespace: MessageFolder = 'admin'; // Default
    let sectionKey = section.key;
    let role: string | null = null;

    // Check if section key includes namespace prefix
    if (sectionKey.startsWith('app_')) {
      namespace = 'app';
      sectionKey = sectionKey.replace('app_', '');
    } else if (sectionKey.startsWith('shared_')) {
      namespace = 'shared';
      sectionKey = sectionKey.replace('shared_', '');
    } else if (sectionKey.startsWith('admin_')) {
      namespace = 'admin';
      sectionKey = sectionKey.replace('admin_', '');
    }

    // Check if this is a variant message (has role suffix)
    const roleMatch = sectionKey.match(/_([^_]+)$/);
    if (roleMatch && ['admin', 'public'].includes(roleMatch[1])) {
      role = roleMatch[1];
      sectionKey = sectionKey.replace(`_${role}`, '');
    }

    if (role) {
      // Variant message format
      const messageId = `${namespace}_${sectionKey}`;

      // Build variant structure
      for (const locale of SUPPORTED_LOCALES) {
        if (!messagesByFolderAndLocale[namespace][locale][messageId]) {
          messagesByFolderAndLocale[namespace][locale][messageId] = [
            {
              selectors: ['element', 'role'],
              match: {},
            },
          ];
        }

        const variant = messagesByFolderAndLocale[namespace][locale][messageId][0];

        // Add matches for each item
        for (const item of section.items) {
          const matchKey = `element=${item.key}, role=${role}`;
          const value = item.values[locale] || '';
          if (value) {
            variant.match[matchKey] = value;
          }
        }
      }
    } else {
      // Flat message format
      for (const item of section.items) {
        const messageId = `${namespace}_${sectionKey}_${item.key}`;

        for (const locale of SUPPORTED_LOCALES) {
          const value = item.values[locale] || '';
          if (value) {
            messagesByFolderAndLocale[namespace][locale][messageId] = value;
          }
        }
      }
    }
  }

  // Write files
  for (const folder of MESSAGE_FOLDERS) {
    for (const locale of SUPPORTED_LOCALES) {
      const filePath = join(MESSAGES_BASE_PATH, folder, `${locale}.json`);

      try {
        // Read existing file to preserve other messages
        let existingMessages: Record<string, any> = {
          $schema: 'https://inlang.com/schema/inlang-message-format',
        };

        if (existsSync(filePath)) {
          const existingContent = await readFile(filePath, 'utf-8');
          existingMessages = JSON.parse(existingContent);
        }

        // Merge with new messages (new messages take precedence)
        const updatedMessages = {
          ...existingMessages,
          ...messagesByFolderAndLocale[folder][locale],
        };

        // Write back to file
        await writeFile(filePath, `${JSON.stringify(updatedMessages, null, 2)}\n`, 'utf-8');

        filesUpdated.push(`${folder}/${locale}.json`);
      } catch (error) {
        console.error(`[Inlang File Manager] Error writing ${filePath}:`, error);
        throw error;
      }
    }
  }

  return {
    message: `Successfully updated ${filesUpdated.length} translation files`,
    filesUpdated,
  };
}
