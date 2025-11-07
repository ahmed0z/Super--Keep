/**
 * Note Validation Schemas
 * Zod schemas for runtime validation of note-related data
 */

import { z } from 'zod';

// Color schema
export const noteColorSchema = z.enum([
  'default',
  'red',
  'orange',
  'yellow',
  'green',
  'teal',
  'blue',
  'purple',
  'pink',
]);

// Block schemas
export const baseBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.enum(['text', 'checklist', 'table']),
  order: z.number().int().nonnegative(),
});

export const textBlockSchema = baseBlockSchema.extend({
  type: z.literal('text'),
  content: z.string().max(10000, 'Text content is too long'),
});

export const checklistItemSchema = z.object({
  id: z.string().uuid(),
  text: z.string().min(1, 'Checklist item cannot be empty').max(500),
  checked: z.boolean(),
  order: z.number().int().nonnegative(),
});

export const checklistBlockSchema = baseBlockSchema.extend({
  type: z.literal('checklist'),
  items: z.array(checklistItemSchema).max(100, 'Too many checklist items'),
});

export const tableCellSchema = z.object({
  value: z.string().max(500),
});

export const tableBlockSchema = baseBlockSchema.extend({
  type: z.literal('table'),
  rows: z.number().int().min(1).max(20, 'Too many rows'),
  cols: z.number().int().min(1).max(10, 'Too many columns'),
  data: z.array(z.array(tableCellSchema)),
}).refine(
  (table) => table.data.length === table.rows,
  'Row count mismatch'
).refine(
  (table) => table.data.every((row) => row.length === table.cols),
  'Column count mismatch'
);

export const blockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  checklistBlockSchema,
  tableBlockSchema,
]);

// Note schemas
export const noteSchema = z.object({
  id: z.string().uuid(),
  title: z.string().max(200, 'Title is too long'),
  blocks: z.array(blockSchema).max(50, 'Too many blocks'),
  color: noteColorSchema,
  pinned: z.boolean(),
  archived: z.boolean(),
  tags: z.array(z.string().min(1).max(30)).max(10, 'Too many tags'),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});

export const noteCreateInputSchema = z.object({
  title: z.string().max(200).optional(),
  blocks: z.array(blockSchema).max(50).optional(),
  color: noteColorSchema.optional(),
  pinned: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
});

export const noteUpdateInputSchema = z.object({
  title: z.string().max(200).optional(),
  blocks: z.array(blockSchema).max(50).optional(),
  color: noteColorSchema.optional(),
  pinned: z.boolean().optional(),
  archived: z.boolean().optional(),
  tags: z.array(z.string().min(1).max(30)).max(10).optional(),
}).refine(
  (data) => Object.keys(data).length > 0,
  'At least one field must be provided for update'
);

// Type inference
export type NoteSchemaType = z.infer<typeof noteSchema>;
export type NoteCreateInputSchemaType = z.infer<typeof noteCreateInputSchema>;
export type NoteUpdateInputSchemaType = z.infer<typeof noteUpdateInputSchema>;
export type BlockSchemaType = z.infer<typeof blockSchema>;
