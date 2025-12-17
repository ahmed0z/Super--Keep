/**
 * TrashPage - View and manage trashed notes.
 */
import React, { useMemo } from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';
import { NotesGrid } from '../components/organisms/NotesGrid';
import { useNotesStore } from '../store/notesStore';
import { Button } from '../components/atoms/Button';

const TrashPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  const emptyTrash = useNotesStore((state) => state.emptyTrash);
  
  const trashedNotes = useMemo(() => {
    return notes.filter((n) => n.isTrashed).sort((a, b) => b.order - a.order);
  }, [notes]);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-xl font-medium text-gray-800 dark:text-white">Trash</h1>

        {trashedNotes.length > 0 && (
          <Button
            variant="secondary"
            onClick={emptyTrash}
          >
            Empty trash
          </Button>
        )}
      </div>

      {trashedNotes.length > 0 && (
        <div className="mb-6 rounded-lg bg-amber-50 px-4 py-3 text-sm text-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
          Notes in Trash are deleted after 7 days.
        </div>
      )}

      <NotesGrid
        notes={trashedNotes}
        emptyMessage="No notes in Trash"
        emptyIcon={<TrashIcon className="h-24 w-24" />}
        showArchiveAction={false}
        showRestoreAction={true}
        showDeleteForever={true}
      />
    </div>
  );
};

export default TrashPage;
