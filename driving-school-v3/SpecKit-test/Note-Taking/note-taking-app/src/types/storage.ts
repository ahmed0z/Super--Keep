/**
 * Storage Type Definitions
 * Defines storage service contracts
 */

import { Note, NoteCreateInput, NoteUpdateInput } from './note';

export interface StorageAdapter {
  // Note operations
  getAllNotes(): Promise<Note[]>;
  getNoteById(id: string): Promise<Note | null>;
  createNote(input: NoteCreateInput): Promise<Note>;
  updateNote(id: string, input: NoteUpdateInput): Promise<Note>;
  deleteNote(id: string): Promise<void>;
  
  // Bulk operations
  bulkDeleteNotes(ids: string[]): Promise<void>;
  
  // Search and filter
  searchNotes(query: string): Promise<Note[]>;
  getNotesByTag(tag: string): Promise<Note[]>;
  getPinnedNotes(): Promise<Note[]>;
  getArchivedNotes(): Promise<Note[]>;
}

export interface StorageError extends Error {
  code: 'NOT_FOUND' | 'STORAGE_FULL' | 'INVALID_DATA' | 'UNKNOWN';
  details?: unknown;
}

export const STORAGE_KEYS = {
  NOTES: 'notes',
  LAST_SYNC: 'lastSync',
} as const;
