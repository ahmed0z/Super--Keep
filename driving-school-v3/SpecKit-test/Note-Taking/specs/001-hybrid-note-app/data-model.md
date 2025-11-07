# Data Model: Hybrid Note-Taking App

**Feature**: 001-hybrid-note-app  
**Date**: 2025-11-07  
**Status**: Phase 1 - Design

## Overview

This document defines the data entities, relationships, validation rules, and state transitions for the hybrid note-taking app. All entities are designed for localStorage persistence with a clear migration path to Supabase.

---

## Entity Relationships

```
Note (1) ──────► (0..25) ContentBlock
  │
  ├─ id: string (UUID)
  ├─ title: string
  ├─ color: NoteColor
  ├─ archived: boolean
  ├─ createdAt: Date
  ├─ updatedAt: Date
  └─ blocks: ContentBlock[]

ContentBlock (discriminated union)
  ├─ TextBlock
  │   ├─ id: string
  │   ├─ type: 'text'
  │   ├─ position: number
  │   ├─ content: string
  │   └─ formatting?: TextFormatting
  │
  ├─ ChecklistBlock
  │   ├─ id: string
  │   ├─ type: 'checklist'
  │   ├─ position: number
  │   └─ items: ChecklistItem[]
  │
  └─ TableBlock
      ├─ id: string
      ├─ type: 'table'
      ├─ position: number
      ├─ rows: number
      ├─ columns: number
      └─ cells: Record<CellKey, string>
```

---

## Core Entities

### 1. Note

**Description**: Represents a single note with metadata and content blocks.

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 format | Unique identifier |
| `title` | `string` | No | Max 200 chars | Note title (can be empty) |
| `color` | `NoteColor` | Yes | Enum value | Background color |
| `archived` | `boolean` | Yes | - | Archive status |
| `createdAt` | `Date` | Yes | ISO 8601 | Creation timestamp |
| `updatedAt` | `Date` | Yes | ISO 8601 | Last modification timestamp |
| `blocks` | `ContentBlock[]` | Yes | Max 25 items | Ordered content blocks |

**Validation Rules**:
- `id` must be valid UUID v4
- `title` max length: 200 characters
- `color` must be one of: `'default' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'purple' | 'pink'`
- `blocks` array max length: 25
- `blocks` must have sequential `position` values (0, 1, 2, ...)
- `updatedAt` must be >= `createdAt`

**State Transitions**:

```
┌─────────┐
│  Draft  │ ← Note created, not yet saved
└────┬────┘
     │ Auto-save (500ms)
     ▼
┌─────────┐
│  Saved  │ ← Note persisted in localStorage
└────┬────┘
     │ User edits
     ▼
┌─────────┐
│ Modified│ ← Changes pending auto-save
└────┬────┘
     │ Auto-save (500ms)
     ▼
┌─────────┐
│  Saved  │
└────┬────┘
     │ User archives
     ▼
┌─────────┐
│Archived │ ← Hidden from main view
└────┬────┘
     │ User unarchives
     ▼
┌─────────┐
│  Saved  │
└────┬────┘
     │ User deletes
     ▼
┌─────────┐
│ Deleted │ ← Removed from localStorage
└─────────┘
```

**Zod Schema**:
```typescript
import { z } from 'zod'

export const NoteColorSchema = z.enum([
  'default', 'red', 'orange', 'yellow', 
  'green', 'teal', 'blue', 'purple', 'pink'
])

export const NoteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200).default(''),
  color: NoteColorSchema.default('default'),
  archived: z.boolean().default(false),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  blocks: z.array(ContentBlockSchema).max(25).default([])
}).refine(data => data.updatedAt >= data.createdAt, {
  message: "updatedAt must be >= createdAt"
})
```

---

### 2. ContentBlock (Base)

**Description**: Abstract base for all content block types. Uses discriminated union for type safety.

**Fields** (all block types):

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 format | Unique block identifier |
| `type` | `BlockType` | Yes | `'text' \| 'checklist' \| 'table'` | Block type discriminator |
| `position` | `number` | Yes | Integer >= 0 | Order within note (0-indexed) |

**Type-Specific Fields**: See individual block types below.

---

### 3. TextBlock

**Description**: Rich text content block with optional formatting.

**Additional Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `content` | `string` | Yes | Max 10,000 chars | Text content |
| `formatting` | `TextFormatting` | No | - | Formatting options |

**TextFormatting**:
```typescript
interface TextFormatting {
  bold?: boolean
  italic?: boolean
  underline?: boolean
}
```

**Validation Rules**:
- `type` must be `'text'`
- `content` max length: 10,000 characters
- `formatting` is optional (defaults to plain text)

**Zod Schema**:
```typescript
export const TextFormattingSchema = z.object({
  bold: z.boolean().optional(),
  italic: z.boolean().optional(),
  underline: z.boolean().optional()
}).optional()

export const TextBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('text'),
  position: z.number().int().nonnegative(),
  content: z.string().max(10000).default(''),
  formatting: TextFormattingSchema
})
```

