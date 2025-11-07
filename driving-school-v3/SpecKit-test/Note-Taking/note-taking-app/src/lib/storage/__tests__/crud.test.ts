/**
 * CRUD Operations Tests
 * Tests for note creation, reading, updating, and deletion
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { localStorageService } from '@/lib/storage';
import { Note, NoteCreateInput, NoteUpdateInput } from '@/types';

// Mock localStorage
const mockStorage: Record<string, string> = {};

beforeEach(() => {
  // Clear mock storage before each test
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
  
  // Mock localStorage methods
  global.localStorage = {
    getItem: (key: string) => mockStorage[key] || null,
    setItem: (key: string, value: string) => {
      mockStorage[key] = value;
    },
    removeItem: (key: string) => {
      delete mockStorage[key];
    },
    clear: () => {
      Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
    },
    get length() {
      return Object.keys(mockStorage).length;
    },
    key: (index: number) => Object.keys(mockStorage)[index] || null,
  };
});

afterEach(() => {
  // Clean up after each test
  Object.keys(mockStorage).forEach(key => delete mockStorage[key]);
});

describe('Note CRUD Operations', () => {
  describe('Create', () => {
    it('should create a note with default values', async () => {
      const input: NoteCreateInput = {
        title: 'Test Note'
      };

      const note = await localStorageService.createNote(input);

      expect(note.id).toBeDefined();
      expect(note.title).toBe('Test Note');
      expect(note.blocks).toHaveLength(1);
      expect(note.blocks[0].type).toBe('text');
      expect(note.color).toBe('default');
      expect(note.pinned).toBe(false);
      expect(note.archived).toBe(false);
      expect(note.tags).toEqual([]);
      expect(note.createdAt).toBeDefined();
      expect(note.updatedAt).toBeDefined();
    });

    it('should create a note with custom values', async () => {
      const input: NoteCreateInput = {
        title: 'Custom Note',
        blocks: [{
          id: 'block-1',
          type: 'text',
          content: 'Custom content',
          order: 0
        }],
        color: 'blue',
        pinned: true,
        tags: ['work', 'important']
      };

      const note = await localStorageService.createNote(input);

      expect(note.title).toBe('Custom Note');
      expect(note.blocks).toHaveLength(1);
      expect(note.blocks[0].type).toBe('text');
      if (note.blocks[0].type === 'text') {
        expect(note.blocks[0].content).toBe('Custom content');
      }
      expect(note.color).toBe('blue');
      expect(note.pinned).toBe(true);
      expect(note.tags).toEqual(['work', 'important']);
    });

    it('should handle empty title', async () => {
      const input: NoteCreateInput = {
        title: ''
      };

      const note = await localStorageService.createNote(input);
      expect(note.title).toBe('Untitled');
    });
  });

  describe('Read', () => {
    it('should get all notes', async () => {
      await localStorageService.createNote({ title: 'Note 1' });
      await localStorageService.createNote({ title: 'Note 2' });

      const notes = await localStorageService.getAllNotes();
      expect(notes).toHaveLength(2);
    });

    it('should get note by ID', async () => {
      const created = await localStorageService.createNote({ title: 'Test Note' });
      const retrieved = await localStorageService.getNoteById(created.id);

      expect(retrieved).toBeDefined();
      expect(retrieved?.id).toBe(created.id);
      expect(retrieved?.title).toBe('Test Note');
    });

    it('should return undefined for non-existent note', async () => {
      const note = await localStorageService.getNoteById('non-existent-id');
      expect(note).toBeUndefined();
    });

    it('should get pinned notes', async () => {
      await localStorageService.createNote({ title: 'Regular' });
      await localStorageService.createNote({ title: 'Pinned', pinned: true });

      const pinned = await localStorageService.getPinnedNotes();
      expect(pinned).toHaveLength(1);
      expect(pinned[0].title).toBe('Pinned');
    });

    it('should get archived notes', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      await localStorageService.updateNote(note.id, { archived: true });

      const archived = await localStorageService.getArchivedNotes();
      expect(archived).toHaveLength(1);
      expect(archived[0].archived).toBe(true);
    });
  });

  describe('Update', () => {
    it('should update note title', async () => {
      const note = await localStorageService.createNote({ title: 'Original' });
      const updated = await localStorageService.updateNote(note.id, { title: 'Updated' });

      expect(updated.title).toBe('Updated');
      expect(updated.id).toBe(note.id);
      expect(new Date(updated.updatedAt).getTime()).toBeGreaterThan(new Date(note.updatedAt).getTime());
    });

    it('should update note color', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      const updated = await localStorageService.updateNote(note.id, { color: 'red' });

      expect(updated.color).toBe('red');
    });

    it('should pin note', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      const updated = await localStorageService.updateNote(note.id, { pinned: true });

      expect(updated.pinned).toBe(true);
    });

    it('should archive note', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      const updated = await localStorageService.updateNote(note.id, { archived: true });

      expect(updated.archived).toBe(true);
    });

    it('should update tags', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      const updated = await localStorageService.updateNote(note.id, { 
        tags: ['work', 'important'] 
      });

      expect(updated.tags).toEqual(['work', 'important']);
    });

    it('should throw error for non-existent note', async () => {
      await expect(
        localStorageService.updateNote('non-existent', { title: 'Test' })
      ).rejects.toThrow('Note not found');
    });
  });

  describe('Delete', () => {
    it('should delete note', async () => {
      const note = await localStorageService.createNote({ title: 'Test' });
      await localStorageService.deleteNote(note.id);

      const retrieved = await localStorageService.getNoteById(note.id);
      expect(retrieved).toBeUndefined();
    });

    it('should throw error when deleting non-existent note', async () => {
      await expect(
        localStorageService.deleteNote('non-existent')
      ).rejects.toThrow('Note not found');
    });

    it('should bulk delete notes', async () => {
      const note1 = await localStorageService.createNote({ title: 'Note 1' });
      const note2 = await localStorageService.createNote({ title: 'Note 2' });
      const note3 = await localStorageService.createNote({ title: 'Note 3' });

      await localStorageService.bulkDeleteNotes([note1.id, note2.id]);

      const remaining = await localStorageService.getAllNotes();
      expect(remaining).toHaveLength(1);
      expect(remaining[0].id).toBe(note3.id);
    });
  });

  describe('Search', () => {
    beforeEach(async () => {
      await localStorageService.createNote({ 
        title: 'JavaScript Tutorial',
        blocks: [{
          id: '1',
          type: 'text',
          content: 'Learn about promises',
          order: 0
        }]
      });
      await localStorageService.createNote({ 
        title: 'TypeScript Guide',
        blocks: [{
          id: '2',
          type: 'text',
          content: 'Advanced types',
          order: 0
        }]
      });
    });

    it('should search notes by title', async () => {
      const results = await localStorageService.searchNotes('JavaScript');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });

    it('should search notes by content', async () => {
      const results = await localStorageService.searchNotes('promises');
      expect(results).toHaveLength(1);
      expect(results[0].title).toBe('JavaScript Tutorial');
    });

    it('should be case-insensitive', async () => {
      const results = await localStorageService.searchNotes('javascript');
      expect(results).toHaveLength(1);
    });

    it('should return empty array for no matches', async () => {
      const results = await localStorageService.searchNotes('Python');
      expect(results).toHaveLength(0);
    });
  });

  describe('Tags', () => {
    beforeEach(async () => {
      await localStorageService.createNote({ 
        title: 'Work Note',
        tags: ['work', 'important']
      });
      await localStorageService.createNote({ 
        title: 'Personal Note',
        tags: ['personal']
      });
    });

    it('should get notes by tag', async () => {
      const notes = await localStorageService.getNotesByTag('work');
      expect(notes).toHaveLength(1);
      expect(notes[0].title).toBe('Work Note');
    });

    it('should return empty array for non-existent tag', async () => {
      const notes = await localStorageService.getNotesByTag('shopping');
      expect(notes).toHaveLength(0);
    });
  });
});
