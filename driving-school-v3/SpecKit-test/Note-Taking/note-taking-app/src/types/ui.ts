/**
 * UI Type Definitions
 * Defines UI state and component types
 */

import { NoteColor } from './note';

export type ViewMode = 'grid' | 'list';

export type NoteFilter = 'all' | 'pinned' | 'archived';

export interface UIPreferences {
  viewMode: ViewMode;
  colorScheme: 'light' | 'dark' | 'system';
  compactView: boolean;
}

export interface NoteEditorState {
  noteId: string | null;
  isOpen: boolean;
  isDirty: boolean;
}

export interface ColorPickerState {
  selectedColor: NoteColor;
  isOpen: boolean;
  anchorEl: HTMLElement | null;
}

export interface SearchState {
  query: string;
  isActive: boolean;
  results: string[]; // Array of note IDs
}

export interface SelectionState {
  selectedNoteIds: Set<string>;
  isMultiSelectMode: boolean;
}

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}
