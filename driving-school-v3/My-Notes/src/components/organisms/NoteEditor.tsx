/**
 * NoteEditor component - modal/inline editor for notes.
 * Supports both text and checklist note types.
 */
import React, { useState, useEffect, useRef } from 'react';
import { Dialog, DialogPanel, DialogBackdrop } from '@headlessui/react';
import { MapPinIcon as PinSolidIcon } from '@heroicons/react/24/solid';
import { MapPinIcon as PinOutlineIcon } from '@heroicons/react/24/outline';
import type { Note, NoteColor } from '../../types';
import { useNotesStore } from '../../store/notesStore';
import { useLabelsStore } from '../../store/labelsStore';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';
import { ColorPicker } from '../molecules/ColorPicker';
import { LabelManager } from '../molecules/LabelManager';
import { ReminderPicker } from '../molecules/ReminderPicker';
import { CollaboratorManager } from '../molecules/CollaboratorManager';
import { BlockEditor } from '../molecules/BlockEditor';
import { clsx } from '../../utils/clsx';
import type { ContentBlock } from '../../types';

const NOTE_COLORS: Record<string, string> = {
  default: 'bg-[var(--color-surface)]',
  red: 'bg-note-red',
  orange: 'bg-note-orange',
  yellow: 'bg-note-yellow',
  green: 'bg-note-green',
  teal: 'bg-note-teal',
  blue: 'bg-note-blue',
  darkblue: 'bg-note-darkblue',
  purple: 'bg-note-purple',
  pink: 'bg-note-pink',
  brown: 'bg-note-brown',
  gray: 'bg-note-gray',
};

