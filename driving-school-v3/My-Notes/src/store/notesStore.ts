/**
 * Notes store using Zustand with persistence to IndexedDB.
 * Manages all note-related state and operations.
 */
import { create } from 'zustand';
import { v4 as uuidv4 } from 'uuid';
import type { Note, NoteColor, ChecklistItem, Reminder, Collaborator, NoteFilter } from '../types';
import { notesStorage, syncQueueStorage, isOnline } from '../services/storage';
import { useToastStore } from './toastStore';

interface NotesState {
  notes: Note[];
  isLoading: boolean;
  isInitialized: boolean;
  selectedNoteIds: string[];
  editingNoteId: string | null;

  // Actions
  initialize: () => Promise<void>;
  createNote: (note: Partial<Note>) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<void>;
  deleteNote: (id: string) => Promise<void>;
  duplicateNote: (id: string) => Promise<Note>;

  // Bulk operations
  bulkPin: (ids: string[], pinned: boolean) => Promise<void>;
  bulkArchive: (ids: string[], archived: boolean) => Promise<void>;
  bulkDelete: (ids: string[]) => Promise<void>;
  bulkSetColor: (ids: string[], color: NoteColor) => Promise<void>;
  bulkAddLabel: (ids: string[], labelId: string) => Promise<void>;

  // Note-specific operations
  togglePin: (id: string) => Promise<void>;
  toggleArchive: (id: string) => Promise<void>;
  moveToTrash: (id: string) => Promise<void>;
  restoreFromTrash: (id: string) => Promise<void>;
  permanentlyDelete: (id: string) => Promise<void>;
  emptyTrash: () => Promise<void>;
  setColor: (id: string, color: NoteColor) => Promise<void>;
  addLabel: (id: string, labelId: string) => Promise<void>;
  removeLabel: (id: string, labelId: string) => Promise<void>;
  setReminder: (id: string, reminder: Reminder | undefined) => Promise<void>;
  addCollaborator: (id: string, collaborator: Omit<Collaborator, 'id' | 'addedAt'>) => Promise<void>;
  removeCollaborator: (id: string, collaboratorId: string) => Promise<void>;

  // Checklist operations
  addChecklistItem: (noteId: string, text: string) => Promise<void>;
  updateChecklistItem: (noteId: string, itemId: string, updates: Partial<ChecklistItem>) => Promise<void>;
  deleteChecklistItem: (noteId: string, itemId: string) => Promise<void>;
  toggleChecklistItem: (noteId: string, itemId: string) => Promise<void>;
  reorderChecklistItems: (noteId: string, items: ChecklistItem[]) => Promise<void>;

  // Selection
  setSelectedNotes: (ids: string[]) => void;
  clearSelection: () => void;
  setEditingNote: (id: string | null) => void;

  // Filtering
  getFilteredNotes: (filter: NoteFilter) => Note[];
  getPinnedNotes: () => Note[];
  getUnpinnedNotes: () => Note[];
  getArchivedNotes: () => Note[];
  getTrashedNotes: () => Note[];
  getNotesByLabel: (labelId: string) => Note[];
  getNotesWithReminders: () => Note[];

  // Reordering
  reorderNotes: (noteIds: string[], newOrder: number[]) => Promise<void>;
}

