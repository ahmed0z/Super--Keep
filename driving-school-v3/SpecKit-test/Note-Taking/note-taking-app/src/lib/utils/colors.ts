/**
 * Color Utilities
 * Functions for working with note colors
 */

import { NoteColor } from '@/types/note';

export const NOTE_COLORS: Record<NoteColor, { bg: string; border: string; hover: string }> = {
  default: {
    bg: 'bg-white dark:bg-gray-800',
    border: 'border-gray-200 dark:border-gray-700',
    hover: 'hover:bg-gray-50 dark:hover:bg-gray-750',
  },
  red: {
    bg: 'bg-red-50 dark:bg-red-950',
    border: 'border-red-200 dark:border-red-800',
    hover: 'hover:bg-red-100 dark:hover:bg-red-900',
  },
  orange: {
    bg: 'bg-orange-50 dark:bg-orange-950',
    border: 'border-orange-200 dark:border-orange-800',
    hover: 'hover:bg-orange-100 dark:hover:bg-orange-900',
  },
  yellow: {
    bg: 'bg-yellow-50 dark:bg-yellow-950',
    border: 'border-yellow-200 dark:border-yellow-800',
    hover: 'hover:bg-yellow-100 dark:hover:bg-yellow-900',
  },
  green: {
    bg: 'bg-green-50 dark:bg-green-950',
    border: 'border-green-200 dark:border-green-800',
    hover: 'hover:bg-green-100 dark:hover:bg-green-900',
  },
  teal: {
    bg: 'bg-teal-50 dark:bg-teal-950',
    border: 'border-teal-200 dark:border-teal-800',
    hover: 'hover:bg-teal-100 dark:hover:bg-teal-900',
  },
  blue: {
    bg: 'bg-blue-50 dark:bg-blue-950',
    border: 'border-blue-200 dark:border-blue-800',
    hover: 'hover:bg-blue-100 dark:hover:bg-blue-900',
  },
  purple: {
    bg: 'bg-purple-50 dark:bg-purple-950',
    border: 'border-purple-200 dark:border-purple-800',
    hover: 'hover:bg-purple-100 dark:hover:bg-purple-900',
  },
  pink: {
    bg: 'bg-pink-50 dark:bg-pink-950',
    border: 'border-pink-200 dark:border-pink-800',
    hover: 'hover:bg-pink-100 dark:hover:bg-pink-900',
  },
};

export function getNoteColorClasses(color: NoteColor): string {
  const colors = NOTE_COLORS[color];
  return `${colors.bg} ${colors.border} ${colors.hover}`;
}

export function getNoteBackgroundColor(color: NoteColor): string {
  return NOTE_COLORS[color].bg;
}

export function isValidNoteColor(color: string): color is NoteColor {
  return color in NOTE_COLORS;
}
