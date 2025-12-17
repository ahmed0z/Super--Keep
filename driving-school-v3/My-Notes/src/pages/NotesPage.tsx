/**
 * NotesPage - Main notes view with the note input and notes grid.
 */
import React, { useMemo } from 'react';
import { LightBulbIcon } from '@heroicons/react/24/outline';
import { NoteInput } from '../components/organisms/NoteInput';
import { NotesGrid } from '../components/organisms/NotesGrid';
import { useNotesStore } from '../store/notesStore';

const NotesPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  
  const allNotes = useMemo(() => {
    const activeNotes = notes.filter((n) => !n.isArchived && !n.isTrashed);
    const pinned = activeNotes.filter((n) => n.isPinned).sort((a, b) => b.order - a.order);
    const unpinned = activeNotes.filter((n) => !n.isPinned).sort((a, b) => b.order - a.order);
    return [...pinned, ...unpinned];
  }, [notes]);

  return (
    <div>
      {/* Note input */}
      <NoteInput className="mb-8" />

      {/* Notes grid */}
      <NotesGrid
        notes={allNotes}
        emptyMessage="Notes you add appear here"
        emptyIcon={<LightBulbIcon className="h-24 w-24" />}
      />
    </div>
  );
};

export default NotesPage;
