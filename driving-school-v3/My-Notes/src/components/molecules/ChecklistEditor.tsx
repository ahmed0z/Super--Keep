/**
 * ChecklistEditor component for editing checklist items.
 */
import React, { useState, useRef, useEffect } from 'react';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import type { ChecklistItem } from '../../types';
import { Checkbox } from '../atoms/Checkbox';
import { clsx } from '../../utils/clsx';

interface ChecklistEditorProps {
  items: ChecklistItem[];
  onAddItem: (text: string) => void;
  onUpdateItem: (itemId: string, updates: Partial<ChecklistItem>) => void;
  onDeleteItem: (itemId: string) => void;
  onToggleItem: (itemId: string) => void;
  readOnly?: boolean;
  className?: string;
}

export const ChecklistEditor: React.FC<ChecklistEditorProps> = ({
  items,
  onAddItem,
  onUpdateItem,
  onDeleteItem,
  onToggleItem,
  readOnly = false,
  className,
}) => {
  const [newItemText, setNewItemText] = useState('');
  const newItemInputRef = useRef<HTMLInputElement>(null);

  // Sort items: unchecked first, then checked
  const sortedItems = [...items].sort((a, b) => {
    if (a.checked === b.checked) return a.order - b.order;
    return a.checked ? 1 : -1;
  });

  const uncheckedItems = sortedItems.filter((item) => !item.checked);
  const checkedItems = sortedItems.filter((item) => item.checked);

  const handleAddItem = () => {
    if (!newItemText.trim()) return;
    onAddItem(newItemText.trim());
    setNewItemText('');
    newItemInputRef.current?.focus();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    }
  };

  return (
    <div className={clsx('space-y-1', className)}>
      {/* Unchecked items */}
      {uncheckedItems.map((item) => (
        <ChecklistItemRow
          key={item.id}
          item={item}
          onToggle={() => onToggleItem(item.id)}
          onUpdate={(updates) => onUpdateItem(item.id, updates)}
          onDelete={() => onDeleteItem(item.id)}
          readOnly={readOnly}
        />
      ))}

      {/* Add new item input */}
      {!readOnly && (
        <div className="flex items-center gap-2 py-1">
          <button
            type="button"
            onClick={() => newItemInputRef.current?.focus()}
            className="flex h-5 w-5 items-center justify-center text-gray-400"
          >
            <PlusIcon className="h-4 w-4" />
          </button>
          <input
            ref={newItemInputRef}
            type="text"
            value={newItemText}
            onChange={(e) => setNewItemText(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={handleAddItem}
            placeholder="Add item"
            className="flex-1 bg-transparent text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none dark:text-gray-200 dark:placeholder:text-gray-500"
          />
        </div>
      )}

      {/* Completed items */}
      {checkedItems.length > 0 && (
        <div className="border-t border-gray-200 pt-2 mt-2 dark:border-gray-600">
          <p className="mb-1 text-xs text-gray-500 dark:text-gray-400">
            {checkedItems.length} completed item{checkedItems.length !== 1 ? 's' : ''}
          </p>
          {checkedItems.map((item) => (
            <ChecklistItemRow
              key={item.id}
              item={item}
              onToggle={() => onToggleItem(item.id)}
              onUpdate={(updates) => onUpdateItem(item.id, updates)}
              onDelete={() => onDeleteItem(item.id)}
              readOnly={readOnly}
            />
          ))}
        </div>
      )}
    </div>
  );
};

/**
 * Individual checklist item row component.
 */
interface ChecklistItemRowProps {
  item: ChecklistItem;
  onToggle: () => void;
  onUpdate: (updates: Partial<ChecklistItem>) => void;
  onDelete: () => void;
  readOnly?: boolean;
}

const ChecklistItemRow: React.FC<ChecklistItemRowProps> = ({
  item,
  onToggle,
  onUpdate,
  onDelete,
  readOnly = false,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(item.text);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isEditing) {
      inputRef.current?.focus();
      inputRef.current?.select();
    }
  }, [isEditing]);

  const handleSave = () => {
    if (editText.trim() !== item.text) {
      onUpdate({ text: editText.trim() });
    }
    setIsEditing(false);
  };

  return (
    <div
      className={clsx(
        'group flex items-center gap-2 rounded py-1 px-1 -mx-1',
        'hover:bg-gray-100 dark:hover:bg-gray-700/50'
      )}
    >
      <Checkbox
        checked={item.checked}
        onChange={onToggle}
        disabled={readOnly}
      />

      {isEditing && !readOnly ? (
        <input
          ref={inputRef}
          type="text"
          value={editText}
          onChange={(e) => setEditText(e.target.value)}
          onBlur={handleSave}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSave();
            if (e.key === 'Escape') {
              setEditText(item.text);
              setIsEditing(false);
            }
          }}
          className="flex-1 bg-transparent text-sm focus:outline-none dark:text-gray-200"
        />
      ) : (
        <span
          onClick={() => !readOnly && setIsEditing(true)}
          className={clsx(
            'flex-1 text-sm cursor-text',
            item.checked
              ? 'text-gray-400 line-through dark:text-gray-500'
              : 'text-gray-700 dark:text-gray-200'
          )}
        >
          {item.text}
        </span>
      )}

      {!readOnly && (
        <button
          type="button"
          onClick={onDelete}
          className="invisible rounded p-1 text-gray-400 hover:bg-gray-200 hover:text-gray-600 group-hover:visible dark:hover:bg-gray-600"
          aria-label="Delete item"
        >
          <XMarkIcon className="h-4 w-4" />
        </button>
      )}
    </div>
  );
};
