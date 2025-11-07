/**
 * useNotes Hook
 * Custom hook for managing notes with common operations
 */

'use client';

import { useEffect } from 'react';
import { useNotesStore } from '@/store';
import { NoteCreateInput, NoteUpdateInput } from '@/types';

export function useNotes() {
  const {
    notes,
    loading,
    error,
    fetchNotes,
    createNote,
    updateNote,
    deleteNote,
    bulkDeleteNotes,
    searchNotes,
    getNotesByTag,
    getPinnedNotes,
    getArchivedNotes,
  } = useNotesStore();

  // Fetch notes on mount
  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  // Helper methods
  const handleCreateNote = async (input?: NoteCreateInput) => {
    return createNote(input || {});
  };

  const handleUpdateNote = async (id: string, input: NoteUpdateInput) => {
    return updateNote(id, input);
  };

  const handleDeleteNote = async (id: string) => {
    return deleteNote(id);
  };

  const handleBulkDelete = async (ids: string[]) => {
    return bulkDeleteNotes(ids);
  };

  const handleTogglePin = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    return updateNote(id, { pinned: !note.pinned });
  };

  const handleToggleArchive = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    return updateNote(id, { archived: !note.archived });
  };

  const handleDuplicate = async (id: string) => {
    const note = notes.find((n) => n.id === id);
    if (!note) return;
    
    return createNote({
      title: `${note.title} (Copy)`,
      blocks: note.blocks,
      color: note.color,
      tags: note.tags,
      pinned: false,
    });
  };

  return {
    // State
    notes,
    loading,
    error,
    
    // Actions
    createNote: handleCreateNote,
    updateNote: handleUpdateNote,
    deleteNote: handleDeleteNote,
    bulkDeleteNotes: handleBulkDelete,
    togglePin: handleTogglePin,
    toggleArchive: handleToggleArchive,
    duplicateNote: handleDuplicate,
    searchNotes,
    getNotesByTag,
    getPinnedNotes,
    getArchivedNotes,
    refetch: fetchNotes,
  };
}