---

### 4. ChecklistBlock

**Description**: Todo list block with checkable items.

**Additional Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `items` | `ChecklistItem[]` | Yes | Max 100 items | Checklist items |

**ChecklistItem**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `id` | `string` | Yes | UUID v4 | Item identifier |
| `text` | `string` | Yes | Max 500 chars | Item text |
| `checked` | `boolean` | Yes | - | Completion status |

**Validation Rules**:
- `type` must be `'checklist'`
- `items` array max length: 100
- Each item `text` max length: 500 characters
- Item IDs must be unique within the block

**Zod Schema**:
```typescript
export const ChecklistItemSchema = z.object({
  id: z.string().uuid(),
  text: z.string().max(500),
  checked: z.boolean().default(false)
})

export const ChecklistBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('checklist'),
  position: z.number().int().nonnegative(),
  items: z.array(ChecklistItemSchema).max(100).default([])
})
```

---

### 5. TableBlock

**Description**: Structured data table with editable cells.

**Additional Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `rows` | `number` | Yes | Min 1, Max 50 | Number of rows |
| `columns` | `number` | Yes | Min 1, Max 20 | Number of columns |
| `cells` | `Record<CellKey, string>` | Yes | - | Cell contents keyed by position |

**CellKey Format**: `"${row}-${col}"` (e.g., `"0-0"`, `"2-3"`)

**Validation Rules**:
- `type` must be `'table'`
- `rows` range: 1-50
- `columns` range: 1-20
- Cell keys must match pattern `\d+-\d+`
- Row indices: 0 to `rows - 1`
- Column indices: 0 to `columns - 1`
- Each cell value max length: 1,000 characters

**Zod Schema**:
```typescript
export const CellKeySchema = z.string().regex(/^\d+-\d+$/)

export const TableBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('table'),
  position: z.number().int().nonnegative(),
  rows: z.number().int().min(1).max(50),
  columns: z.number().int().min(1).max(20),
  cells: z.record(CellKeySchema, z.string().max(1000)).default({})
}).refine(data => {
  // Validate cell keys are within bounds
  for (const key in data.cells) {
    const [row, col] = key.split('-').map(Number)
    if (row >= data.rows || col >= data.columns) {
      return false
    }
  }
  return true
}, {
  message: "Cell keys must be within table bounds"
})
```

---

### 6. ContentBlock (Union)

**Description**: Discriminated union of all block types.

**Zod Schema**:
```typescript
export const ContentBlockSchema = z.discriminatedUnion('type', [
  TextBlockSchema,
  ChecklistBlockSchema,
  TableBlockSchema
])
```

**Type Guard**:
```typescript
export function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text'
}

export function isChecklistBlock(block: ContentBlock): block is ChecklistBlock {
  return block.type === 'checklist'
}

export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === 'table'
}
```

---

## Utility Entities

### 7. UIPreferences

**Description**: User interface preferences (view mode, theme).

**Fields**:

| Field | Type | Required | Constraints | Description |
|-------|------|----------|-------------|-------------|
| `viewMode` | `'grid' \| 'list'` | Yes | - | Notes display mode |
| `sortOrder` | `'newest' \| 'oldest' \| 'title'` | Yes | - | Notes sort order |

**Default Values**:
- `viewMode`: `'grid'`
- `sortOrder`: `'newest'`

**Zod Schema**:
```typescript
export const UIPreferencesSchema = z.object({
  viewMode: z.enum(['grid', 'list']).default('grid'),
  sortOrder: z.enum(['newest', 'oldest', 'title']).default('newest')
})
```

---

## localStorage Schema

**Key Structure**:

```typescript
// Main notes storage
'notes-storage': {
  state: {
    notes: Note[]
  },
  version: 0
}

// UI preferences
'ui-preferences': UIPreferences

// Individual note cache (optional optimization)
'note-cache-{id}': Note
```

**Storage Limits**:
- Total localStorage: ~5-10MB (browser dependent)
- Estimated note size: ~5-50KB per note (depending on blocks)
- Target capacity: 100 notes comfortably

**Versioning Strategy**:
```typescript
interface StorageVersion {
  version: number
  migratedAt?: string
}

// Migration example: v0 → v1
function migrateV0toV1(data: any): Note[] {
  // Transform old schema to new schema
  return data.notes.map((note: any) => ({
    ...note,
    // Add new fields, transform existing ones
  }))
}
```

---

## Data Validation

### Validation Layers

1. **Input Validation** (Form level)
   - Validate user input before state update
   - Use Zod schemas with `.safeParse()`
   - Show user-friendly error messages

2. **State Validation** (Store level)
   - Validate data before persisting to localStorage
   - Use Zod schemas with `.parse()` (throws on error)
   - Ensure data integrity

3. **Storage Validation** (Read level)
   - Validate data read from localStorage
   - Handle corrupted data gracefully
   - Fallback to empty state if validation fails

