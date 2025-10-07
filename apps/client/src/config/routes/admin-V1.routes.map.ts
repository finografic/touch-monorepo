import type React from 'react';
import { AdminLanguagesPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminSoundPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundPage';
import { AdminSoundBasicPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundBasicPage';
import { AdminTranslationsPage } from 'pages/AdminPages/AdminTranslationsPage/AdminTranslationsPage';
import { AdminUiLabelsPage } from 'pages/AdminPages/AdminUiLabelsPage';
import { AdminOrdersPage } from 'pages/AdminPages/AdminOrdersPage/AdminOrdersPage';
import { AdminFilterAnalysisPage } from 'pages/AdminPages/AdminFilterAnalysisPage';
import { AdminSlotsConfigPage } from 'pages/AdminPages/AdminSlotsConfigPage/AdminSlotsConfigPage';
import {
  EditIcon,
  LanguageIcon,
  MagnifyingGlassIcon,
  SettingsIcon,
  UserShildIcon,
  ZapIcon,
} from 'styles/icons';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';
import { AdminLanguagesBasicPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesBasicPage';
import { AdminRelaysPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysPage';
import { AdminRelaysBasicPage } from 'pages/AdminPages/AdminRelaysPage/AdminRelaysBasicPage';

export type AuthRoles = 'public' | 'auth' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  key: string;
  path: string;
  element: Record<AuthRoles, React.ComponentType | null>;
}

/** Properties for navigation items */
interface AdminNavItem {
  showInNav: true;
  navLabel: string;
  navIcon: React.ComponentType<any>;
}

/** Properties for dashboard cards */
interface AdminDashboardCard {
  showOnDashboard: true;
  cardTitle: string;
  cardDescription: Record<AuthRoles, string | null>;
  cardColor: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
}

/** Main admin route entry interface - composed of base + optional consumer-specific properties */
export interface AdminRouteEntry extends AdminRouteBase {
  showInNav?: boolean;
  navLabel?: string;
  navIcon?: React.ComponentType<any>;
  showOnDashboard?: boolean;
  cardTitle?: string;
  cardDescription?: Record<AuthRoles, string | null>;
  cardColor?: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
}

export const ADMIN_ENTRIES: AdminRouteEntry[] = [
  // PUBLIC ENTRIES (visible to everyone)
  {
    key: 'languages',
    path: '/admin/languages',
    element: {
      public: AdminLanguagesBasicPage,
      auth: AdminLanguagesPage,
      admin: AdminLanguagesPage,
    },
    showInNav: true,
    navLabel: 'Languages',
    navIcon: LanguageIcon,
    showOnDashboard: true,
    cardTitle: 'Gestión de idiomas',
    cardDescription: {
      public: 'Seleccionar idioma por defecto',
      auth: 'Configurar idiomas del sistema y localización',
      admin: 'Configurar idiomas del sistema y localización',
    },
    cardColor: 'green',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: {
      public: AdminSoundBasicPage,
      auth: AdminSoundPage,
      admin: AdminSoundPage,
    },
    showInNav: true,
    navLabel: 'Sounds',
    navIcon: SpeakerLoudIcon,
    showOnDashboard: true,
    cardTitle: 'Sound Management',
    cardDescription: {
      public: 'Upload and configure sound files for timer events',
      auth: 'Upload and configure sound files for timer events',
      admin: 'Upload and configure sound files for timer events',
    },
    cardColor: 'indigo',
  },

  // AUTHENTICATED ENTRIES (only visible when logged in)
  {
    key: 'translations',
    path: '/admin/translations',
    element: {
      public: null,
      auth: AdminTranslationsPage,
      admin: AdminTranslationsPage,
    },
    showInNav: true,
    navLabel: 'Gestión de traducciones',
    navIcon: EditIcon,
    showOnDashboard: true,
    cardTitle: 'Gestión de traducciones',
    cardDescription: {
      public: null,
      auth: 'Editar traducciones para contenido de base de datos',
      admin: 'Editar traducciones para contenido de base de datos',
    },
    cardColor: 'blue',
  },
  {
    key: 'uiLabels',
    path: '/admin/ui-labels',
    element: {
      public: null,
      auth: AdminUiLabelsPage,
      admin: AdminUiLabelsPage,
    },
    showInNav: true,
    navLabel: 'UI Labels / Translations',
    navIcon: EditIcon,
    showOnDashboard: true,
    cardTitle: 'UI Labels / Translations',
    cardDescription: {
      public: null,
      auth: 'Edit user interface labels and translations from local files',
      admin: 'Edit user interface labels and translations from local files',
    },
    cardColor: 'purple',
  },
  {
    key: 'mode',
    path: '/admin/mode',
    element: {
      public: AdminSlotsConfigPage,
      auth: null,
      admin: null,
    },
    showInNav: true,
    navLabel: 'Modo',
    navIcon: UserShildIcon,
    showOnDashboard: true,
    cardTitle: 'Modo',
    cardDescription: {
      public: 'Seleccionar modo por defecto',
      auth: null,
      admin: null,
    },
    cardColor: 'blue',
  },
  {
    key: 'maintenance',
    path: '/admin/maintenance',
    element: {
      public: AdminSlotsConfigPage,
      auth: null,
      admin: null,
    },
    showInNav: true,
    navLabel: 'Mantenimiento',
    navIcon: SettingsIcon,
    showOnDashboard: true,
    cardTitle: 'Mantenimiento',
    cardDescription: {
      public: 'Gestionar mantenimiento',
      auth: null,
      admin: null,
    },
    cardColor: 'orange',
  },
  {
    key: 'slotConfig',
    path: '/admin/slot-config',
    element: {
      public: null,
      auth: AdminSlotsConfigPage,
      admin: AdminSlotsConfigPage,
    },
    showInNav: true,
    navLabel: 'Gestión de configuración',
    navIcon: UserShildIcon,
    showOnDashboard: true,
    cardTitle: 'Cuadrícula',
    cardDescription: {
      public: null,
      auth: 'Configure MainPage grid layout and slot types',
      admin: 'Configure MainPage grid layout and slot types',
    },
    cardColor: 'orange',
  },
  {
    key: 'relays',
    path: '/admin/relays',
    element: {
      public: AdminRelaysBasicPage,
      auth: AdminRelaysPage,
      admin: AdminRelaysPage,
    },
    showInNav: true,
    navLabel: 'Gestión de relays',
    navIcon: ZapIcon,
    showOnDashboard: true,
    cardTitle: 'Relays',
    cardDescription: {
      public: 'Configure relay settings',
      auth: 'Configure MainPage grid layout and slot types',
      admin: 'Configure MainPage grid layout and slot types',
    },
    cardColor: 'purple',
  },
  {
    key: 'filterAnalysis',
    path: '/admin/filter-analysis',
    element: {
      public: null,
      auth: AdminFilterAnalysisPage,
      admin: AdminFilterAnalysisPage,
    },
    showInNav: true,
    navLabel: 'Filter Analysis',
    navIcon: MagnifyingGlassIcon,
    showOnDashboard: true,
    cardTitle: 'Filter Analysis',
    cardDescription: {
      public: null,
      auth: 'Analyze orders data and filtering behavior',
      admin: 'Analyze orders data and filtering behavior',
    },
    cardColor: 'blue',
  },
  {
    key: 'orders',
    path: '/admin/orders',
    element: {
      public: null,
      auth: AdminOrdersPage,
      admin: AdminOrdersPage,
    },
    showInNav: true,
    navLabel: 'Orders',
    navIcon: UserShildIcon,
    showOnDashboard: true,
    cardTitle: 'Order Management',
    cardDescription: {
      public: null,
      auth: 'View and manage customer orders',
      admin: 'View and manage customer orders',
    },
    cardColor: 'blue',
  },
];
