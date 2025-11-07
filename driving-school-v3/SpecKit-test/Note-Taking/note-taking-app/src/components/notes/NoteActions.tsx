'use client';

import { Note, NoteColor } from '@/types';
import { IconButton } from '@/components/ui/IconButton';
import { 
  Pin, 
  Archive, 
  Trash2, 
  Palette,
  MoreVertical 
} from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import { NOTE_COLORS } from '@/lib/utils/colors';

interface NoteActionsProps {
  note: Note;
  onPin: () => void;
  onArchive: () => void;
  onDelete: () => void;
  onColorChange: (color: NoteColor) => void;
  className?: string;
}

export function NoteActions({
  note,
  onPin,
  onArchive,
  onDelete,
  onColorChange,
  className = ''
}: NoteActionsProps) {
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const colorPickerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close color picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colorPickerRef.current && !colorPickerRef.current.contains(event.target as Node)) {
        setShowColorPicker(false);
      }
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`flex items-center gap-1 ${className}`}>
      {/* Pin */}
      <IconButton
        icon={<Pin className={`w-4 h-4 ${note.pinned ? 'fill-current' : ''}`} />}
        label={note.pinned ? 'Unpin note' : 'Pin note'}
        onClick={(e) => {
          e.stopPropagation();
          onPin();
        }}
        variant="ghost"
        size="sm"
      />

      {/* Color */}
      <div className="relative" ref={colorPickerRef}>
        <IconButton
          icon={<Palette className="w-4 h-4" />}
          label="Change color"
          onClick={(e) => {
            e.stopPropagation();
            setShowColorPicker(!showColorPicker);
          }}
          variant="ghost"
          size="sm"
        />

        {showColorPicker && (
          <div className="absolute top-full right-0 mt-2 p-2 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <div className="grid grid-cols-4 gap-2">
              {(Object.keys(NOTE_COLORS) as NoteColor[]).map((color) => {
                const colorClass = NOTE_COLORS[color].bg.split(' ')[0]; // Extract first bg class
                return (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      onColorChange(color);
                      setShowColorPicker(false);
                    }}
                    className={`w-8 h-8 rounded-full border-2 transition-transform hover:scale-110
                              ${colorClass}
                              ${note.color === color ? 'border-gray-900 dark:border-gray-100' : 'border-transparent'}`}
                    aria-label={`Set color to ${color}`}
                    title={color}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Archive */}
      <IconButton
        icon={<Archive className="w-4 h-4" />}
        label={note.archived ? 'Unarchive note' : 'Archive note'}
        onClick={(e) => {
          e.stopPropagation();
          onArchive();
        }}
        variant="ghost"
        size="sm"
      />

      {/* More menu */}
      <div className="relative" ref={menuRef}>
        <IconButton
          icon={<MoreVertical className="w-4 h-4" />}
          label="More options"
          onClick={(e) => {
            e.stopPropagation();
            setShowMenu(!showMenu);
          }}
          variant="ghost"
          size="sm"
        />

        {showMenu && (
          <div className="absolute top-full right-0 mt-2 w-48 py-1 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
                setShowMenu(false);
              }}
              className="w-full px-4 py-2 text-left text-sm text-red-600 dark:text-red-400
                       hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                       flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Delete note
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
