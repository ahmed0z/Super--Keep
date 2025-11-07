/**
 * Note Type Definitions
 * Defines the core Note entity structure
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
  | 'pink';

export type BlockType = 'text' | 'checklist' | 'table';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string;
}

export interface ChecklistItem {
  id: string;
  text: string;
  checked: boolean;
  order: number;
}

export interface ChecklistBlock extends BaseBlock {
  type: 'checklist';
  items: ChecklistItem[];
}

export interface TableCell {
  value: string;
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  rows: number;
  cols: number;
  data: TableCell[][];
}

export type Block = TextBlock | ChecklistBlock | TableBlock;

export interface Note {
  id: string;
  title: string;
  blocks: Block[];
  color: NoteColor;
  pinned: boolean;
  archived: boolean;
  tags: string[];
  createdAt: string; // ISO 8601 timestamp
  updatedAt: string; // ISO 8601 timestamp
}

export interface NoteCreateInput {
  title?: string;
  blocks?: Block[];
  color?: NoteColor;
  pinned?: boolean;
  tags?: string[];
}

export interface NoteUpdateInput {
  title?: string;
  blocks?: Block[];
  color?: NoteColor;
  pinned?: boolean;
  archived?: boolean;
  tags?: string[];
}
