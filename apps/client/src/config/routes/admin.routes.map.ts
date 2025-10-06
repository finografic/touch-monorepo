import type React from 'react';
import { AdminLanguagesPage } from 'pages/AdminPages/AdminLanguagesPage/AdminLanguagesPage';
import { AdminSoundPage } from 'pages/AdminPages/AdminSoundPage/AdminSoundPage';
import { EditIcon, LanguageIcon, MagnifyingGlassIcon, UserShildIcon } from 'styles/icons';
import { SpeakerLoudIcon } from '@radix-ui/react-icons';

export type Visibility = 'public' | 'authenticated' | 'admin';

/** Base properties shared by all admin route entries */
interface AdminRouteBase {
  key: string;
  path: string;
  element: React.ComponentType;
  visibility: Visibility;
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
  cardDescription: string;
  cardColor: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
}

/** Main admin route entry interface - composed of base + optional consumer-specific properties */
export interface AdminRouteEntry extends AdminRouteBase {
  showInNav?: boolean;
  navLabel?: string;
  navIcon?: React.ComponentType<any>;
  showOnDashboard?: boolean;
  cardTitle?: string;
  cardDescription?: string;
  cardColor?: 'blue' | 'green' | 'indigo' | 'orange' | 'purple' | string;
}

export const ADMIN_ENTRIES: AdminRouteEntry[] = [
  // PUBLIC ENTRIES (visible to everyone)
  {
    key: 'languages',
    path: '/admin/languages',
    element: AdminLanguagesPage,
    visibility: 'public',
    showInNav: true,
    navLabel: 'Languages',
    navIcon: LanguageIcon,
    showOnDashboard: true,
    cardTitle: 'Gestión de idiomas',
    cardDescription: 'Configurar idiomas del sistema y localización',
    cardColor: 'green',
  },
  {
    key: 'sounds',
    path: '/admin/sounds',
    element: AdminSoundPage,
    visibility: 'public',
    showInNav: true,
    navLabel: 'Sounds',
    navIcon: SpeakerLoudIcon,
    showOnDashboard: true,
    cardTitle: 'Sound Management',
    cardDescription: 'Upload and configure sound files for timer events',
    cardColor: 'indigo',
  },

  // AUTHENTICATED ENTRIES (only visible when logged in)
  {
    key: 'translations',
    path: '/admin/translations',
    element: AdminLanguagesPage, // TODO: Replace with actual AdminTranslationsPage
    visibility: 'authenticated',
    showInNav: true,
    navLabel: 'Gestión de traducciones',
    navIcon: EditIcon,
    showOnDashboard: true,
    cardTitle: 'Gestión de traducciones',
    cardDescription: 'Editar traducciones para contenido de base de datos',
    cardColor: 'blue',
  },
  {
    key: 'ui-labels',
    path: '/admin/ui-labels',
    element: AdminLanguagesPage, // TODO: Replace with actual AdminUILabelsPage
    visibility: 'authenticated',
    showInNav: true,
    navLabel: 'UI Labels / Translations',
    navIcon: EditIcon,
    showOnDashboard: true,
    cardTitle: 'UI Labels / Translations',
    cardDescription: 'Edit user interface labels and translations from local files',
    cardColor: 'purple',
  },
  {
    key: 'slot-config',
    path: '/admin/slot-config',
    element: AdminLanguagesPage, // TODO: Replace with actual AdminSlotConfigPage
    visibility: 'authenticated',
    showInNav: true,
    navLabel: 'Gestión de configuración',
    navIcon: UserShildIcon,
    showOnDashboard: true,
    cardTitle: 'Cuadrícula',
    cardDescription: 'Configure MainPage grid layout and slot types',
    cardColor: 'orange',
  },
  {
    key: 'filter-analysis',
    path: '/admin/filter-analysis',
    element: AdminLanguagesPage, // TODO: Replace with actual AdminFilterAnalysisPage
    visibility: 'authenticated',
    showInNav: true,
    navLabel: 'Filter Analysis',
    navIcon: MagnifyingGlassIcon,
    showOnDashboard: true,
    cardTitle: 'Filter Analysis',
    cardDescription: 'Analyze orders data and filtering behavior',
    cardColor: 'blue',
  },
];
