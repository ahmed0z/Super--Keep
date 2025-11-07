/**
 * Note Entity Contract
 * 
 * Represents a single note with metadata and content blocks.
 * 
 * @version 1.0.0
 * @see specs/001-hybrid-note-app/data-model.md
 */

/**
 * Available note background colors (Google Keep inspired palette)
 */
export type NoteColor =
  | 'default'
  | 'red'
  | 'orange'
  | 'yellow'
  | 'green'
  | 'teal'
  | 'blue'
  | 'purple'
  | 'pink'

/**
 * Color palette hex values for UI rendering
 */
export const NOTE_COLORS: Record<NoteColor, string> = {
  default: '#ffffff',
  red: '#f28b82',
  orange: '#fbbc04',
  yellow: '#fff475',
  green: '#ccff90',
  teal: '#a7ffeb',
  blue: '#cbf0f8',
  purple: '#d7aefb',
  pink: '#fdcfe8',
}

/**
 * Note entity interface
 * 
 * Constraints:
 * - id: Must be valid UUID v4
 * - title: Max 200 characters
 * - blocks: Max 25 blocks per note
 * - updatedAt: Must be >= createdAt
 */
export interface Note {
  /** Unique identifier (UUID v4) */
  id: string
  
  /** Note title (optional, max 200 chars) */
  title: string
  
  /** Background color for visual organization */
  color: NoteColor
  
  /** Archive status (archived notes hidden from main view) */
  archived: boolean
  
  /** Creation timestamp (ISO 8601) */
  createdAt: Date
  
  /** Last modification timestamp (ISO 8601) */
  updatedAt: Date
  
  /** Ordered list of content blocks (max 25) */
  blocks: ContentBlock[]
}

/**
 * Partial note for updates (all fields optional except id)
 */
export type NoteUpdate = Partial<Omit<Note, 'id' | 'createdAt'>> & {
  id: string
}

/**
 * Note creation input (id, timestamps auto-generated)
 */
export type CreateNoteInput = Omit<Note, 'id' | 'createdAt' | 'updatedAt'> & {
  id?: string // Optional: allow manual UUID specification
}

/**
 * Note with computed properties for UI display
 */
export interface NoteViewModel extends Note {
  /** Truncated preview of first text block (for cards) */
  preview: string
  
  /** Count of completed checklist items */
  completedCount: number
  
  /** Total count of checklist items */
  totalChecklistItems: number
  
  /** Whether note has any content */
  isEmpty: boolean
}

/**
 * Import ContentBlock type from Block contract
 */
export type { ContentBlock } from './Block'
