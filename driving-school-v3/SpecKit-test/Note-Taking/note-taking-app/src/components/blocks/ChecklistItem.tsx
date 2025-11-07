'use client';

import { useState, useRef, useEffect } from 'react';
import { ChecklistItem as ChecklistItemType } from '@/types';
import { IconButton } from '@/components/ui/IconButton';
import { GripVertical, X } from 'lucide-react';

interface ChecklistItemProps {
  item: ChecklistItemType;
  onUpdate: (updates: Partial<ChecklistItemType>) => void;
  onDelete: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  autoFocus?: boolean;
}

export function ChecklistItem({
  item,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  autoFocus = false
}: ChecklistItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (autoFocus && inputRef.current) {
      inputRef.current.focus();
    }
  }, [autoFocus]);

  const handleCheckChange = (checked: boolean) => {
    onUpdate({ checked });
  };

  const handleTextBlur = () => {
    setIsEditing(false);
    if (text.trim() !== item.text) {
      onUpdate({ text: text.trim() });
    }
  };

  const handleTextKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleTextBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setText(item.text);
      setIsEditing(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div
      className="group flex items-center gap-2 py-1 px-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      role="listitem"
    >
      {/* Drag Handle */}
      <div
        className="opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVertical className="w-4 h-4 text-gray-400" />
      </div>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={item.checked}
        onChange={(e) => handleCheckChange(e.target.checked)}
        className="w-5 h-5 min-w-[20px] rounded border-gray-300 dark:border-gray-600
                   text-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                   cursor-pointer"
        aria-label={`Mark "${item.text}" as ${item.checked ? 'incomplete' : 'complete'}`}
      />

      {/* Text Input */}
      <input
        ref={inputRef}
        type="text"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onFocus={() => setIsEditing(true)}
        onBlur={handleTextBlur}
        onKeyDown={handleTextKeyDown}
        className={`flex-1 bg-transparent border-none outline-none text-gray-900 dark:text-gray-100
                   focus:ring-0 placeholder:text-gray-400 dark:placeholder:text-gray-600
                   ${item.checked ? 'line-through text-gray-500 dark:text-gray-500' : ''}`}
        placeholder="Add item..."
        maxLength={500}
      />

      {/* Actions */}
      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
        <IconButton
          icon={<X className="w-4 h-4" />}
          label="Delete item"
          onClick={onDelete}
          variant="ghost"
          size="sm"
        />
      </div>
    </div>
  );
}
