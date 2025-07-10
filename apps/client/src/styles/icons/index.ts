// NOTE: LUCIDE ICONS - Enhanced with auto-className
// ref + search: https://lucide.dev/icons/languages

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
  StarIcon as _StarIcon,
  TextAlignLeftIcon as _TextAlignLeftIcon,
  TextAlignTopIcon as _TextAlignTopIcon,
  TimerIcon as _TimerIcon,
  TrashIcon as _TrashIcon,
} from '@radix-ui/react-icons';

import {
  Coffee as _CoffeeIcon,
  X as _DeleteIcon,
  House as _HomeIcon,
  Languages as _LanguagesIcon,
  Lock as _LockIcon,
  Search as _MagnifyingGlassIcon,
  PanelBottomClose as _PanelBottomCloseIcon,
  PanelBottomOpen as _PanelBottomOpenIcon,
  ShieldCheck as _ShieldCheckIcon,
  Thermometer as _TempIcon,
  Trash2 as _Trash2Icon,
  AppWindowMac as _WindowIcon,
  Wine as _WineIcon,
} from 'lucide-react';

import React, { forwardRef } from 'react';
import clsx from 'clsx';

// Helper function to create icon wrapper with auto-className (.icon)
const createIconWrapper = (IconComponent: React.ComponentType<any>) => {
  return forwardRef<any, any>(({ className, ...props }, ref) =>
    React.createElement(IconComponent, {
      ref,
      className: clsx('icon', className),
      ...props,
    }),
  );
};

// Enhanced exports with auto-className
export const CountdownTimerIcon = createIconWrapper(_CountdownTimerIcon);
export const Cross2Icon = createIconWrapper(_Cross2Icon);
export const ExclamationTriangleIcon = createIconWrapper(_ExclamationTriangleIcon);
export const ReloadIcon = createIconWrapper(_ReloadIcon);
export const ShieldCheckIcon = createIconWrapper(_ShieldCheckIcon);
export const StarIcon = createIconWrapper(_StarIcon);
export const TextAlignLeftIcon = createIconWrapper(_TextAlignLeftIcon);
export const TextAlignTopIcon = createIconWrapper(_TextAlignTopIcon);
export const TimerIcon = createIconWrapper(_TimerIcon);

// buttons / chevrons
export const DoubleArrowLeftIcon = createIconWrapper(_DoubleArrowLeftIcon);
export const DoubleArrowRightIcon = createIconWrapper(_DoubleArrowRightIcon);

// Aliases with auto-className
export const CloseIcon = createIconWrapper(_Cross2Icon);
export const DropdownIcon = createIconWrapper(_ChevronDownIcon);
export const MenuIcon = createIconWrapper(_HamburgerMenuIcon);

// Lucide icons with auto-className
export const CoffeeIcon = createIconWrapper(_CoffeeIcon);
export const LanguageIcon = createIconWrapper(_LanguagesIcon);
export const TempIcon = createIconWrapper(_TempIcon);
export const WindowIcon = createIconWrapper(_WindowIcon);
export const WineIcon = createIconWrapper(_WineIcon);

// Admin section icons
export const DeleteIcon = createIconWrapper(_DeleteIcon);
export const HomeIcon = createIconWrapper(_HomeIcon);
export const LockIcon = createIconWrapper(_LockIcon);
export const InfoCircledIcon = createIconWrapper(_InfoCircledIcon);
export const MagnifyingGlassIcon = createIconWrapper(_MagnifyingGlassIcon);
export const PanelBottomCloseIcon = createIconWrapper(_PanelBottomCloseIcon);
export const PanelBottomOpenIcon = createIconWrapper(_PanelBottomOpenIcon);
export const PlusIcon = createIconWrapper(_PlusIcon);
export const TrashIcon = createIconWrapper(_Trash2Icon);
