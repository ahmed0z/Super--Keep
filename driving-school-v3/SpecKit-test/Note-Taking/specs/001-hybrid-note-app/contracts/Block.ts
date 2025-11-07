/**
 * Content Block Entity Contracts
 * 
 * Defines all content block types using discriminated unions for type safety.
 * Supports: text, checklist, and table blocks.
 * 
 * @version 1.0.0
 * @see specs/001-hybrid-note-app/data-model.md
 */

/**
 * Block type discriminator
 */
export type BlockType = 'text' | 'checklist' | 'table'

/**
 * Base properties shared by all block types
 */
export interface BaseBlock {
  /** Unique identifier (UUID v4) */
  id: string
  
  /** Block type discriminator */
  type: BlockType
  
  /** Order within note (0-indexed, sequential) */
  position: number
}

// ============================================================================
// TEXT BLOCK
// ============================================================================

/**
 * Text formatting options for rich text blocks
 */
export interface TextFormatting {
  /** Bold text */
  bold?: boolean
  
  /** Italic text */
  italic?: boolean
  
  /** Underlined text */
  underline?: boolean
}

/**
 * Text content block
 * 
 * Constraints:
 * - content: Max 10,000 characters
 * - formatting: Optional (defaults to plain text)
 */
export interface TextBlock extends BaseBlock {
  type: 'text'
  
  /** Text content (max 10,000 chars) */
  content: string
  
  /** Optional formatting options */
  formatting?: TextFormatting
}

// ============================================================================
// CHECKLIST BLOCK
// ============================================================================

/**
 * Single item in a checklist
 * 
 * Constraints:
 * - text: Max 500 characters
 */
export interface ChecklistItem {
  /** Unique identifier (UUID v4) */
  id: string
  
  /** Item text (max 500 chars) */
  text: string
  
  /** Completion status */
  checked: boolean
}

/**
 * Checklist/todo list block
 * 
 * Constraints:
 * - items: Max 100 items per block
 * - Item IDs must be unique within block
 */
export interface ChecklistBlock extends BaseBlock {
  type: 'checklist'
  
  /** List of checklist items (max 100) */
  items: ChecklistItem[]
}

// ============================================================================
// TABLE BLOCK
// ============================================================================

/**
 * Cell key format: "row-column" (e.g., "0-0", "2-3")
 * - Row indices: 0 to (rows - 1)
 * - Column indices: 0 to (columns - 1)
 */
export type CellKey = string // Format: `${number}-${number}`

/**
 * Helper to create cell key from coordinates
 */
export function createCellKey(row: number, col: number): CellKey {
  return `${row}-${col}`
}

/**
 * Helper to parse cell key into coordinates
 */
export function parseCellKey(key: CellKey): [row: number, col: number] {
  const [row, col] = key.split('-').map(Number)
  return [row, col]
}

/**
 * Table block for structured data
 * 
 * Constraints:
 * - rows: 1-50
 * - columns: 1-20
 * - Cell values: Max 1,000 characters each
 * - Cell keys must be within table bounds
 */
export interface TableBlock extends BaseBlock {
  type: 'table'
  
  /** Number of rows (1-50) */
  rows: number
  
  /** Number of columns (1-20) */
  columns: number
  
  /** Cell contents keyed by position (e.g., "0-0" -> "Header") */
  cells: Record<CellKey, string>
}

// ============================================================================
// UNION TYPE
// ============================================================================

/**
 * Discriminated union of all content block types
 * 
 * TypeScript will narrow the type based on the `type` field:
 * 
 * @example
 * function renderBlock(block: ContentBlock) {
 *   switch (block.type) {
 *     case 'text':
 *       return <TextBlock content={block.content} /> // TS knows it's TextBlock
 *     case 'checklist':
 *       return <ChecklistBlock items={block.items} /> // TS knows it's ChecklistBlock
 *     case 'table':
 *       return <TableBlock cells={block.cells} />    // TS knows it's TableBlock
 *   }
 * }
 */
export type ContentBlock = TextBlock | ChecklistBlock | TableBlock

// ============================================================================
// TYPE GUARDS
// ============================================================================

/**
 * Type guard for TextBlock
 */
export function isTextBlock(block: ContentBlock): block is TextBlock {
  return block.type === 'text'
}

/**
 * Type guard for ChecklistBlock
 */
export function isChecklistBlock(block: ContentBlock): block is ChecklistBlock {
  return block.type === 'checklist'
}

/**
 * Type guard for TableBlock
 */
export function isTableBlock(block: ContentBlock): block is TableBlock {
  return block.type === 'table'
}

// ============================================================================
// FACTORY FUNCTIONS
// ============================================================================

/**
 * Create a new text block with defaults
 */
export function createTextBlock(
  position: number,
  content: string = '',
  formatting?: TextFormatting
): TextBlock {
  return {
    id: crypto.randomUUID(),
    type: 'text',
    position,
    content,
    formatting,
  }
}

/**
 * Create a new checklist block with defaults
 */
export function createChecklistBlock(
  position: number,
  items: ChecklistItem[] = []
): ChecklistBlock {
  return {
    id: crypto.randomUUID(),
    type: 'checklist',
    position,
    items,
  }
}

/**
 * Create a new checklist item
 */
export function createChecklistItem(text: string = '', checked: boolean = false): ChecklistItem {
  return {
    id: crypto.randomUUID(),
    text,
    checked,
  }
}

/**
 * Create a new table block with defaults
 */
export function createTableBlock(
  position: number,
  rows: number = 2,
  columns: number = 2,
  cells: Record<CellKey, string> = {}
): TableBlock {
  return {
    id: crypto.randomUUID(),
    type: 'table',
    position,
    rows,
    columns,
    cells,
  }
}

// ============================================================================
// VALIDATION CONSTANTS
// ============================================================================

/**
 * Maximum content length constraints
 */
export const BLOCK_CONSTRAINTS = {
  /** Maximum content blocks per note */
  MAX_BLOCKS_PER_NOTE: 25,
  
  /** Maximum text content length */
  TEXT_MAX_LENGTH: 10000,
  
  /** Maximum checklist items per block */
  CHECKLIST_MAX_ITEMS: 100,
  
  /** Maximum checklist item text length */
  CHECKLIST_ITEM_MAX_LENGTH: 500,
  
  /** Table constraints */
  TABLE_MIN_ROWS: 1,
  TABLE_MAX_ROWS: 50,
  TABLE_MIN_COLUMNS: 1,
  TABLE_MAX_COLUMNS: 20,
  TABLE_CELL_MAX_LENGTH: 1000,
} as const
