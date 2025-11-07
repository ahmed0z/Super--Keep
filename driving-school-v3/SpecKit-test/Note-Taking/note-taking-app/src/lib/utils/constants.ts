/**
 * Application Constants
 * Centralized constants for the application
 */

// Storage
export const STORAGE_KEYS = {
  NOTES: 'notes',
  UI_PREFERENCES: 'ui_preferences',
  LAST_SYNC: 'last_sync',
} as const;

// UI
export const DEFAULT_VIEW_MODE = 'grid' as const;
export const DEFAULT_COLOR_SCHEME = 'system' as const;

// Note limits
export const NOTE_LIMITS = {
  TITLE_MAX_LENGTH: 200,
  TEXT_BLOCK_MAX_LENGTH: 10000,
  MAX_BLOCKS_PER_NOTE: 50,
  MAX_CHECKLIST_ITEMS: 100,
  CHECKLIST_ITEM_MAX_LENGTH: 500,
  MAX_TABLE_ROWS: 20,
  MAX_TABLE_COLS: 10,
  TABLE_CELL_MAX_LENGTH: 500,
  MAX_TAGS: 10,
  TAG_MAX_LENGTH: 30,
} as const;

// Auto-save
export const AUTO_SAVE_DELAY_MS = 1000;

// Search
export const SEARCH_DEBOUNCE_MS = 300;
export const MIN_SEARCH_LENGTH = 2;

// Toast notifications
export const TOAST_DURATION_MS = 3000;

// Animations
export const ANIMATION_DURATION_MS = 200;

// Keyboard shortcuts
export const KEYBOARD_SHORTCUTS = {
  NEW_NOTE: 'Ctrl+N',
  SEARCH: 'Ctrl+K',
  DELETE: 'Delete',
  ARCHIVE: 'Ctrl+E',
  PIN: 'Ctrl+P',
  MULTI_SELECT: 'Shift',
} as const;
