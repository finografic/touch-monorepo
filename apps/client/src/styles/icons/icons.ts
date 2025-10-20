// NOTE: ICON DEFINITIONS - Radix + Lucide with auto-className
// ref + search: https://lucide.dev/icons/

import {
  ChevronDownIcon as _ChevronDownIcon,
  CountdownTimerIcon as _CountdownTimerIcon,
  Cross2Icon as _Cross2Icon,
  DoubleArrowLeftIcon as _DoubleArrowLeftIcon,
  DoubleArrowRightIcon as _DoubleArrowRightIcon,
  ExclamationTriangleIcon as _ExclamationTriangleIcon,
  HamburgerMenuIcon as _HamburgerMenuIcon,
  InfoCircledIcon as _InfoCircledIcon,
  PlusIcon as _PlusIcon,
  ReloadIcon as _ReloadIcon,
  SpeakerLoudIcon as _SpeakerLoudIcon,
  StarIcon as _StarIcon,
  TextAlignLeftIcon as _TextAlignLeftIcon,
  TextAlignTopIcon as _TextAlignTopIcon,
  TimerIcon as _TimerIcon,
  TrashIcon as _TrashIcon,
} from '@radix-ui/react-icons';
import {
  AppWindowMac as _AppWindowMacIcon,
  AppWindowMac as _WindowIcon,
  BadgeCheck as _BadgeCheckIcon,
  CircleStop as _StopIcon,
  CircleUserRound as _CircleUserRoundIcon,
  Coffee as _CoffeeIcon,
  Cog as _SettingsIcon,
  House as _HomeIcon,
  Languages as _LanguagesIcon,
  ListChecks as _ListChecksIcon,
  Lock as _LockIcon,
  Moon as _MoonIcon,
  PanelBottomClose as _PanelBottomCloseIcon,
  PanelBottomOpen as _PanelBottomOpenIcon,
  PencilLine as _EditIcon,
  RefreshCcwIcon as _RefreshCcwIcon,
  Search as _MagnifyingGlassIcon,
  ShieldCheck as _ShieldCheckIcon,
  ShieldUser as _ShieldUserIcon,
  Sun as _SunIcon,
  Thermometer as _TempIcon,
  TimerReset as _TimerResetIcon,
  Trash2 as _Trash2Icon,
  User as _UserIcon,
  UserLock as _UserLockIcon,
  UserRoundCheck as _UserRoundCheckIcon,
  Wine as _WineIcon,
  X as _DeleteIcon,
  Zap as _ZapIcon,
} from 'lucide-react';

import { createIconWrapper } from './icons.utils';

// ============================================================================
// ICON EXPORTS - Enhanced with auto-className
// ============================================================================

// Core Radix Icons - with semantic export names
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
export const DeleteIcon = createIconWrapper(_DeleteIcon);
export const HomeIcon = createIconWrapper(_HomeIcon);
export const LockIcon = createIconWrapper(_LockIcon);
export const EditIcon = createIconWrapper(_EditIcon);
export const InfoCircledIcon = createIconWrapper(_InfoCircledIcon);
export const MagnifyingGlassIcon = createIconWrapper(_MagnifyingGlassIcon);
export const PanelBottomCloseIcon = createIconWrapper(_PanelBottomCloseIcon);
export const PanelBottomOpenIcon = createIconWrapper(_PanelBottomOpenIcon);
export const RefreshIcon = createIconWrapper(_RefreshCcwIcon);
export const UserLockIcon = createIconWrapper(_UserLockIcon);
export const UserIcon = createIconWrapper(_UserIcon);
export const UserCircleIcon = createIconWrapper(_CircleUserRoundIcon);
export const UserShildIcon = createIconWrapper(_ShieldUserIcon);
export const PlusIcon = createIconWrapper(_PlusIcon);
export const SpeakerLoudIcon = createIconWrapper(_SpeakerLoudIcon);
export const StopIcon = createIconWrapper(_StopIcon);
export const SettingsIcon = createIconWrapper(_SettingsIcon);
export const TimerResetIcon = createIconWrapper(_TimerResetIcon);
export const TrashIcon = createIconWrapper(_Trash2Icon);
export const ZapIcon = createIconWrapper(_ZapIcon);
export const ListChecksIcon = createIconWrapper(_ListChecksIcon);
export const UserRoundCheckIcon = createIconWrapper(_UserRoundCheckIcon);

// ============================================================================
// AUTOMATIC ICON MAP & TYPES
// ============================================================================

/**
 * Automatic icon map - no manual maintenance required!
 * This creates a map of icon names to their components automatically
 */
export const ICON_MAP = {
  CountdownTimerIcon,
  Cross2Icon,
  DialogIcon,
  ExclamationTriangleIcon,
  ReloadIcon,
  ShieldCheckIcon,
  StarIcon,
  TextAlignLeftIcon,
  TextAlignTopIcon,
  TimerIcon,
  DoubleArrowLeftIcon,
  DoubleArrowRightIcon,
  CloseIcon,
  DropdownIcon,
  MenuIcon,
  CoffeeIcon,
  LanguageIcon,
  MoonIcon,
  SunIcon,
  TempIcon,
  WindowIcon,
  WineIcon,
  AddIcon,
  BadgeCheckIcon,
  DeleteIcon,
  HomeIcon,
  LockIcon,
  EditIcon,
  InfoCircledIcon,
  MagnifyingGlassIcon,
  PanelBottomCloseIcon,
  PanelBottomOpenIcon,
  UserLockIcon,
  UserIcon,
  UserCircleIcon,
  UserShildIcon,
  PlusIcon,
  RefreshIcon,
  SpeakerLoudIcon,
  StopIcon,
  SettingsIcon,
  TimerResetIcon,
  TrashIcon,
  ZapIcon,
  ListChecksIcon,
  UserRoundCheckIcon,
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
