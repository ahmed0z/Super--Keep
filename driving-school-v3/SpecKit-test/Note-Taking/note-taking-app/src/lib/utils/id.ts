/**
 * ID Generation Utilities
 * Functions for generating unique identifiers
 */

import { v4 as uuidv4 } from 'uuid';

export function generateId(): string {
  return uuidv4();
}

export function generateNoteId(): string {
  return `note_${generateId()}`;
}

export function generateBlockId(): string {
  return `block_${generateId()}`;
}

export function generateChecklistItemId(): string {
  return `item_${generateId()}`;
}

export function isValidUUID(id: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(id);
}
