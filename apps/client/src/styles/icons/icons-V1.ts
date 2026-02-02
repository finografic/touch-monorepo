// NOTE: ICON DEFINITIONS - Lucide icons with auto-className
// ref + search: https://lucide.dev/icons/

import {
  AlignLeft as _TextAlignLeftIcon,
  AlignStartVertical as _TextAlignTopIcon, // TODO: check this icon
  AppWindowMac as _AppWindowMacIcon,
  AppWindowMac as _WindowIcon,
  BadgeCheck as _BadgeCheckIcon,
  CheckCircle2 as _CheckCircle2Icon,
  ChevronDown as _ChevronDownIcon,
  ChevronLeft as _ChevronLeftIcon,
  ChevronRight as _ChevronRightIcon,
  ChevronsLeft as _DoubleArrowLeftIcon,
  ChevronsRight as _DoubleArrowRightIcon,
  ChevronUp as _ChevronUpIcon,
  CircleStop as _StopIcon,
  CircleUserRound as _CircleUserRoundIcon,
  Clipboard as _ClipboardIcon,
  Coffee as _CoffeeIcon,
  Cog as _SettingsIcon,
  Columns3 as _Columns3Icon,
  Columns4 as _Columns4Icon,
  Eye as _EyeIcon,
  EyeOff as _EyeOffIcon,
  FastForward as _FastForwardIcon,
  Fullscreen as _FullscreenIcon,
  Grid3x3 as _Grid3x2Icon,
  Hourglass as _CountdownTimerIcon,
  House as _HomeIcon,
  Info as _InfoCircledIcon,
  Languages as _LanguagesIcon,
  List as _ListIcon,
  ListChecks as _ListChecksIcon,
  Lock as _LockIcon,
  Menu as _HamburgerMenuIcon,
  Minimize as _MinimizeIcon,
  Minus as _MinusIcon,
  Moon as _MoonIcon,
  PanelBottomClose as _PanelBottomCloseIcon,
  PanelBottomOpen as _PanelBottomOpenIcon,
  PanelLeftClose as _PanelLeftCloseIcon,
  PanelLeftOpen as _PanelLeftOpenIcon,
  PencilLine as _EditIcon,
  Plus as _PlusIcon,
  Radio as _RadioIcon,
  RefreshCcw as _RefreshCcwIcon,
  RotateCw as _ReloadIcon,
  Search as _MagnifyingGlassIcon,
  ShieldCheck as _ShieldCheckIcon,
  ShieldUser as _ShieldUserIcon,
  Shuffle as _ShuffleIcon,
  Star as _StarIcon,
  Sun as _SunIcon,
  Thermometer as _TempIcon,
  Timer as _TimerIcon,
  TimerReset as _TimerResetIcon,
  Trash2 as _Trash2Icon,
  TriangleAlert as _ExclamationTriangleIcon,
  Upload as _UploadIcon,
  User as _UserIcon,
  UserLock as _UserLockIcon,
  UserRoundCheck as _UserRoundCheckIcon,
  Volume2 as _SpeakerLoudIcon,
  Volume2 as _Volume2Icon,
  VolumeOff as _VolumeOffIcon,
  Wine as _WineIcon,
  X as _Cross2Icon,
  X as _DeleteIcon,
  Zap as _ZapIcon,
} from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ============================================================================
// ICON EXPORTS - Enhanced with auto-className
// ============================================================================

// Core Lucide Icons - with semantic export names
export const CountdownTimerIcon = createIconWrapper(_CountdownTimerIcon, 'CountdownTimerIcon');
export const Cross2Icon = createIconWrapper(_Cross2Icon, 'Cross2Icon');
export const DialogIcon = createIconWrapper(_AppWindowMacIcon, 'DialogIcon');
export const ExclamationTriangleIcon = createIconWrapper(_ExclamationTriangleIcon, 'ExclamationTriangleIcon');
export const ReloadIcon = createIconWrapper(_ReloadIcon, 'ReloadIcon');
export const ShieldCheckIcon = createIconWrapper(_ShieldCheckIcon, 'ShieldCheckIcon');
export const StarIcon = createIconWrapper(_StarIcon, 'StarIcon');
export const TextAlignLeftIcon = createIconWrapper(_TextAlignLeftIcon, 'TextAlignLeftIcon');
export const TextAlignTopIcon = createIconWrapper(_TextAlignTopIcon, 'TextAlignTopIcon');
export const TimerIcon = createIconWrapper(_TimerIcon, 'TimerIcon');

// Navigation & Buttons
export const DoubleArrowLeftIcon = createIconWrapper(_DoubleArrowLeftIcon, 'DoubleArrowLeftIcon');
export const DoubleArrowRightIcon = createIconWrapper(_DoubleArrowRightIcon, 'DoubleArrowRightIcon');
export const FullscreenIcon = createIconWrapper(_FullscreenIcon, 'FullscreenIcon');
export const MinimizeIcon = createIconWrapper(_MinimizeIcon, 'MinimizeIcon');

// Common Aliases - these get semantic names, not original names
export const CloseIcon = createIconWrapper(_Cross2Icon, 'CloseIcon');
export const DropdownIcon = createIconWrapper(_ChevronDownIcon, 'DropdownIcon');
export const MenuIcon = createIconWrapper(_HamburgerMenuIcon, 'MenuIcon');

// Lucide Icons - UI Elements
export const CoffeeIcon = createIconWrapper(_CoffeeIcon, 'CoffeeIcon');
export const LanguageIcon = createIconWrapper(_LanguagesIcon, 'LanguageIcon');
export const MoonIcon = createIconWrapper(_MoonIcon, 'MoonIcon');
export const SunIcon = createIconWrapper(_SunIcon, 'SunIcon');
export const TempIcon = createIconWrapper(_TempIcon, 'TempIcon');
export const WindowIcon = createIconWrapper(_WindowIcon, 'WindowIcon');
export const WineIcon = createIconWrapper(_WineIcon, 'WineIcon');

