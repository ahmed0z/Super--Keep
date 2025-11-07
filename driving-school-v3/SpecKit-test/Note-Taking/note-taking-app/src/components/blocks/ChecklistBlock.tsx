'use client';

import { useState } from 'react';
import { ChecklistBlock as ChecklistBlockType, ChecklistItem as ChecklistItemType } from '@/types';
import { ChecklistItem } from './ChecklistItem';
import { Button } from '@/components/ui/Button';
import { Plus } from 'lucide-react';

interface ChecklistBlockProps {
  block: ChecklistBlockType;
  onUpdate: (updates: Partial<ChecklistBlockType>) => void;
  readOnly?: boolean;
}

export function ChecklistBlock({ block, onUpdate, readOnly = false }: ChecklistBlockProps) {
  const [newItemText, setNewItemText] = useState('');

  const handleAddItem = () => {
    const newItem: ChecklistItemType = {
      id: crypto.randomUUID(),
      text: '',
      checked: false,
      order: block.items.length
    };

    onUpdate({
      items: [...block.items, newItem]
    });
  };

  const handleUpdateItem = (itemId: string, updates: Partial<ChecklistItemType>) => {
    const updatedItems = block.items.map(item =>
      item.id === itemId ? { ...item, ...updates } : item
    );
    onUpdate({ items: updatedItems });
  };

  const handleDeleteItem = (itemId: string) => {
    const updatedItems = block.items
      .filter(item => item.id !== itemId)
      .map((item, index) => ({ ...item, order: index }));
    onUpdate({ items: updatedItems });
  };

  const handleMoveItem = (itemId: string, direction: 'up' | 'down') => {
    const currentIndex = block.items.findIndex(item => item.id === itemId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= block.items.length) return;

    const updatedItems = [...block.items];
    const [movedItem] = updatedItems.splice(currentIndex, 1);
    updatedItems.splice(newIndex, 0, movedItem);

    // Update order values
    const reorderedItems = updatedItems.map((item, index) => ({
      ...item,
      order: index
    }));

    onUpdate({ items: reorderedItems });
  };

  const completedCount = block.items.filter(item => item.checked).length;
  const totalCount = block.items.length;
  const progressPercentage = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  return (
    <div className="space-y-2">
      {/* Progress Indicator */}
      {totalCount > 0 && (
        <div className="flex items-center gap-3">
          <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-600 dark:bg-blue-500 transition-all duration-300"
              style={{ width: `${progressPercentage}%` }}
              role="progressbar"
              aria-valuenow={completedCount}
              aria-valuemin={0}
              aria-valuemax={totalCount}
            />
          </div>
          <span className="text-sm text-gray-600 dark:text-gray-400 min-w-[60px]">
            {completedCount}/{totalCount}
          </span>
        </div>
      )}

      {/* Checklist Items */}
      <div className="space-y-1" role="list">
        {block.items
          .sort((a, b) => a.order - b.order)
          .map((item, index) => (
            <ChecklistItem
              key={item.id}
              item={item}
              onUpdate={(updates) => handleUpdateItem(item.id, updates)}
              onDelete={() => handleDeleteItem(item.id)}
              onMoveUp={index > 0 ? () => handleMoveItem(item.id, 'up') : undefined}
              onMoveDown={index < block.items.length - 1 ? () => handleMoveItem(item.id, 'down') : undefined}
              autoFocus={item.text === '' && index === block.items.length - 1}
            />
          ))}
      </div>

      {/* Add Item Button */}
      {!readOnly && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddItem}
          className="w-full justify-start"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add item
        </Button>
      )}

      {/* Empty State */}
      {block.items.length === 0 && readOnly && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p className="text-sm">No checklist items</p>
        </div>
      )}
    </div>
  );
}
