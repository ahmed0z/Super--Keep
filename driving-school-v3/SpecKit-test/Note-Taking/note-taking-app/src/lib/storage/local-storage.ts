/**
 * Local Storage Service
 * Implements StorageAdapter using browser localStorage
 */

import { Note, NoteCreateInput, NoteUpdateInput, StorageAdapter, StorageError } from '@/types';
import { generateId, getCurrentTimestamp } from '@/lib/utils';
import { noteSchema, noteCreateInputSchema, noteUpdateInputSchema } from '@/lib/validation/note-schema';
import { validateOrThrow } from '@/lib/validation';

const STORAGE_KEY = 'notes';

export class LocalStorageService implements StorageAdapter {
  private getNotesFromStorage(): Note[] {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error('Failed to read from localStorage:', error);
      return [];
    }
  }

  private saveNotesToStorage(notes: Note[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
    } catch (error) {
      const storageError: StorageError = new Error('Failed to save notes') as StorageError;
      storageError.code = 'STORAGE_FULL';
      storageError.details = error;
      throw storageError;
    }
  }

  async getAllNotes(): Promise<Note[]> {
    const notes = this.getNotesFromStorage();
    // Sort by pinned first, then by updatedAt descending
    return notes.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
  }

  async getNoteById(id: string): Promise<Note | null> {
    const notes = this.getNotesFromStorage();
    const note = notes.find((n) => n.id === id);
    return note || null;
  }

  async createNote(input: NoteCreateInput): Promise<Note> {
    // Validate input
    validateOrThrow(noteCreateInputSchema, input, 'Invalid note input');

    const notes = this.getNotesFromStorage();
    const now = getCurrentTimestamp();

    const newNote: Note = {
      id: generateId(),
      title: input.title || '',
      blocks: input.blocks || [],
      color: input.color || 'default',
      pinned: input.pinned || false,
      archived: false,
      tags: input.tags || [],
      createdAt: now,
      updatedAt: now,
    };

    // Validate the complete note
    validateOrThrow(noteSchema, newNote, 'Invalid note data');

    notes.push(newNote);
    this.saveNotesToStorage(notes);

    return newNote;
  }

  async updateNote(id: string, input: NoteUpdateInput): Promise<Note> {
    // Validate input
    validateOrThrow(noteUpdateInputSchema, input, 'Invalid update input');

    const notes = this.getNotesFromStorage();
    const noteIndex = notes.findIndex((n) => n.id === id);

    if (noteIndex === -1) {
      const error: StorageError = new Error(`Note with id ${id} not found`) as StorageError;
      error.code = 'NOT_FOUND';
      throw error;
    }

    const updatedNote: Note = {
      ...notes[noteIndex],
      ...input,
      updatedAt: getCurrentTimestamp(),
    };

    // Validate the updated note
    validateOrThrow(noteSchema, updatedNote, 'Invalid updated note data');

    notes[noteIndex] = updatedNote;
    this.saveNotesToStorage(notes);

    return updatedNote;
  }

  async deleteNote(id: string): Promise<void> {
    const notes = this.getNotesFromStorage();
    const filteredNotes = notes.filter((n) => n.id !== id);

    if (filteredNotes.length === notes.length) {
      const error: StorageError = new Error(`Note with id ${id} not found`) as StorageError;
      error.code = 'NOT_FOUND';
      throw error;
    }

    this.saveNotesToStorage(filteredNotes);
  }

  async bulkDeleteNotes(ids: string[]): Promise<void> {
    const notes = this.getNotesFromStorage();
    const idsSet = new Set(ids);
    const filteredNotes = notes.filter((n) => !idsSet.has(n.id));
    this.saveNotesToStorage(filteredNotes);
  }

  async searchNotes(query: string): Promise<Note[]> {
    if (!query.trim()) {
      return this.getAllNotes();
    }

    const notes = this.getNotesFromStorage();
    const lowerQuery = query.toLowerCase();

    return notes.filter((note) => {
      // Search in title
      if (note.title.toLowerCase().includes(lowerQuery)) {
        return true;
      }

      // Search in text blocks
      for (const block of note.blocks) {
        if (block.type === 'text' && block.content.toLowerCase().includes(lowerQuery)) {
          return true;
        }
        if (block.type === 'checklist') {
          if (block.items.some((item: { text: string }) => item.text.toLowerCase().includes(lowerQuery))) {
            return true;
          }
        }
      }

      // Search in tags
      if (note.tags.some((tag: string) => tag.toLowerCase().includes(lowerQuery))) {
        return true;
      }

      return false;
    });
  }

  async getNotesByTag(tag: string): Promise<Note[]> {
    const notes = this.getNotesFromStorage();
    return notes.filter((note) => note.tags.includes(tag));
  }

  async getPinnedNotes(): Promise<Note[]> {
    const notes = this.getNotesFromStorage();
    return notes.filter((note) => note.pinned && !note.archived);
  }

  async getArchivedNotes(): Promise<Note[]> {
    const notes = this.getNotesFromStorage();
    return notes.filter((note) => note.archived);
  }
}

// Export singleton instance
export const localStorageService = new LocalStorageService();
