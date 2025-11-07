/**
 * Notes Store
 * Zustand store for managing notes state
 */

import { create } from 'zustand';
import { Note, NoteCreateInput, NoteUpdateInput, NoteColor } from '@/types';
import { localStorageService } from '@/lib/storage';

interface NotesState {
  notes: Note[];
  loading: boolean;
  error: string | null;
  selectedNotes: Set<string>;
  
  // Actions
  fetchNotes: () => Promise<void>;
  createNote: (input: NoteCreateInput) => Promise<Note>;
  updateNote: (id: string, input: NoteUpdateInput) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  bulkDeleteNotes: (ids: string[]) => Promise<void>;
  bulkUpdateNotes: (ids: string[], updates: NoteUpdateInput) => Promise<void>;
  searchNotes: (query: string) => Promise<Note[]>;
  getNotesByTag: (tag: string) => Promise<Note[]>;
  getPinnedNotes: () => Promise<Note[]>;
  getArchivedNotes: () => Promise<Note[]>;
  
  // Selection
  toggleNoteSelection: (id: string) => void;
  selectAllNotes: () => void;
  clearSelection: () => void;
  
  // Optimistic updates
  setNotes: (notes: Note[]) => void;
  addNote: (note: Note) => void;
  removeNote: (id: string) => void;
  updateNoteLocal: (id: string, updates: Partial<Note>) => void;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  loading: false,
  error: null,
  selectedNotes: new Set<string>(),

  fetchNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await localStorageService.getAllNotes();
      set({ notes, loading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch notes',
        loading: false,
      });
    }
  },

  createNote: async (input: NoteCreateInput) => {
    set({ loading: true, error: null });
    try {
      const note = await localStorageService.createNote(input);
      set((state) => ({
        notes: [note, ...state.notes],
        loading: false,
      }));
      return note;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to create note',
        loading: false,
      });
      throw error;
    }
  },

  updateNote: async (id: string, input: NoteUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const updatedNote = await localStorageService.updateNote(id, input);
      set((state) => ({
        notes: state.notes.map((note) => (note.id === id ? updatedNote : note)),
        loading: false,
      }));
      return updatedNote;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update note',
        loading: false,
      });
      throw error;
    }
  },

  deleteNote: async (id: string) => {
    set({ loading: true, error: null });
    try {
      await localStorageService.deleteNote(id);
      set((state) => ({
        notes: state.notes.filter((note) => note.id !== id),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete note',
        loading: false,
      });
      throw error;
    }
  },

  bulkDeleteNotes: async (ids: string[]) => {
    set({ loading: true, error: null });
    try {
      await localStorageService.bulkDeleteNotes(ids);
      const idsSet = new Set(ids);
      set((state) => ({
        notes: state.notes.filter((note) => !idsSet.has(note.id)),
        selectedNotes: new Set(),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to delete notes',
        loading: false,
      });
      throw error;
    }
  },

  bulkUpdateNotes: async (ids: string[], updates: NoteUpdateInput) => {
    set({ loading: true, error: null });
    try {
      const idsSet = new Set(ids);
      const promises = ids.map(id => localStorageService.updateNote(id, updates));
      const updatedNotes = await Promise.all(promises);
      const updatedNotesMap = new Map(updatedNotes.map(note => [note.id, note]));
      
      set((state) => ({
        notes: state.notes.map((note) => 
          idsSet.has(note.id) ? (updatedNotesMap.get(note.id) || note) : note
        ),
        selectedNotes: new Set(),
        loading: false,
      }));
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to update notes',
        loading: false,
      });
      throw error;
    }
  },

  searchNotes: async (query: string) => {
    set({ loading: true, error: null });
    try {
      const notes = await localStorageService.searchNotes(query);
      set({ loading: false });
      return notes;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to search notes',
        loading: false,
      });
      throw error;
    }
  },

  getNotesByTag: async (tag: string) => {
    set({ loading: true, error: null });
    try {
      const notes = await localStorageService.getNotesByTag(tag);
      set({ loading: false });
      return notes;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get notes by tag',
        loading: false,
      });
      throw error;
    }
  },

  getPinnedNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await localStorageService.getPinnedNotes();
      set({ loading: false });
      return notes;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get pinned notes',
        loading: false,
      });
      throw error;
    }
  },

  getArchivedNotes: async () => {
    set({ loading: true, error: null });
    try {
      const notes = await localStorageService.getArchivedNotes();
      set({ loading: false });
      return notes;
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to get archived notes',
        loading: false,
      });
      throw error;
    }
  },

  // Selection management
  toggleNoteSelection: (id: string) =>
    set((state) => {
      const newSelected = new Set(state.selectedNotes);
      if (newSelected.has(id)) {
        newSelected.delete(id);
      } else {
        newSelected.add(id);
      }
      return { selectedNotes: newSelected };
    }),

  selectAllNotes: () =>
    set((state) => ({
      selectedNotes: new Set(state.notes.map(n => n.id))
    })),

  clearSelection: () =>
    set({ selectedNotes: new Set() }),

  // Optimistic update helpers
  setNotes: (notes: Note[]) => set({ notes }),

  addNote: (note: Note) =>
    set((state) => ({ notes: [note, ...state.notes] })),

  removeNote: (id: string) =>
    set((state) => ({ notes: state.notes.filter((note) => note.id !== id) })),

  updateNoteLocal: (id: string, updates: Partial<Note>) =>
    set((state) => ({
      notes: state.notes.map((note) =>
        note.id === id ? { ...note, ...updates } : note
      ),
    })),
}));
