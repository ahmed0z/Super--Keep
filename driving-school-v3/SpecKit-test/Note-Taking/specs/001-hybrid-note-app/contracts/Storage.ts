/**
 * Storage Service Contract
 * 
 * Defines the interface for data persistence operations.
 * Current implementation: localStorage
 * Future implementation: Supabase
 * 
 * This abstraction allows swapping storage backends without changing business logic.
 * 
 * @version 1.0.0
 * @see specs/001-hybrid-note-app/data-model.md
 */

import type { Note, NoteUpdate, CreateNoteInput } from './Note'
import type { ContentBlock } from './Block'

// ============================================================================
// STORAGE INTERFACE
// ============================================================================

/**
 * Storage service interface for note persistence
 * 
 * All methods are synchronous for localStorage implementation.
 * When migrating to Supabase, convert to async and return Promises.
 */
export interface IStorageService {
  // ──────────────────────────────────────────────────────────────────────────
  // NOTE OPERATIONS
  // ──────────────────────────────────────────────────────────────────────────
  
  /**
   * Get all notes (active and archived)
   * 
   * @returns Array of all notes
   */
  getAllNotes(): Note[]
  
  /**
   * Get a single note by ID
   * 
   * @param id - Note ID
   * @returns Note if found, null otherwise
   */
  getNoteById(id: string): Note | null
  
  /**
   * Get all active (non-archived) notes
   * 
   * @returns Array of active notes
   */
  getActiveNotes(): Note[]
  
  /**
   * Get all archived notes
   * 
   * @returns Array of archived notes
   */
  getArchivedNotes(): Note[]
  
  /**
   * Create a new note
   * 
   * @param input - Note creation data
   * @returns Created note with generated ID and timestamps
   */
  createNote(input: CreateNoteInput): Note
  
  /**
   * Update an existing note
   * 
   * @param update - Partial note updates with ID
   * @returns Updated note if found, null otherwise
   */
  updateNote(update: NoteUpdate): Note | null
  
  /**
   * Delete a note permanently
   * 
   * @param id - Note ID
   * @returns true if deleted, false if not found
   */
  deleteNote(id: string): boolean
  
  /**
   * Archive a note (hide from main view)
   * 
   * @param id - Note ID
   * @returns Updated note if found, null otherwise
   */
  archiveNote(id: string): Note | null
  
  /**
   * Unarchive a note (restore to main view)
   * 
   * @param id - Note ID
   * @returns Updated note if found, null otherwise
   */
  unarchiveNote(id: string): Note | null
  
  // ──────────────────────────────────────────────────────────────────────────
  // BLOCK OPERATIONS
  // ──────────────────────────────────────────────────────────────────────────
  
  /**
   * Add a content block to a note
   * 
   * @param noteId - Note ID
   * @param block - Block to add
   * @returns Updated note if found, null otherwise
   */
  addBlock(noteId: string, block: ContentBlock): Note | null
  
  /**
   * Update a content block within a note
   * 
   * @param noteId - Note ID
   * @param blockId - Block ID
   * @param updates - Partial block updates
   * @returns Updated note if found, null otherwise
   */
  updateBlock(
    noteId: string,
    blockId: string,
    updates: Partial<ContentBlock>
  ): Note | null
  
  /**
   * Delete a content block from a note
   * 
   * @param noteId - Note ID
   * @param blockId - Block ID
   * @returns Updated note if found, null otherwise
   */
  deleteBlock(noteId: string, blockId: string): Note | null
  
  /**
   * Reorder blocks within a note
   * 
   * @param noteId - Note ID
   * @param blockIds - Array of block IDs in new order
   * @returns Updated note if found, null otherwise
   */
  reorderBlocks(noteId: string, blockIds: string[]): Note | null
  
  // ──────────────────────────────────────────────────────────────────────────
  // QUERY OPERATIONS
  // ──────────────────────────────────────────────────────────────────────────
  
  /**
   * Search notes by title
   * 
   * @param query - Search query (case-insensitive)
   * @returns Array of matching notes
   */
  searchNotes(query: string): Note[]
  
  /**
   * Filter notes by color
   * 
   * @param color - Note color
   * @returns Array of notes with specified color
   */
  getNotesByColor(color: string): Note[]
  
  /**
   * Get notes sorted by criteria
   * 
   * @param sortBy - Sort criteria
   * @param order - Sort order
   * @returns Sorted array of notes
   */
  getSortedNotes(
    sortBy: 'createdAt' | 'updatedAt' | 'title',
    order: 'asc' | 'desc'
  ): Note[]
  
  // ──────────────────────────────────────────────────────────────────────────
  // STORAGE MANAGEMENT
  // ──────────────────────────────────────────────────────────────────────────
  
  /**
   * Clear all notes (destructive operation)
   * 
   * @returns Number of notes deleted
   */
  clearAllNotes(): number
  
  /**
   * Export all notes as JSON
   * 
   * @returns JSON string of all notes
   */
  exportNotes(): string
  
  /**
   * Import notes from JSON
   * 
   * @param json - JSON string of notes
   * @returns Number of notes imported
   */
  importNotes(json: string): number
  
  /**
   * Get storage statistics
   * 
   * @returns Storage usage information
   */
  getStorageStats(): StorageStats
}

// ============================================================================
// SUPPORTING TYPES
// ============================================================================

/**
 * Storage usage statistics
 */
export interface StorageStats {
  /** Total number of notes */
  totalNotes: number
  
  /** Number of active notes */
  activeNotes: number
  
  /** Number of archived notes */
  archivedNotes: number
  
  /** Total number of blocks across all notes */
  totalBlocks: number
  
  /** Estimated storage size in bytes */
  estimatedSize: number
  
  /** Storage version (for migrations) */
  version: number
}

/**
 * Storage version info for migrations
 */
export interface StorageVersion {
  /** Current schema version */
  version: number
  
  /** Timestamp of last migration */
  migratedAt?: string
}

/**
 * localStorage key structure
 */
export const STORAGE_KEYS = {
  /** Main notes storage */
  NOTES: 'notes-storage',
  
  /** UI preferences */
  UI_PREFERENCES: 'ui-preferences',
  
  /** Storage version */
  VERSION: 'storage-version',
} as const

/**
 * Current storage schema version
 */
export const STORAGE_VERSION = 1

// ============================================================================
// ERROR TYPES
// ============================================================================

/**
 * Storage operation errors
 */
export class StorageError extends Error {
  constructor(
    message: string,
    public code: StorageErrorCode,
    public details?: unknown
  ) {
    super(message)
    this.name = 'StorageError'
  }
}

/**
 * Storage error codes
 */
export enum StorageErrorCode {
  /** Note not found */
  NOT_FOUND = 'NOT_FOUND',
  
  /** Validation failed */
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  
  /** Storage quota exceeded */
  QUOTA_EXCEEDED = 'QUOTA_EXCEEDED',
  
  /** Corrupted data */
  CORRUPTED_DATA = 'CORRUPTED_DATA',
  
  /** Unknown error */
  UNKNOWN = 'UNKNOWN',
}

// ============================================================================
// RESULT TYPE (for safer error handling)
// ============================================================================

/**
 * Result type for operations that can fail
 * 
 * @example
 * const result = storage.createNote(input)
 * if (result.success) {
 *   console.log('Created:', result.data)
 * } else {
 *   console.error('Error:', result.error)
 * }
 */
export type Result<T, E = StorageError> =
  | { success: true; data: T }
  | { success: false; error: E }
