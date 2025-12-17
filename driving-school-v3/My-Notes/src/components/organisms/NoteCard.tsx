/**
 * NoteCard component - displays a single note in the grid/list.
 * Supports text and checklist notes with full action toolbar.
 */
import React, { useState } from 'react';
import { format } from 'date-fns';
import {
  ArchiveBoxIcon,
  ArchiveBoxXMarkIcon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowUturnLeftIcon,
  EllipsisVerticalIcon,
  ClockIcon,
} from '@heroicons/react/24/outline';
import { MapPinIcon as PinSolidIcon } from '@heroicons/react/24/solid';
import { MapPinIcon as PinOutlineIcon } from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import type { Note } from '../../types';
import { useNotesStore } from '../../store/notesStore';
import { useLabelsStore } from '../../store/labelsStore';
import { IconButton } from '../atoms/IconButton';
import { Badge } from '../atoms/Badge';
import { ColorPicker } from '../molecules/ColorPicker';
import { LabelManager } from '../molecules/LabelManager';
import { ReminderPicker } from '../molecules/ReminderPicker';
import { CollaboratorManager } from '../molecules/CollaboratorManager';
import { Checkbox } from '../atoms/Checkbox';
import { clsx } from '../../utils/clsx';

interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  showArchiveAction?: boolean;
  showRestoreAction?: boolean;
  showDeleteForever?: boolean;
  className?: string;
}

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

