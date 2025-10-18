// Simple TypeScript-based messages (no ParaglideJS dependency for now)
export const messages = {
  // App-level messages
  title: 'Servi Fresc',
  tagline: 'Perfect Temperature Service',
  description: 'Temperature control system for beverages',

  // Pages
  pages: {
    main: {
      title: 'Main',
      description: 'Main page',
    },
    drinkType: {
      title: 'Drink Types',
      description: 'Select drink type',
    },
    drinkSubtypes: {
      title: 'Drink Subtypes',
      description: 'Select drink subtype',
    },
    volumes: {
      title: 'Volumes',
      description: 'Select volume',
    },
    temperature: {
      title: 'Temperature',
      description: 'Select temperature',
    },
    orders: {
      title: 'Orders',
      description: 'View orders',
    },
  },

  // Admin messages
  admin: {
    title: 'Admin Panel',
    description: 'Manage system configurations, translations and settings',
    pages: {
      dashboard: {
        title: 'Dashboard',
        description: 'System overview',
      },
      translations: {
        title: 'Translation Management',
        description: 'Edit translations for database content',
        card: {
          title: 'Translation Management',
          description: 'Edit translations for database content',
        },
      },
      languages: {
        title: 'Language Management',
        description: 'Configure system languages and localization',
        card_public: {
          title: 'Language Selection',
          description: 'Select default language',
        },
      },
      orders: {
        title: 'Configuration Management',
        description: 'Configure system languages and localization',
      },
      uiLabels: {
        title: 'UI Labels / Translations',
        description: 'Edit user interface labels and translations from local files',
      },
      slotConfig: {
        title: 'Grid',
        description: 'Configure MainPage grid layout and slot types',
      },
      filterAnalysis: {
        title: 'Filter Analysis',
        description: 'Analyze orders data and filtering behavior',
      },
      sounds: {
        title: 'Sound Management',
        description: 'Upload and configure sound files for timer events',
      },
      mode: {
        title: 'Mode',
        description: 'Select default mode',
        card_public: {
          title: 'Mode',
          description: 'Select default mode',
        },
      },
      relays: {
        title: 'Relays',
        description: 'Manage relays',
      },
      maintenance: {
        title: 'Maintenance',
        description: 'Manage general maintenance',
        card_public: {
          title: 'Maintenance',
          description: 'Manage maintenance',
        },
      },
    },
  },
};

export type MessagesEnGB = typeof messages;
