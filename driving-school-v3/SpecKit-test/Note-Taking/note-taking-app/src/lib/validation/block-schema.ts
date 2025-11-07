/**
 * Block Validation Schemas
 * Zod schemas for validating block structures
 */

import { z } from 'zod';

// Checklist Item Schema
export const checklistItemSchema = z.object({
  id: z.string().uuid(),
  text: z.string().max(500),
  checked: z.boolean(),
  order: z.number().int().min(0)
});

// Checklist Block Schema
export const checklistBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('checklist'),
  items: z.array(checklistItemSchema),
  order: z.number().int().min(0)
});

// Table Cell Schema
export const tableCellSchema = z.object({
  value: z.string().max(500)
});

// Table Block Schema
export const tableBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('table'),
  rows: z.number().int().min(1).max(50),
  cols: z.number().int().min(1).max(20),
  data: z.array(z.array(tableCellSchema)),
  order: z.number().int().min(0)
}).refine(
  (data) => data.data.length === data.rows,
  { message: 'Data rows count must match rows property' }
).refine(
  (data) => data.data.every(row => row.length === data.cols),
  { message: 'All rows must have the same number of columns' }
);

// Text Block Schema
export const textBlockSchema = z.object({
  id: z.string().uuid(),
  type: z.literal('text'),
  content: z.string().max(50000),
  order: z.number().int().min(0)
});

// Combined Block Schema
export const blockSchema = z.discriminatedUnion('type', [
  textBlockSchema,
  checklistBlockSchema,
  tableBlockSchema
]);

// Block array validation
export const blocksArraySchema = z.array(blockSchema).min(1);
