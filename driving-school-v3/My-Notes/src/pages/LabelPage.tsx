/**
 * LabelPage - View notes by label.
 */
import React, { useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { TagIcon } from '@heroicons/react/24/outline';
import { NoteInput } from '../components/organisms/NoteInput';
import { NotesGrid } from '../components/organisms/NotesGrid';
import { useNotesStore } from '../store/notesStore';
import { useLabelsStore } from '../store/labelsStore';

const LabelPage: React.FC = () => {
  const { labelId } = useParams<{ labelId: string }>();
  const labels = useLabelsStore((state) => state.labels);
  const allNotes = useNotesStore((state) => state.notes);
  
  const label = useMemo(() => {
    return labels.find((l) => l.id === labelId);
  }, [labels, labelId]);
  
  const notes = useMemo(() => {
    if (!labelId) return [];
    return allNotes
      .filter((n) => n.labels.includes(labelId) && !n.isTrashed)
      .sort((a, b) => b.order - a.order);
  }, [allNotes, labelId]);

  if (!label) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <TagIcon className="mb-4 h-24 w-24 text-gray-300 dark:text-gray-600" />
        <p className="text-gray-500 dark:text-gray-400">Label not found</p>
      </div>
    );
  }

  return (
    <div>
      <h1 className="mb-6 text-xl font-medium text-gray-800 dark:text-white">
        {label.name}
      </h1>

      {/* Note input */}
      <NoteInput className="mb-8" />

      {/* Notes grid */}
      <NotesGrid
        notes={notes}
        emptyMessage={`No notes with label "${label.name}"`}
        emptyIcon={<TagIcon className="h-24 w-24" />}
      />
    </div>
  );
};

export default LabelPage;