export const useNotesStore = create<NotesState>((set, get) => ({
  notes: [],
  isLoading: true,
  isInitialized: false,
  selectedNoteIds: [],
  editingNoteId: null,

  initialize: async () => {
    try {
      const notes = await notesStorage.getAll();
      set({ notes, isLoading: false, isInitialized: true });

      // Clean up old trashed notes (older than 7 days)
      const sevenDaysAgo = new Date();
      sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

      const oldTrashedNotes = notes.filter(
        (note) => note.isTrashed && note.trashedAt && new Date(note.trashedAt) < sevenDaysAgo
      );

      for (const note of oldTrashedNotes) {
        await notesStorage.delete(note.id);
      }

      if (oldTrashedNotes.length > 0) {
        set((state) => ({
          notes: state.notes.filter((n) => !oldTrashedNotes.find((t) => t.id === n.id)),
        }));
      }
    } catch (error) {
      console.error('Failed to initialize notes:', error);
      set({ isLoading: false, isInitialized: true });
    }
  },

  createNote: async (noteData) => {
    const now = new Date().toISOString();
    const maxOrder = Math.max(0, ...get().notes.map((n) => n.order));

    const newNote: Note = {
      id: uuidv4(),
      title: noteData.title || '',
      content: noteData.content || '',
      type: noteData.type || 'text',
      checklistItems: noteData.checklistItems || [],
      blocks: noteData.blocks || [],
      color: noteData.color || 'default',
      labels: noteData.labels || [],
      isPinned: noteData.isPinned || false,
      isArchived: false,
      isTrashed: false,
      collaborators: [],
      createdAt: now,
      updatedAt: now,
      order: maxOrder + 1,
      syncStatus: isOnline() ? 'synced' : 'pending',
    };

    await notesStorage.set(newNote);
    set((state) => ({ notes: [...state.notes, newNote] }));

    // Queue for sync if offline
    if (!isOnline()) {
      await syncQueueStorage.add({
        id: uuidv4(),
        entityType: 'note',
        entityId: newNote.id,
        operation: 'create',
        data: newNote,
        timestamp: now,
        retryCount: 0,
      });
    }

    useToastStore.getState().showToast('Note created', 'success');
    return newNote;
  },

  updateNote: async (id, updates) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const updatedNote: Note = {
      ...note,
      ...updates,
      updatedAt: new Date().toISOString(),
      syncStatus: isOnline() ? 'synced' : 'pending',
    };

    await notesStorage.set(updatedNote);
    set((state) => ({
      notes: state.notes.map((n) => (n.id === id ? updatedNote : n)),
    }));

    if (!isOnline()) {
      await syncQueueStorage.add({
        id: uuidv4(),
        entityType: 'note',
        entityId: id,
        operation: 'update',
        data: updates,
        timestamp: new Date().toISOString(),
        retryCount: 0,
      });
    }
  },

  deleteNote: async (id) => {
    await notesStorage.delete(id);
    set((state) => ({
      notes: state.notes.filter((n) => n.id !== id),
      selectedNoteIds: state.selectedNoteIds.filter((nid) => nid !== id),
    }));

    if (!isOnline()) {
      await syncQueueStorage.add({
        id: uuidv4(),
        entityType: 'note',
        entityId: id,
        operation: 'delete',
        data: {},
        timestamp: new Date().toISOString(),
        retryCount: 0,
      });
    }
  },

  duplicateNote: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) throw new Error('Note not found');

    const duplicatedNote = await get().createNote({
      ...note,
      title: note.title ? `${note.title} (copy)` : '',
      isPinned: false,
      isArchived: false,
      isTrashed: false,
      checklistItems: note.checklistItems.map((item) => ({
        ...item,
        id: uuidv4(),
      })),
    });

    useToastStore.getState().showToast('Note duplicated', 'success');
    return duplicatedNote;
  },

  // Bulk operations
  bulkPin: async (ids, pinned) => {
    for (const id of ids) {
      await get().updateNote(id, { isPinned: pinned });
    }
    get().clearSelection();
    useToastStore.getState().showToast(pinned ? 'Notes pinned' : 'Notes unpinned', 'success');
  },

  bulkArchive: async (ids, archived) => {
    for (const id of ids) {
      await get().updateNote(id, { isArchived: archived, isPinned: false });
    }
    get().clearSelection();
    useToastStore.getState().showToast(archived ? 'Notes archived' : 'Notes unarchived', 'success');
  },

  bulkDelete: async (ids) => {
    const now = new Date().toISOString();
    for (const id of ids) {
      await get().updateNote(id, { isTrashed: true, trashedAt: now, isPinned: false });
    }
    get().clearSelection();
    useToastStore.getState().showToast('Notes moved to trash', 'success');
  },

  bulkSetColor: async (ids, color) => {
    for (const id of ids) {
      await get().updateNote(id, { color });
    }
    get().clearSelection();
  },

  bulkAddLabel: async (ids, labelId) => {
    for (const id of ids) {
      const note = get().notes.find((n) => n.id === id);
      if (note && !note.labels.includes(labelId)) {
        await get().updateNote(id, { labels: [...note.labels, labelId] });
      }
    }
    get().clearSelection();
  },

  // Note-specific operations
  togglePin: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    await get().updateNote(id, { isPinned: !note.isPinned });
    useToastStore.getState().showToast(note.isPinned ? 'Note unpinned' : 'Note pinned', 'success');
  },

  toggleArchive: async (id) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    await get().updateNote(id, {
      isArchived: !note.isArchived,
      isPinned: false,
    });
    useToastStore.getState().showToast(
      note.isArchived ? 'Note unarchived' : 'Note archived',
      'success'
    );
  },

  moveToTrash: async (id) => {
    await get().updateNote(id, {
      isTrashed: true,
      trashedAt: new Date().toISOString(),
      isPinned: false,
    });
    useToastStore.getState().showToast('Note moved to trash', 'success');
  },

  restoreFromTrash: async (id) => {
    await get().updateNote(id, {
      isTrashed: false,
      trashedAt: undefined,
    });
    useToastStore.getState().showToast('Note restored', 'success');
  },

  permanentlyDelete: async (id) => {
    await get().deleteNote(id);
    useToastStore.getState().showToast('Note permanently deleted', 'success');
  },

  emptyTrash: async () => {
    const trashedNotes = get().notes.filter((n) => n.isTrashed);
    for (const note of trashedNotes) {
      await get().deleteNote(note.id);
    }
    useToastStore.getState().showToast('Trash emptied', 'success');
  },

  setColor: async (id, color) => {
    await get().updateNote(id, { color });
  },

  addLabel: async (id, labelId) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note || note.labels.includes(labelId)) return;
    await get().updateNote(id, { labels: [...note.labels, labelId] });
  },

  removeLabel: async (id, labelId) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    await get().updateNote(id, { labels: note.labels.filter((l) => l !== labelId) });
  },

  setReminder: async (id, reminder) => {
    await get().updateNote(id, { reminder });
    if (reminder) {
      useToastStore.getState().showToast('Reminder set', 'success');
    } else {
      useToastStore.getState().showToast('Reminder removed', 'success');
    }
  },

  addCollaborator: async (id, collaborator) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;

    const newCollaborator: Collaborator = {
      id: uuidv4(),
      ...collaborator,
      addedAt: new Date().toISOString(),
    };

    await get().updateNote(id, {
      collaborators: [...note.collaborators, newCollaborator],
    });
    useToastStore.getState().showToast('Collaborator added', 'success');
  },

  removeCollaborator: async (id, collaboratorId) => {
    const note = get().notes.find((n) => n.id === id);
    if (!note) return;
    await get().updateNote(id, {
      collaborators: note.collaborators.filter((c) => c.id !== collaboratorId),
    });
    useToastStore.getState().showToast('Collaborator removed', 'success');
  },

  // Checklist operations
  addChecklistItem: async (noteId, text) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (!note) return;

    const maxOrder = Math.max(0, ...note.checklistItems.map((i) => i.order));
    const newItem: ChecklistItem = {
      id: uuidv4(),
      text,
      checked: false,
      order: maxOrder + 1,
    };

    await get().updateNote(noteId, {
      checklistItems: [...note.checklistItems, newItem],
    });
  },

  updateChecklistItem: async (noteId, itemId, updates) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (!note) return;

    await get().updateNote(noteId, {
      checklistItems: note.checklistItems.map((item) =>
        item.id === itemId ? { ...item, ...updates } : item
      ),
    });
  },

  deleteChecklistItem: async (noteId, itemId) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (!note) return;

    await get().updateNote(noteId, {
      checklistItems: note.checklistItems.filter((item) => item.id !== itemId),
    });
  },

  toggleChecklistItem: async (noteId, itemId) => {
    const note = get().notes.find((n) => n.id === noteId);
    if (!note) return;

    const item = note.checklistItems.find((i) => i.id === itemId);
    if (!item) return;

    await get().updateChecklistItem(noteId, itemId, { checked: !item.checked });
  },

  reorderChecklistItems: async (noteId, items) => {
    await get().updateNote(noteId, { checklistItems: items });
  },

  // Selection
  setSelectedNotes: (ids) => set({ selectedNoteIds: ids }),
  clearSelection: () => set({ selectedNoteIds: [] }),
  setEditingNote: (id) => set({ editingNoteId: id }),

  // Filtering
  getFilteredNotes: (filter) => {
    let notes = get().notes;

    // Exclude trashed and archived by default
    if (!filter.isTrashed) {
      notes = notes.filter((n) => !n.isTrashed);
    }
    if (!filter.isArchived) {
      notes = notes.filter((n) => !n.isArchived);
    }

    if (filter.labelId) {
      notes = notes.filter((n) => n.labels.includes(filter.labelId!));
    }
    if (filter.isPinned !== undefined) {
      notes = notes.filter((n) => n.isPinned === filter.isPinned);
    }
    if (filter.isArchived !== undefined) {
      notes = notes.filter((n) => n.isArchived === filter.isArchived);
    }
    if (filter.isTrashed !== undefined) {
      notes = notes.filter((n) => n.isTrashed === filter.isTrashed);
    }
    if (filter.color) {
      notes = notes.filter((n) => n.color === filter.color);
    }
    if (filter.hasReminder) {
      notes = notes.filter((n) => n.reminder !== undefined);
    }

    return notes;
  },

  getPinnedNotes: () =>
    get()
      .notes.filter((n) => n.isPinned && !n.isArchived && !n.isTrashed)
      .sort((a, b) => b.order - a.order),

  getUnpinnedNotes: () =>
    get()
      .notes.filter((n) => !n.isPinned && !n.isArchived && !n.isTrashed)
      .sort((a, b) => b.order - a.order),

  getArchivedNotes: () =>
    get()
      .notes.filter((n) => n.isArchived && !n.isTrashed)
      .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()),

  getTrashedNotes: () =>
    get()
      .notes.filter((n) => n.isTrashed)
      .sort((a, b) => new Date(b.trashedAt || b.updatedAt).getTime() - new Date(a.trashedAt || a.updatedAt).getTime()),

  getNotesByLabel: (labelId) =>
    get()
      .notes.filter((n) => n.labels.includes(labelId) && !n.isArchived && !n.isTrashed)
      .sort((a, b) => b.order - a.order),

  getNotesWithReminders: () =>
    get()
      .notes.filter((n) => n.reminder && !n.isArchived && !n.isTrashed)
      .sort((a, b) => {
        if (!a.reminder || !b.reminder) return 0;
        return new Date(a.reminder.dateTime).getTime() - new Date(b.reminder.dateTime).getTime();
      }),

  reorderNotes: async (noteIds, newOrder) => {
    for (let i = 0; i < noteIds.length; i++) {
      await get().updateNote(noteIds[i], { order: newOrder[i] });
    }
  },
}));
