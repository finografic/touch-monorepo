// NOTE: ICON DEFINITIONS - Lucide icons with auto-className wrapper
// ref + search: https://lucide.dev/icons/

import * as Lucide from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ============================================================================
// ICON MAPPING - Single source of truth
// ============================================================================
// Maps exported icon names to their Lucide equivalents
// Some icons have aliases (multiple exports pointing to same Lucide icon)

const ICONS = {
  // Core UI
  AddIcon: Lucide.Plus,
  BadgeCheckIcon: Lucide.BadgeCheck,
  CheckCircleIcon: Lucide.CheckCircle2,
  ClipboardIcon: Lucide.Clipboard,
  CloseIcon: Lucide.X,
  CoffeeIcon: Lucide.Coffee,
  Columns3Icon: Lucide.Columns3,
  Columns4Icon: Lucide.Columns4,
  CountdownTimerIcon: Lucide.Hourglass,
  Cross2Icon: Lucide.X,
  DeleteIcon: Lucide.X,
  DialogIcon: Lucide.AppWindowMac,
  DropdownIcon: Lucide.ChevronDown,
  EditIcon: Lucide.PencilLine,
  ExclamationTriangleIcon: Lucide.TriangleAlert,
  EyeOffIcon: Lucide.EyeOff,
  EyeOnIcon: Lucide.Eye,
  FastForwardIcon: Lucide.FastForward,
  FullscreenIcon: Lucide.Fullscreen,
  GridIcon: Lucide.Grid3x3,
  HomeIcon: Lucide.House,
  InfoCircledIcon: Lucide.Info,
  LanguageIcon: Lucide.Languages,
  ListChecksIcon: Lucide.ListChecks,
  ListIcon: Lucide.List,
  LockIcon: Lucide.Lock,
  MagnifyingGlassIcon: Lucide.Search,
  MenuIcon: Lucide.Menu,
  MinimizeIcon: Lucide.Minimize,
  MinusIcon: Lucide.Minus,
  MoonIcon: Lucide.Moon,
  PlusIcon: Lucide.Plus,
  RadioIcon: Lucide.Radio,
  RefreshIcon: Lucide.RefreshCcw,
  ReloadIcon: Lucide.RotateCw,
  SettingsIcon: Lucide.Cog,
  ShieldCheckIcon: Lucide.ShieldCheck,
  ShuffleIcon: Lucide.Shuffle,
  SpeakerLoudIcon: Lucide.Volume2,
  StarIcon: Lucide.Star,
  StopIcon: Lucide.CircleStop,
  SunIcon: Lucide.Sun,
  TempIcon: Lucide.Thermometer,
  TextAlignLeftIcon: Lucide.AlignLeft,
  TextAlignTopIcon: Lucide.AlignStartVertical, // TODO: check this icon
  TimerIcon: Lucide.Timer,
  TimerResetIcon: Lucide.TimerReset,
  TrashIcon: Lucide.Trash2,
  UploadIcon: Lucide.Upload,
  UserCircleIcon: Lucide.CircleUserRound,
  UserIcon: Lucide.User,
  UserLockIcon: Lucide.UserLock,
  UserRoundCheckIcon: Lucide.UserRoundCheck,
  UserShieldIcon: Lucide.ShieldUser,
  VolumeIcon: Lucide.Volume2,
  VolumeOffIcon: Lucide.VolumeOff,
  WindowIcon: Lucide.AppWindowMac,
  WineIcon: Lucide.Wine,
  ZapIcon: Lucide.Zap,

  // Navigation - Chevrons
  ChevronDownIcon: Lucide.ChevronDown,
  ChevronLeftIcon: Lucide.ChevronLeft,
  ChevronRightIcon: Lucide.ChevronRight,
  ChevronUpIcon: Lucide.ChevronUp,
  DoubleArrowLeftIcon: Lucide.ChevronsLeft,
  DoubleArrowRightIcon: Lucide.ChevronsRight,

  // Panels
  PanelBottomCloseIcon: Lucide.PanelBottomClose,
  PanelBottomOpenIcon: Lucide.PanelBottomOpen,
  PanelLeftCloseIcon: Lucide.PanelLeftClose,
  PanelLeftOpenIcon: Lucide.PanelLeftOpen,
} as const;

// ============================================================================
// AUTO-GENERATE WRAPPED ICONS
// ============================================================================

type IconKeys = keyof typeof ICONS;
type WrappedIconMap = { [K in IconKeys]: ReturnType<typeof createIconWrapper> };

// Wrap all icons automatically
const wrappedIcons = Object.fromEntries(
  Object.entries(ICONS).map(([name, icon]) => [name, createIconWrapper(icon, name)]),
) as WrappedIconMap;

// ============================================================================
// NAMED EXPORTS (for tree-shaking + direct imports)
// ============================================================================

export const {
  // Core UI
  AddIcon,
  BadgeCheckIcon,
  CheckCircleIcon,
  ClipboardIcon,
  CloseIcon,
  CoffeeIcon,
  Columns3Icon,
  Columns4Icon,
  CountdownTimerIcon,
  Cross2Icon,
  DeleteIcon,
  DialogIcon,
  DropdownIcon,
  EditIcon,
  ExclamationTriangleIcon,
  EyeOffIcon,
  EyeOnIcon,
  FastForwardIcon,
  FullscreenIcon,
  GridIcon,
  HomeIcon,
  InfoCircledIcon,
  LanguageIcon,
  ListChecksIcon,
  ListIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MenuIcon,
  MinimizeIcon,
  MinusIcon,
  MoonIcon,
  PlusIcon,
  RadioIcon,
  RefreshIcon,
  ReloadIcon,
  SettingsIcon,
  ShieldCheckIcon,
  ShuffleIcon,
  SpeakerLoudIcon,
  StarIcon,
  StopIcon,
  SunIcon,
  TempIcon,
  TextAlignLeftIcon,
  TextAlignTopIcon,
  TimerIcon,
  TimerResetIcon,
  TrashIcon,
  UploadIcon,
  UserCircleIcon,
  UserIcon,
  UserLockIcon,
  UserRoundCheckIcon,
  UserShieldIcon,
  VolumeIcon,
  VolumeOffIcon,
  WindowIcon,
  WineIcon,
  ZapIcon,

  // Navigation - Chevrons
  ChevronDownIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,

  // Panels
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
} = wrappedIcons;

// ============================================================================
// ICON MAP & TYPES (for dynamic usage)
// ============================================================================

/** Auto-generated icon map from ICONS definition */
export const ICON_MAP = wrappedIcons;

/** Icon name type - all valid icon names */
export type IconName = IconKeys;

/** Icon component type */
export type IconType = WrappedIconMap[IconName];

/** Get an icon component by name (for dynamic rendering) */
export function getIconByName(iconName: IconName): IconType {
  return ICON_MAP[iconName];
}

/** Check if a string is a valid icon name */
export function isValidIconName(name: string): name is IconName {
  return name in ICON_MAP;
}

/** Get all available icon names */
export function getAvailableIconNames(): IconName[] {
  return Object.keys(ICON_MAP) as IconName[];
}
