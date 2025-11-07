/**
 * NoteCard Component
 * Preview card for displaying note information
 */

'use client';

import React from 'react';
import { Pin, Archive, Trash2, MoreVertical } from 'lucide-react';
import { Note } from '@/types';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { getNoteColorClasses } from '@/lib/utils/colors';
import { formatDate } from '@/lib/utils/date';

export interface NoteCardProps {
  note: Note;
  onClick?: () => void;
  onPin?: () => void;
  onArchive?: () => void;
  onDelete?: () => void;
  isGridView?: boolean;
}

export function NoteCard({
  note,
  onClick,
  onPin,
  onArchive,
  onDelete,
  isGridView = true,
}: NoteCardProps) {
  const handleAction = (e: React.MouseEvent, action?: () => void) => {
    e.stopPropagation();
    action?.();
  };

  const colorClasses = getNoteColorClasses(note.color);

  return (
    <Card
      className={`group relative ${colorClasses} cursor-pointer transition-all`}
      padding="md"
      onClick={onClick}
    >
      {/* Pin indicator */}
      {note.pinned && (
        <div className="absolute top-2 right-2">
          <Pin className="h-4 w-4 text-gray-600 dark:text-gray-400 fill-current" />
        </div>
      )}

      {/* Title */}
      {note.title && (
        <h3 className="font-medium text-gray-900 dark:text-gray-100 mb-2 pr-8 line-clamp-2">
          {note.title}
        </h3>
      )}

      {/* Content preview - show first text block */}
      {note.blocks.length > 0 && (
        <div className="text-sm text-gray-700 dark:text-gray-300 mb-3">
          {note.blocks.slice(0, 3).map((block, index) => {
            if (block.type === 'text') {
              return (
                <p key={block.id} className="line-clamp-3 mb-1">
                  {block.content}
                </p>
              );
            }
            if (block.type === 'checklist') {
              return (
                <div key={block.id} className="space-y-1">
                  {block.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        readOnly
                        className="pointer-events-none"
                      />
                      <span className={item.checked ? 'line-through opacity-60' : ''}>
                        {item.text}
                      </span>
                    </div>
                  ))}
                  {block.items.length > 3 && (
                    <span className="text-xs text-gray-500">
                      +{block.items.length - 3} more
                    </span>
                  )}
                </div>
              );
            }
            return null;
          })}
          {note.blocks.length > 3 && (
            <span className="text-xs text-gray-500">+{note.blocks.length - 3} more blocks</span>
          )}
        </div>
      )}

      {/* Tags */}
      {note.tags.length > 0 && (
        <div className="flex flex-wrap gap-1 mb-3">
          {note.tags.map((tag) => (
            <span
              key={tag}
              className="inline-block px-2 py-0.5 text-xs rounded-full bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Footer with date and actions */}
      <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
        <span>{formatDate(note.updatedAt)}</span>

        {/* Actions - show on hover */}
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {onPin && (
            <IconButton
              icon={<Pin className="h-4 w-4" />}
              label={note.pinned ? 'Unpin' : 'Pin'}
              variant="ghost"
              size="sm"
              onClick={(e) => handleAction(e, onPin)}
              className="h-8 w-8"
            />
          )}
          {onArchive && (
            <IconButton
              icon={<Archive className="h-4 w-4" />}
              label={note.archived ? 'Unarchive' : 'Archive'}
              variant="ghost"
              size="sm"
              onClick={(e) => handleAction(e, onArchive)}
              className="h-8 w-8"
            />
          )}
          {onDelete && (
            <IconButton
              icon={<Trash2 className="h-4 w-4" />}
              label="Delete"
              variant="ghost"
              size="sm"
              onClick={(e) => handleAction(e, onDelete)}
              className="h-8 w-8"
            />
          )}
        </div>
      </div>
    </Card>
  );
}
