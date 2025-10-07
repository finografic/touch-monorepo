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
  hasNav?: Record<AuthRoles, boolean>;
  navLabel?: string;
  navIcon?: React.ComponentType<any>;
  hasCard?: Record<AuthRoles, boolean>;
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
    hasNav: { public: true, auth: true, admin: true },
    navLabel: 'Languages',
    navIcon: LanguageIcon,
    hasCard: { public: true, auth: true, admin: true },
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
    hasNav: { public: true, auth: true, admin: true },
    navLabel: 'Sounds',
    navIcon: SpeakerLoudIcon,
    hasCard: { public: true, auth: true, admin: true },
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
    hasNav: { public: false, auth: true, admin: true },
    navLabel: 'Gestión de traducciones',
    navIcon: EditIcon,
    hasCard: { public: false, auth: true, admin: true },
    cardColor: 'blue',
  },
  {
    key: 'ui-labels',
    path: '/admin/ui-labels',
    element: {
      public: null,
      auth: AdminUiLabelsPage,
      admin: AdminUiLabelsPage,
    },
    hasNav: { public: false, auth: true, admin: true },
    navLabel: 'UI Labels / Translations',
    navIcon: EditIcon,
    hasCard: { public: false, auth: true, admin: true },
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
    hasNav: { public: true, auth: false, admin: false },
    navLabel: 'Modo',
    navIcon: UserShildIcon,
    hasCard: { public: true, auth: false, admin: false },
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
    hasNav: { public: true, auth: false, admin: false },
    navLabel: 'Mantenimiento',
    navIcon: SettingsIcon,
    hasCard: { public: true, auth: false, admin: false },
    cardColor: 'orange',
  },
  {
    key: 'slot-config',
    path: '/admin/slot-config',
    element: {
      public: null,
      auth: AdminSlotsConfigPage,
      admin: AdminSlotsConfigPage,
    },
    hasNav: { public: false, auth: true, admin: true },
    navLabel: 'Gestión de configuración',
    navIcon: UserShildIcon,
    hasCard: { public: false, auth: true, admin: true },
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
    hasNav: { public: true, auth: true, admin: true },
    navLabel: 'Gestión de relays',
    navIcon: ZapIcon,
    hasCard: { public: true, auth: true, admin: true },
    cardColor: 'purple',
  },
  {
    key: 'filter-analysis',
    path: '/admin/filter-analysis',
    element: {
      public: null,
      auth: AdminFilterAnalysisPage,
      admin: AdminFilterAnalysisPage,
    },
    hasNav: { public: false, auth: true, admin: true },
    navLabel: 'Filter Analysis',
    navIcon: MagnifyingGlassIcon,
    hasCard: { public: false, auth: true, admin: true },
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
    hasNav: { public: false, auth: true, admin: true },
    navLabel: 'Orders',
    navIcon: UserShildIcon,
    hasCard: { public: false, auth: true, admin: true },
    cardColor: 'blue',
  },
];
