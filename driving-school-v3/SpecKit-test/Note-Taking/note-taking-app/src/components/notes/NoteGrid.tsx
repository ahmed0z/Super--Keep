/**
 * NoteGrid Component
 * Grid layout for displaying notes
 */

'use client';

import React from 'react';
import { Note } from '@/types';
import { NoteCard } from './NoteCard';

export interface NoteGridProps {
  notes: Note[];
  onNoteClick?: (note: Note) => void;
  onNotePin?: (note: Note) => void;
  onNoteArchive?: (note: Note) => void;
  onNoteDelete?: (note: Note) => void;
}

export function NoteGrid({
  notes,
  onNoteClick,
  onNotePin,
  onNoteArchive,
  onNoteDelete,
}: NoteGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {notes.map((note) => (
        <NoteCard
          key={note.id}
          note={note}
          isGridView={true}
          onClick={() => onNoteClick?.(note)}
          onPin={() => onNotePin?.(note)}
          onArchive={() => onNoteArchive?.(note)}
          onDelete={() => onNoteDelete?.(note)}
        />
      ))}
    </div>
  );
}