interface NoteEditorProps {
  note?: Note;
  isOpen: boolean;
  onClose: () => void;
  initialType?: 'text' | 'checklist';
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  isOpen,
  onClose,
  initialType = 'text',
}) => {
  const labels = useLabelsStore((state) => state.labels);
  const createNote = useNotesStore((state) => state.createNote);
  const updateNote = useNotesStore((state) => state.updateNote);
  const togglePin = useNotesStore((state) => state.togglePin);
  const setColor = useNotesStore((state) => state.setColor);
  const addLabel = useNotesStore((state) => state.addLabel);
  const removeLabel = useNotesStore((state) => state.removeLabel);
  const setReminder = useNotesStore((state) => state.setReminder);
  const addCollaborator = useNotesStore((state) => state.addCollaborator);
  const removeCollaborator = useNotesStore((state) => state.removeCollaborator);


  // Local state for new notes
  const [title, setTitle] = useState('');
  const [color, setLocalColor] = useState<NoteColor>('default');
  const [isPinned, setIsPinned] = useState(false);
  const [selectedLabels, setSelectedLabels] = useState<string[]>([]);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);

  const titleRef = useRef<HTMLInputElement>(null);
  const isNewNote = !note;

  // Initialize/reset state when note changes or dialog opens
  useEffect(() => {
    if (!isOpen) return;
    
    if (note) {
      setTitle(note.title);
      setLocalColor(note.color);
      setIsPinned(note.isPinned);
      setSelectedLabels(note.labels);
      
      // Initialize blocks from note data
      if (note.blocks && note.blocks.length > 0) {
        setBlocks(note.blocks);
      } else {
        // Convert old format to blocks
        const initialBlocks: ContentBlock[] = [];
        if (note.content) {
          initialBlocks.push({
            id: Math.random().toString(36).substr(2, 9),
            type: 'text',
            content: note.content,
            order: 0,
          });
        }
        note.checklistItems.forEach((item) => {
          initialBlocks.push({
            id: item.id,
            type: 'checklist',
            content: item.text,
            checked: item.checked,
            order: initialBlocks.length,
          });
        });
        setBlocks(initialBlocks.length > 0 ? initialBlocks : []);
      }
    } else {
      setTitle('');
      setLocalColor('default');
      setIsPinned(false);
      setSelectedLabels([]);
      setBlocks([]);
    }
  }, [note, initialType, isOpen]);

  // Focus title on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => titleRef.current?.focus(), 100);
    }
  }, [isOpen]);

  const handleSave = async () => {
    // Don't save empty notes
    const hasContent = blocks.some(b => b.content.trim());
    if (!title.trim() && !hasContent) {
      onClose();
      return;
    }

    if (isNewNote) {
      await createNote({
        title,
        content: '', // Empty as we use blocks now
        color,
        isPinned,
        type: 'text', // Always text for block-based notes
        labels: selectedLabels,
        checklistItems: [], // Empty as we use blocks now
        blocks,
      });
    } else {
      await updateNote(note.id, {
        title,
        blocks,
      });
    }

    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleSave();
    }
  };

  // Get label names for display
  const noteLabels = (isNewNote ? selectedLabels : note?.labels || [])
    .map((labelId) => labels.find((l) => l.id === labelId))
    .filter(Boolean);

  const currentColor = isNewNote ? color : note?.color || 'default';
  const currentPinned = isNewNote ? isPinned : note?.isPinned || false;

  return (
    <Dialog open={isOpen} onClose={handleSave} className="relative z-50">
      <DialogBackdrop className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

      <div className="fixed inset-0 flex items-center justify-center p-4">
        <DialogPanel
          className={clsx(
            'w-full max-w-xl max-h-[90vh] flex flex-col rounded-3xl shadow-2xl',
            NOTE_COLORS[currentColor],
            'border-2 border-[var(--color-outline-variant)]',
            'animate-[scaleIn_0.3s_cubic-bezier(0.34,1.56,0.64,1)]'
          )}
          onKeyDown={handleKeyDown}
        >
          {/* Compact header with title and controls in one row */}
          <div className="flex items-center gap-3 px-4 pt-3 pb-2">
            {/* Title input */}
            <input
              ref={titleRef}
              type="text"
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (!isNewNote) {
                  updateNote(note.id, { title: e.target.value });
                }
              }}
              placeholder="Title"
              className="flex-1 bg-transparent text-lg font-semibold text-[var(--color-text-primary)] placeholder:text-[var(--color-text-tertiary)] focus:outline-none"
            />
            
            <IconButton
              icon={
                currentPinned ? (
                  <PinSolidIcon className="h-5 w-5 text-[var(--color-primary)]" />
                ) : (
                  <PinOutlineIcon className="h-5 w-5" />
                )
              }
              label={currentPinned ? 'Unpin note' : 'Pin note'}
              onClick={() => {
                if (isNewNote) {
                  setIsPinned(!isPinned);
                } else {
                  togglePin(note.id);
                }
              }}
            />
          </div>

          {/* Content area - scrollable */}
          <div className="px-5 py-2 overflow-y-auto flex-1 pb-48" style={{ scrollbarWidth: 'thin', scrollbarColor: 'var(--color-outline) transparent' }}>

            {/* Unified Block Editor */}
            <BlockEditor
              blocks={blocks}
              onBlocksChange={(updatedBlocks) => {
                setBlocks(updatedBlocks);
                if (!isNewNote) {
                  updateNote(note.id, { blocks: updatedBlocks });
                }
              }}
            />

            {/* Labels */}
            {noteLabels.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1">
                {noteLabels.map((label) => (
                  <Badge
                    key={label!.id}
                    variant="default"
                    onRemove={() => {
                      if (isNewNote) {
                        setSelectedLabels((prev) => prev.filter((id) => id !== label!.id));
                      } else {
                        removeLabel(note.id, label!.id);
                      }
                    }}
                  >
                    {label!.name}
                  </Badge>
                ))}
              </div>
            )}
          </div>

          {/* Action toolbar */}
          <div className="flex items-center justify-between border-t border-gray-200/50 px-2 py-2 dark:border-gray-700/50">
            <div className="flex items-center gap-1">
              {/* Reminder */}
              <ReminderPicker
                reminder={isNewNote ? undefined : note?.reminder}
                onSetReminder={(reminder) => {
                  if (!isNewNote) {
                    setReminder(note.id, reminder);
                  }
                }}
              />

              {/* Collaborator */}
              <CollaboratorManager
                collaborators={isNewNote ? [] : note?.collaborators || []}
                onAddCollaborator={(collab) => {
                  if (!isNewNote) {
                    addCollaborator(note.id, collab);
                  }
                }}
                onRemoveCollaborator={(collabId) => {
                  if (!isNewNote) {
                    removeCollaborator(note.id, collabId);
                  }
                }}
              />

              {/* Color picker */}
              <ColorPicker
                selectedColor={currentColor}
                onColorChange={(newColor) => {
                  if (isNewNote) {
                    setLocalColor(newColor);
                  } else {
                    setColor(note.id, newColor);
                  }
                }}
              />

              {/* Label manager */}
              <LabelManager
                selectedLabels={isNewNote ? selectedLabels : note?.labels || []}
                onAddLabel={(labelId) => {
                  if (isNewNote) {
                    setSelectedLabels((prev) => [...prev, labelId]);
                  } else {
                    addLabel(note.id, labelId);
                  }
                }}
                onRemoveLabel={(labelId) => {
                  if (isNewNote) {
                    setSelectedLabels((prev) => prev.filter((id) => id !== labelId));
                  } else {
                    removeLabel(note.id, labelId);
                  }
                }}
              />
            </div>

            <button
              type="button"
              onClick={handleSave}
              className="rounded px-4 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"
            >
              Close
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
  );
};