export const NoteCard: React.FC<NoteCardProps> = ({
  note,
  onClick,
  showArchiveAction = true,
  showRestoreAction = false,
  showDeleteForever = false,
  className,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const labels = useLabelsStore((state) => state.labels);
  const togglePin = useNotesStore((state) => state.togglePin);
  const toggleArchive = useNotesStore((state) => state.toggleArchive);
  const moveToTrash = useNotesStore((state) => state.moveToTrash);
  const restoreFromTrash = useNotesStore((state) => state.restoreFromTrash);
  const permanentlyDelete = useNotesStore((state) => state.permanentlyDelete);
  const duplicateNote = useNotesStore((state) => state.duplicateNote);
  const setColor = useNotesStore((state) => state.setColor);
  const addLabel = useNotesStore((state) => state.addLabel);
  const removeLabel = useNotesStore((state) => state.removeLabel);
  const setReminder = useNotesStore((state) => state.setReminder);
  const addCollaborator = useNotesStore((state) => state.addCollaborator);
  const removeCollaborator = useNotesStore((state) => state.removeCollaborator);
  const toggleChecklistItem = useNotesStore((state) => state.toggleChecklistItem);

  // Get label names for display
  const noteLabels = note.labels
    .map((labelId) => labels.find((l) => l.id === labelId))
    .filter(Boolean);

  // Truncate checklist items for display
  const displayItems = note.checklistItems.slice(0, 5);
  const hasMoreItems = note.checklistItems.length > 5;

  const handleCardClick = (e: React.MouseEvent) => {
    // Don't trigger click if clicking on an interactive element
    if ((e.target as HTMLElement).closest('button, input, [role="menu"]')) {
      return;
    }
    onClick?.();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick?.();
    }
  };

  return (
    <article
      className={clsx(
        'group relative rounded-3xl border-2 overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)] flex flex-col',
        NOTE_COLORS[note.color],
        'border-[var(--color-outline-variant)]',
        'hover:shadow-lg hover:-translate-y-1',
        'focus-within:shadow-lg',
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Note: ${note.title || 'Untitled'}`}
    >
      {/* Pin button (shown on hover) */}
      <div
        className={clsx(
          'absolute right-2 top-2 z-10 transition-opacity',
          isHovered || note.isPinned ? 'opacity-100' : 'opacity-0'
        )}
      >
        <IconButton
          icon={
            note.isPinned ? (
              <PinSolidIcon className="h-5 w-5 text-gray-700" />
            ) : (
              <PinOutlineIcon className="h-5 w-5" />
            )
          }
          label={note.isPinned ? 'Unpin note' : 'Pin note'}
          onClick={(e) => {
            e.stopPropagation();
            togglePin(note.id);
          }}
          size="sm"
        />
      </div>

      {/* Note content */}
      <div className="p-3 pt-8 flex-1">
        {/* Title */}
        {note.title && (
          <h3 className="mb-2 font-medium text-gray-900 dark:text-white">
            {note.title}
          </h3>
        )}

        {/* Content - Block-based display (first rows) */}
        {note.blocks && note.blocks.length > 0 && (
          <div className="space-y-1.5 max-h-[400px] overflow-hidden">
            {note.blocks.slice(0, 10).map((block) => (
              <div key={block.id}>
                {block.type === 'text' && block.content && (
                  <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words">
                    {block.content}
                  </p>
                )}
                {block.type === 'checklist' && (
                  <div className="flex items-start gap-2">
                    <Checkbox
                      checked={block.checked || false}
                      onChange={() => {
                        if (note.type === 'checklist') {
                          const checklistItem = note.checklistItems.find(
                            (item) => item.text === block.content
                          );
                          if (checklistItem) {
                            toggleChecklistItem(note.id, checklistItem.id);
                          }
                        }
                      }}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <span
                      className={clsx(
                        'text-sm break-words flex-1',
                        block.checked
                          ? 'text-gray-400 line-through dark:text-gray-500'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {block.content}
                    </span>
                  </div>
                )}
                {block.type === 'toggle' && (
                  <div>
                    <div className="flex items-start gap-1">
                      <span className="text-gray-500 text-[10px]">▼</span>
                      <span className="text-sm text-gray-700 dark:text-gray-300 break-words flex-1">
                        {block.content}
                      </span>
                    </div>
                    {block.children && block.children.length > 0 && (
                      <div className="ml-4 mt-0.5 space-y-0.5">
                        {block.children.slice(0, 3).map((child) => (
                          <div key={child.id} className="flex items-start gap-1 text-sm text-gray-600 dark:text-gray-400">
                            {child.type === 'checklist' && <span className="text-gray-400">☐</span>}
                            <span className={child.type === 'checklist' && child.checked ? 'line-through text-gray-400' : ''}>
                              {child.content}
                            </span>
                          </div>
                        ))}
                        {block.children.length > 3 && (
                          <div className="text-xs text-gray-400">
                            +{block.children.length - 3} more
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}
            {note.blocks.length > 10 && (
              <p className="text-xs text-gray-500 dark:text-gray-400">
                + {note.blocks.length - 10} more rows
              </p>
            )}
          </div>
        )}

        {/* Fallback for legacy content format */}
        {(!note.blocks || note.blocks.length === 0) && (
          <>
            {note.type === 'text' && note.content && (
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap break-words max-h-[400px] overflow-hidden">
                {note.content}
              </p>
            )}
            {note.type === 'checklist' && note.checklistItems.length > 0 && (
              <div className="space-y-1.5 max-h-[400px] overflow-hidden">
                {displayItems.map((item) => (
                  <div key={item.id} className="flex items-start gap-2">
                    <Checkbox
                      checked={item.checked}
                      onChange={() => toggleChecklistItem(note.id, item.id)}
                      className="flex-shrink-0 mt-0.5"
                    />
                    <span
                      className={clsx(
                        'text-sm break-words flex-1',
                        item.checked
                          ? 'text-gray-400 line-through dark:text-gray-500'
                          : 'text-gray-700 dark:text-gray-300'
                      )}
                    >
                      {item.text}
                    </span>
                  </div>
                ))}
                {hasMoreItems && (
                  <p className="text-xs text-gray-500 dark:text-gray-400">
                    + {note.checklistItems.length - 5} more items
                  </p>
                )}
              </div>
            )}
          </>
        )}

        {/* Reminder badge */}
        {note.reminder && (
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <div
              className={clsx(
                'inline-flex items-center gap-1 rounded-full px-2 py-0.5',
                new Date(note.reminder.dateTime) < new Date()
                  ? 'bg-gray-200 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
              )}
            >
              <ClockIcon className="h-3 w-3" />
              {format(new Date(note.reminder.dateTime), 'MMM d, h:mm a')}
            </div>
          </div>
        )}

        {/* Labels */}
        {noteLabels.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1">
            {noteLabels.map((label) => (
              <Badge key={label!.id} variant="default">
                {label!.name}
              </Badge>
            ))}
          </div>
        )}

        {/* Collaborators indicator */}
        {note.collaborators.length > 0 && (
          <div className="mt-3 flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
            <span>Shared with {note.collaborators.length} people</span>
          </div>
        )}
      </div>

      {/* Action toolbar (always at bottom) */}
      <div
        className={clsx(
          'flex items-center gap-1 px-2 pb-2 mt-auto transition-opacity',
          isHovered ? 'opacity-100' : 'opacity-0'
        )}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Reminder */}
        <ReminderPicker
          reminder={note.reminder}
          onSetReminder={(reminder) => setReminder(note.id, reminder)}
        />

        {/* Collaborator */}
        <CollaboratorManager
          collaborators={note.collaborators}
          onAddCollaborator={(collab) => addCollaborator(note.id, collab)}
          onRemoveCollaborator={(collabId) => removeCollaborator(note.id, collabId)}
        />

        {/* Color picker */}
        <ColorPicker
          selectedColor={note.color}
          onColorChange={(color) => setColor(note.id, color)}
        />

        {/* Label manager */}
        <LabelManager
          selectedLabels={note.labels}
          onAddLabel={(labelId) => addLabel(note.id, labelId)}
          onRemoveLabel={(labelId) => removeLabel(note.id, labelId)}
        />

        {/* Archive / Unarchive */}
        {showArchiveAction && (
          <IconButton
            icon={
              note.isArchived ? (
                <ArchiveBoxXMarkIcon className="h-5 w-5" />
              ) : (
                <ArchiveBoxIcon className="h-5 w-5" />
              )
            }
            label={note.isArchived ? 'Unarchive' : 'Archive'}
            onClick={() => toggleArchive(note.id)}
          />
        )}

        {/* Restore from trash */}
        {showRestoreAction && (
          <IconButton
            icon={<ArrowUturnLeftIcon className="h-5 w-5" />}
            label="Restore"
            onClick={() => restoreFromTrash(note.id)}
          />
        )}

        {/* More actions menu */}
        <Menu as="div" className="relative">
          <MenuButton as={React.Fragment}>
            {({ active }) => (
              <IconButton
                icon={<EllipsisVerticalIcon className="h-5 w-5" />}
                label="More actions"
                showTooltip={!active}
                className={active ? 'bg-gray-100 dark:bg-gray-700' : ''}
              />
            )}
          </MenuButton>

          <MenuItems
            className="absolute right-0 z-50 mt-1 w-48 origin-top-right rounded-lg bg-white py-1 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-white/10"
            anchor="bottom end"
          >
            {/* Delete / Trash */}
            {showDeleteForever ? (
              <MenuItem>
                {({ focus }) => (
                  <button
                    type="button"
                    onClick={() => permanentlyDelete(note.id)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-4 py-2 text-sm text-red-600',
                      focus && 'bg-gray-100 dark:bg-gray-700'
                    )}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete forever
                  </button>
                )}
              </MenuItem>
            ) : (
              <MenuItem>
                {({ focus }) => (
                  <button
                    type="button"
                    onClick={() => moveToTrash(note.id)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-4 py-2 text-sm',
                      focus
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'text-gray-700 dark:text-gray-200'
                    )}
                  >
                    <TrashIcon className="h-5 w-5" />
                    Delete note
                  </button>
                )}
              </MenuItem>
            )}

            {/* Duplicate */}
            {!note.isTrashed && (
              <MenuItem>
                {({ focus }) => (
                  <button
                    type="button"
                    onClick={() => duplicateNote(note.id)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-4 py-2 text-sm',
                      focus
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'text-gray-700 dark:text-gray-200'
                    )}
                  >
                    <DocumentDuplicateIcon className="h-5 w-5" />
                    Make a copy
                  </button>
                )}
              </MenuItem>
            )}
          </MenuItems>
        </Menu>
      </div>
    </article>
  );
};
