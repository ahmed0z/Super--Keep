/**
 * RemindersPage - View notes with reminders.
 */
import React, { useMemo } from 'react';
import { BellIcon } from '@heroicons/react/24/outline';
import { NotesGrid } from '../components/organisms/NotesGrid';
import { useNotesStore } from '../store/notesStore';

const RemindersPage: React.FC = () => {
  const notes = useNotesStore((state) => state.notes);
  
  const notesWithReminders = useMemo(() => {
    return notes
      .filter((n) => n.reminder && !n.isTrashed)
      .sort((a, b) => new Date(a.reminder!.dateTime).getTime() - new Date(b.reminder!.dateTime).getTime());
  }, [notes]);

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-gray-800 dark:text-white">Reminders</h1>

      <NotesGrid
        notes={notesWithReminders}
        emptyMessage="Notes with upcoming reminders appear here"
        emptyIcon={<BellIcon className="h-24 w-24" />}
      />
    </div>
  );
};

export default RemindersPage;
