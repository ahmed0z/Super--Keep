/**
 * NoteList Component
 * List layout for displaying notes
 */

'use client';

import React from 'react';
import { Note } from '@/types';
import { NoteCard } from './NoteCard';

export interface NoteListProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  onNotePin?: (note: Note) => void;
  onNoteArchive?: (note: Note) => void;
  onNoteDelete?: (note: Note) => void;
}

export function NoteList({
  notes,
  onNoteClick,
  onNotePin,
  onNoteArchive,
  onNoteDelete,
}: NoteListProps) {
  return (
    <div className="flex flex-col gap-3 max-w-4xl mx-auto">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          isGridView={false}
          onClick={() => onNoteClick?.(note)}
          onPin={() => onNotePin?.(note)}
          onArchive={() => onNoteArchive?.(note)}
          onDelete={() => onNoteDelete?.(note)}
        />
      ))}
    </div>
  );
}
