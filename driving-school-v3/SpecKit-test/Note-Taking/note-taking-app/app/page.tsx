'use client';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import { EmptyState } from '@/components/layout/EmptyState';
import { Button } from '@/components/ui/Button';
import { ViewToggle } from '@/components/ui/ViewToggle';
import { NoteGrid } from '@/components/notes/NoteGrid';
import { NoteList } from '@/components/notes/NoteList';
import { useNotes } from '@/hooks/useNotes';
import { useViewMode } from '@/hooks/useViewMode';
import { Note } from '@/types';

export default function Home() {
  const router = useRouter();
  const { notes, loading, createNote, togglePin, toggleArchive, deleteNote } = useNotes();
  const { viewMode, setViewMode } = useViewMode();

  // Filter out archived notes for home view
  const activeNotes = notes.filter((note) => !note.archived);

  const handleCreateNote = async () => {
    try {
      const newNote = await createNote();
      router.push(`/notes/${newNote.id}`);
    } catch (error) {
      console.error('Failed to create note:', error);
    }
  };

  const handleNoteClick = (note: Note) => {
    router.push(`/notes/${note.id}`);
  };

  const handlePin = async (note: Note) => {
    try {
      await togglePin(note.id);
    } catch (error) {
      console.error('Failed to pin note:', error);
    }
  };

  const handleArchive = async (note: Note) => {
    try {
      await toggleArchive(note.id);
    } catch (error) {
      console.error('Failed to archive note:', error);
    }
  };

  const handleDelete = async (note: Note) => {
    if (confirm('Are you sure you want to delete this note?')) {
      try {
        await deleteNote(note.id);
      } catch (error) {
        console.error('Failed to delete note:', error);
      }
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-gray-500 dark:text-gray-400">Loading...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Header actions */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
          My Notes
        </h2>
        <div className="flex items-center gap-3">
          <ViewToggle currentView={viewMode} onViewChange={setViewMode} />
          <Button onClick={handleCreateNote} size="md">
            <Plus className="h-5 w-5 mr-2" />
            New Note
          </Button>
        </div>
      </div>

      {/* Notes display */}
      {activeNotes.length === 0 ? (
        <EmptyState
          icon={<Plus className="h-16 w-16" />}
          title="No notes yet"
          description="Get started by creating your first note"
          action={
            <Button onClick={handleCreateNote} size="lg">
              <Plus className="h-5 w-5 mr-2" />
              Create Note
            </Button>
          }
        />
      ) : viewMode === 'grid' ? (
        <NoteGrid
          notes={activeNotes}
          onNoteClick={handleNoteClick}
          onNotePin={handlePin}
          onNoteArchive={handleArchive}
          onNoteDelete={handleDelete}
        />
      ) : (
        <NoteList
          notes={activeNotes}
          onNoteClick={handleNoteClick}
          onNotePin={handlePin}
          onNoteArchive={handleArchive}
          onNoteDelete={handleDelete}
        />
      )}
    </AppLayout>
  );
}