// Admin & Actions
export const AddIcon = createIconWrapper(_PlusIcon);
export const BadgeCheckIcon = createIconWrapper(_BadgeCheckIcon);
export const CheckCircleIcon = createIconWrapper(_CheckCircle2Icon);
export const ChevronLeftIcon = createIconWrapper(_ChevronLeftIcon);
export const ChevronRightIcon = createIconWrapper(_ChevronRightIcon);
export const ChevronUpIcon = createIconWrapper(_ChevronUpIcon);
export const ChevronDownIcon = createIconWrapper(_ChevronDownIcon);
export const ClipboardIcon = createIconWrapper(_ClipboardIcon);
export const DeleteIcon = createIconWrapper(_DeleteIcon);
export const EditIcon = createIconWrapper(_EditIcon);
export const FastForwardIcon = createIconWrapper(_FastForwardIcon);
export const GridIcon = createIconWrapper(_Grid3x2Icon);
export const HomeIcon = createIconWrapper(_HomeIcon);
export const InfoCircledIcon = createIconWrapper(_InfoCircledIcon);
export const ListIcon = createIconWrapper(_ListIcon);
export const ListChecksIcon = createIconWrapper(_ListChecksIcon);
export const LockIcon = createIconWrapper(_LockIcon);
export const MagnifyingGlassIcon = createIconWrapper(_MagnifyingGlassIcon);
export const PanelBottomCloseIcon = createIconWrapper(_PanelBottomCloseIcon);
export const PanelBottomOpenIcon = createIconWrapper(_PanelBottomOpenIcon);
export const PanelLeftCloseIcon = createIconWrapper(_PanelLeftCloseIcon);
export const PanelLeftOpenIcon = createIconWrapper(_PanelLeftOpenIcon);
export const EyeOnIcon = createIconWrapper(_EyeIcon);
export const EyeOffIcon = createIconWrapper(_EyeOffIcon);
export const Columns3Icon = createIconWrapper(_Columns3Icon);
export const Columns4Icon = createIconWrapper(_Columns4Icon);
export const PlusIcon = createIconWrapper(_PlusIcon);
export const RadioIcon = createIconWrapper(_RadioIcon);
export const RefreshIcon = createIconWrapper(_RefreshCcwIcon);
export const SettingsIcon = createIconWrapper(_SettingsIcon);
export const SpeakerLoudIcon = createIconWrapper(_SpeakerLoudIcon);
export const StopIcon = createIconWrapper(_StopIcon);
export const TimerResetIcon = createIconWrapper(_TimerResetIcon);
export const MinusIcon = createIconWrapper(_MinusIcon);
export const ShuffleIcon = createIconWrapper(_ShuffleIcon);
export const TrashIcon = createIconWrapper(_Trash2Icon);
export const UploadIcon = createIconWrapper(_UploadIcon);
export const UserCircleIcon = createIconWrapper(_CircleUserRoundIcon);
export const UserIcon = createIconWrapper(_UserIcon);
export const UserLockIcon = createIconWrapper(_UserLockIcon);
export const UserRoundCheckIcon = createIconWrapper(_UserRoundCheckIcon);
export const UserShildIcon = createIconWrapper(_ShieldUserIcon);
export const VolumeIcon = createIconWrapper(_Volume2Icon);
export const VolumeOffIcon = createIconWrapper(_VolumeOffIcon);
export const ZapIcon = createIconWrapper(_ZapIcon);

// ============================================================================
// AUTOMATIC ICON MAP & TYPES
// ============================================================================

/**
 * Automatic icon map - no manual maintenance required!
 * This creates a map of icon names to their components automatically
 */
export const ICON_MAP = {
  AddIcon,
  BadgeCheckIcon,
  CheckCircleIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  ChevronUpIcon,
  ChevronDownIcon,
  ClipboardIcon,
  CloseIcon,
  CoffeeIcon,
  Columns3Icon,
  Columns4Icon,
  CountdownTimerIcon,
  Cross2Icon,
  DeleteIcon,
  DialogIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  DropdownIcon,
  EditIcon,
  ExclamationTriangleIcon,
  EyeOnIcon,
  EyeOffIcon,
  FastForwardIcon,
  FullscreenIcon,
  GridIcon,
  HomeIcon,
  InfoCircledIcon,
  LanguageIcon,
  ListIcon,
  ListChecksIcon,
  LockIcon,
  MagnifyingGlassIcon,
  MenuIcon,
  MinusIcon,
  MinimizeIcon,
  MoonIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  PanelLeftCloseIcon,
  PanelLeftOpenIcon,
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
  UserShildIcon,
  VolumeIcon,
  VolumeOffIcon,
  WindowIcon,
  WineIcon,
  ZapIcon,
} as const;

/**
 * Icon name type - automatically generated from ICON_MAP keys
 */
export type IconName = keyof typeof ICON_MAP;

/**
 * Icon component type - automatically generated from ICON_MAP values
 */
export type IconType = (typeof ICON_MAP)[IconName];

/**
 * Helper function to get an icon by name
 * Useful for dynamic icon rendering
 */
export function getIconByName(iconName: IconName): IconType {
  return ICON_MAP[iconName];
}

/**
 * Helper function to check if a string is a valid icon name
 */
export function isValidIconName(name: string): name is IconName {
  return name in ICON_MAP;
}

/**
 * Get all available icon names
 */
export function getAvailableIconNames(): IconName[] {
  return Object.keys(ICON_MAP) as IconName[];
}
