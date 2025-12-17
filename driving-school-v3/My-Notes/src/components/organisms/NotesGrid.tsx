/**
 * NotesGrid component - displays notes in a responsive grid or list layout.
 * Supports both pinned and regular notes sections.
 */
import React, { useState, useMemo } from 'react';
import type { Note } from '../../types';
import { NoteCard } from './NoteCard';
import { NoteEditor } from './NoteEditor';
import { useSettingsStore } from '../../store/settingsStore';

interface NotesGridProps {
  notes: Note[];
  emptyMessage?: string;
  emptyIcon?: React.ReactNode;
  showArchiveAction?: boolean;
  showRestoreAction?: boolean;
  showDeleteForever?: boolean;
  className?: string;
}

export const NotesGrid: React.FC<NotesGridProps> = ({
  notes,
  emptyMessage = 'No notes yet',
  emptyIcon,
  showArchiveAction = true,
  showRestoreAction = false,
  showDeleteForever = false,
  className,
}) => {
  const settings = useSettingsStore((state) => state.settings);
  const viewMode = settings.viewMode;
  const [editingNote, setEditingNote] = useState<Note | null>(null);

  // Separate pinned and unpinned notes
  const pinnedNotes = useMemo(
    () => notes.filter((n) => n.isPinned).sort((a, b) => b.order - a.order),
    [notes]
  );
  const unpinnedNotes = useMemo(
    () => notes.filter((n) => !n.isPinned).sort((a, b) => b.order - a.order),
    [notes]
  );

  if (notes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        {emptyIcon && <div className="mb-4 text-gray-300 dark:text-gray-600">{emptyIcon}</div>}
        <p className="text-gray-500 dark:text-gray-400">{emptyMessage}</p>
      </div>
    );
  }

  const gridClass =
    viewMode === 'grid'
      ? 'grid gap-4 grid-cols-[repeat(auto-fill,minmax(280px,320px))] justify-center'
      : 'flex flex-col gap-3 max-w-2xl mx-auto';

  return (
    <>
      <div className={className}>
        {/* Pinned notes section */}
        {pinnedNotes.length > 0 && (
          <div className="mb-8">
            <h2 className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
              Pinned
            </h2>
            <div className={gridClass}>
              {pinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => setEditingNote(note)}
                  showArchiveAction={showArchiveAction}
                  showRestoreAction={showRestoreAction}
                  showDeleteForever={showDeleteForever}
                />
              ))}
            </div>
          </div>
        )}

        {/* Other notes section */}
        {unpinnedNotes.length > 0 && (
          <div>
            {pinnedNotes.length > 0 && (
              <h2 className="mb-3 px-2 text-xs font-medium uppercase tracking-wider text-gray-500 dark:text-gray-400">
                Others
              </h2>
            )}
            <div className={gridClass}>
              {unpinnedNotes.map((note) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  onClick={() => setEditingNote(note)}
                  showArchiveAction={showArchiveAction}
                  showRestoreAction={showRestoreAction}
                  showDeleteForever={showDeleteForever}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Note editor modal */}
      <NoteEditor
        note={editingNote || undefined}
        isOpen={!!editingNote}
        onClose={() => setEditingNote(null)}
      />
    </>
  );
};
