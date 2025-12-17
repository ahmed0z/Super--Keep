/**
 * ArchivePage - View archived notes.
 */
import React, { useMemo } from 'react';
import { ArchiveBoxIcon } from '@heroicons/react/24/outline';
import { NotesGrid } from '../components/organisms/NotesGrid';
import { useNotesStore } from '../store/notesStore';

const ArchivePage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  
  const archivedNotes = useMemo(() => {
    return notes.filter((n) => n.isArchived && !n.isTrashed).sort((a, b) => b.order - a.order);
  }, [notes]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-gray-800 dark:text-white">Archive</h1>

      <NotesGrid
        notes={archivedNotes}
        emptyMessage="Your archived notes appear here"
        emptyIcon={<ArchiveBoxIcon className="h-24 w-24" />}
        showArchiveAction={true}
      />
    </div>
  );
};

export default ArchivePage;
