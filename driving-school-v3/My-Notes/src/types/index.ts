/**
 * Core type definitions for the KeepNotes application.
 * These types define the data structures used throughout the app.
 */

/**
 * Available note colors matching Keep's color palette.
 * Each color has a specific semantic meaning for organization.
 */
export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'darkblue'
  | 'purple'
  | 'pink'
  | 'brown'
  | 'gray';

/**
 * Represents a single item in a checklist note.
 */
export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

/**
 * Block types for unified editor
 */
export type BlockType = 'text' | 'checklist';

/**
 * Represents a single content block in a note.
 * Can be either a text paragraph or a checklist item.
 */
export interface ContentBlock {
  id: string;
  type: BlockType;
  content: string;
  checked?: boolean; // Only for checklist blocks
  order: number;
}

/**
 * Represents a reminder attached to a note.
 */
export interface Reminder {
  id: string;
  dateTime: string; // ISO 8601 format
  isRecurring: boolean;
  recurringPattern?: 'daily' | 'weekly' | 'monthly' | 'yearly';
  notified: boolean;
}

/**
 * Represents a collaborator on a shared note.
 */
export interface Collaborator {
  id: string;
  email: string;
  name?: string;
  role: 'editor' | 'viewer';
  addedAt: string; // ISO 8601 format
}

/**
 * Main note entity type.
 * Supports both text notes and checklist notes.
 */
export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'checklist';
  checklistItems: ChecklistItem[];
  blocks?: ContentBlock[]; // New unified block-based content
  color: NoteColor;
  labels: string[]; // Array of label IDs
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  reminder?: Reminder;
  collaborators: Collaborator[];
  createdAt: string; // ISO 8601 format
  updatedAt: string; // ISO 8601 format
  trashedAt?: string; // ISO 8601 format - notes auto-delete after 7 days
  order: number; // For custom ordering in the grid
  // Sync-related fields
  syncStatus: 'synced' | 'pending' | 'conflict';
  lastSyncedAt?: string;
}

/**
 * Represents a label/tag for organizing notes.
 */
export interface Label {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  order: number;
}

/**
 * Application settings stored locally.
 */
export interface AppSettings {
  viewMode: 'grid' | 'list';
  darkMode: boolean;
  notificationsEnabled: boolean;
  syncEnabled: boolean;
  lastSyncTimestamp?: string;
}

/**
 * Sync queue item for offline changes.
 */
export interface SyncQueueItem {
  id: string;
  entityType: 'note' | 'label';
  entityId: string;
  operation: 'create' | 'update' | 'delete';
  data: Partial<Note> | Partial<Label>;
  timestamp: string;
  retryCount: number;
}

/**
 * Search result type with highlighting information.
 */
export interface SearchResult {
  note: Note;
  highlights: {
    title?: string;
    content?: string;
    labels?: string[];
  };
  score: number;
}

/**
 * Filter options for querying notes.
 */
export interface NoteFilter {
  labelId?: string;
  isPinned?: boolean;
  isArchived?: boolean;
  isTrashed?: boolean;
  color?: NoteColor;
  hasReminder?: boolean;
  searchQuery?: string;
}

/**
 * Sort options for notes display.
 */
export interface NoteSortOptions {
  field: 'createdAt' | 'updatedAt' | 'title' | 'order';
  direction: 'asc' | 'desc';
}