**Example Validation Flow**:
```typescript
// 1. Form validation (user input)
export function validateNoteTitle(title: string): Result<string, string> {
  const result = z.string().max(200).safeParse(title)
  if (!result.success) {
    return { error: "Title too long (max 200 characters)" }
  }
  return { data: result.data }
}

// 2. Store validation (before persist)
export function saveNote(note: Note) {
  const validated = NoteSchema.parse(note) // Throws if invalid
  localStorage.setItem('notes-storage', JSON.stringify({
    state: { notes: [...existingNotes, validated] },
    version: 0
  }))
}

// 3. Storage validation (on read)
export function loadNotes(): Note[] {
  try {
    const raw = localStorage.getItem('notes-storage')
    if (!raw) return []
    
    const parsed = JSON.parse(raw)
    const validated = z.array(NoteSchema).parse(parsed.state.notes)
    return validated
  } catch (error) {
    console.error('Failed to load notes, resetting storage', error)
    return []
  }
}
```

---

## Indexing & Queries

**Common Query Patterns** (localStorage):

1. **Get all active notes** (not archived)
   ```typescript
   notes.filter(note => !note.archived)
   ```

2. **Get archived notes**
   ```typescript
   notes.filter(note => note.archived)
   ```

3. **Sort by date (newest first)**
   ```typescript
   notes.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime())
   ```

4. **Search by title**
   ```typescript
   notes.filter(note => 
     note.title.toLowerCase().includes(query.toLowerCase())
   )
   ```

5. **Get notes by color**
   ```typescript
   notes.filter(note => note.color === targetColor)
   ```

**Future Supabase Indexes** (for migration):
```sql
-- Queries for active notes sorted by date
CREATE INDEX idx_notes_active_updated 
ON notes (archived, updated_at DESC);

-- Full-text search on title
CREATE INDEX idx_notes_title_search 
ON notes USING GIN (to_tsvector('english', title));

-- Filter by color
CREATE INDEX idx_notes_color 
ON notes (color);
```

---

## Constraints Summary

| Entity | Constraint | Value | Rationale |
|--------|-----------|-------|-----------|
| Note | Max blocks | 25 | Performance + UX (long notes harder to navigate) |
| Note | Title length | 200 chars | Typical title length, prevents UI overflow |
| TextBlock | Content length | 10,000 chars | ~2 pages of text, sufficient for notes |
| ChecklistBlock | Max items | 100 | Reasonable todo list size |
| ChecklistItem | Text length | 500 chars | Typical task description |
| TableBlock | Max rows | 50 | Browser rendering performance |
| TableBlock | Max columns | 20 | Horizontal scroll UX limit |
| TableBlock | Cell length | 1,000 chars | Balance detail vs performance |
| Storage | Max notes | 100 | localStorage capacity (~5MB) |

---

## Migration Path to Supabase

**Current localStorage → Future Supabase Tables**:

```sql
-- Notes table
CREATE TABLE notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT CHECK (char_length(title) <= 200),
  color TEXT CHECK (color IN ('default', 'red', 'orange', ...)),
  archived BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Blocks table (polymorphic)
CREATE TABLE content_blocks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  note_id UUID REFERENCES notes(id) ON DELETE CASCADE,
  type TEXT CHECK (type IN ('text', 'checklist', 'table')),
  position INTEGER NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- RLS policies
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_blocks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can CRUD their own notes"
  ON notes FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "Users can CRUD blocks in their notes"
  ON content_blocks FOR ALL
  USING (
    note_id IN (
      SELECT id FROM notes WHERE user_id = auth.uid()
    )
  );
```

**Data Migration Script**:
```typescript
async function migrateToSupabase(supabase: SupabaseClient) {
  const localNotes = loadNotesFromLocalStorage()
  
  for (const note of localNotes) {
    // Insert note
    const { data: insertedNote, error: noteError } = await supabase
      .from('notes')
      .insert({
        id: note.id,
        title: note.title,
        color: note.color,
        archived: note.archived,
        created_at: note.createdAt,
        updated_at: note.updatedAt
      })
      .select()
      .single()
    
    if (noteError) throw noteError
    
    // Insert blocks
    for (const block of note.blocks) {
      const { error: blockError } = await supabase
        .from('content_blocks')
        .insert({
          id: block.id,
          note_id: note.id,
          type: block.type,
          position: block.position,
          data: block // Store entire block as JSONB
        })
      
      if (blockError) throw blockError
    }
  }
}
```

---

## Summary

**Entities Defined**: 7
- Note (core entity)
- ContentBlock (abstract base)
- TextBlock, ChecklistBlock, TableBlock (concrete blocks)
- UIPreferences (user settings)

**Validation**: Comprehensive Zod schemas for all entities

**Storage**: localStorage with versioning and migration support

**Future Path**: Clear mapping to Supabase tables with RLS policies

**Status**: ✅ Phase 1 Data Model Complete
