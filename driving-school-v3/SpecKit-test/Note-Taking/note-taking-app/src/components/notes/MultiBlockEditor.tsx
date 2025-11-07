'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Note, Block, BlockType } from '@/types';
import { BlockEditor } from '@/components/blocks/BlockEditor';
import { Button } from '@/components/ui/Button';
import { Plus, Type, CheckSquare, Table } from 'lucide-react';

interface MultiBlockEditorProps {
  note: Note;
  onUpdate: (updates: Partial<Note>) => void;
  autoSave?: boolean;
  className?: string;
}

export function MultiBlockEditor({ 
  note, 
  onUpdate, 
  autoSave = true,
  className = '' 
}: MultiBlockEditorProps) {
  const [title, setTitle] = useState(note.title);
  const [blocks, setBlocks] = useState<Block[]>(note.blocks);
  const [isDirty, setIsDirty] = useState(false);
  const [showAddMenu, setShowAddMenu] = useState(false);
  const titleRef = useRef<HTMLInputElement>(null);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const addMenuRef = useRef<HTMLDivElement>(null);

  // Close add menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
        setShowAddMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Auto-save logic
  const saveChanges = useCallback(() => {
    if (!isDirty) return;

    onUpdate({
      title: title.trim() || 'Untitled',
      blocks: blocks,
      updatedAt: new Date().toISOString()
    });

    setIsDirty(false);
  }, [title, blocks, onUpdate, isDirty]);

  // Auto-save effect
  useEffect(() => {
    if (!autoSave || !isDirty) return;

    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    saveTimeoutRef.current = setTimeout(() => {
      saveChanges();
    }, 1000);

    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [autoSave, isDirty, saveChanges]);

  // Handle title changes
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);
    setIsDirty(true);
  };

  // Handle block updates
  const handleBlockUpdate = (blockId: string, updates: Partial<Block>) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;
      return { ...b, ...updates } as Block;
    }));
    setIsDirty(true);
  };

  // Handle block deletion
  const handleBlockDelete = (blockId: string) => {
    setBlocks(prev => prev.filter(b => b.id !== blockId).map((b, idx) => ({ ...b, order: idx })));
    setIsDirty(true);
  };

  // Handle block type change
  const handleBlockTypeChange = (blockId: string, newType: BlockType) => {
    setBlocks(prev => prev.map(b => {
      if (b.id !== blockId) return b;

      const baseBlock = {
        id: b.id,
        type: newType,
        order: b.order
      };

      switch (newType) {
        case 'text':
          return { ...baseBlock, content: '' } as Block;
        case 'checklist':
          return { ...baseBlock, items: [] } as Block;
        case 'table':
          return { 
            ...baseBlock, 
            rows: 2, 
            cols: 2, 
            data: Array(2).fill(null).map(() => Array(2).fill(null).map(() => ({ value: '' })))
          } as Block;
        default:
          return b;
      }
    }));
    setIsDirty(true);
  };

  // Add new block
  const handleAddBlock = (type: BlockType) => {
    const newBlock: Block = (() => {
      const base = {
        id: crypto.randomUUID(),
        type,
        order: blocks.length
      };

      switch (type) {
        case 'text':
          return { ...base, content: '' } as Block;
        case 'checklist':
          return { ...base, items: [] } as Block;
        case 'table':
          return { 
            ...base, 
            rows: 2, 
            cols: 2, 
            data: Array(2).fill(null).map(() => Array(2).fill(null).map(() => ({ value: '' })))
          } as Block;
      }
    })();

    setBlocks(prev => [...prev, newBlock]);
    setIsDirty(true);
    setShowAddMenu(false);
  };

  // Focus title on mount
  useEffect(() => {
    if (titleRef.current && !note.title) {
      titleRef.current.focus();
    }
  }, [note.title]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Title Input */}
      <input
        ref={titleRef}
        type="text"
        value={title}
        onChange={handleTitleChange}
        placeholder="Title"
        className="text-2xl font-bold bg-transparent border-none outline-none w-full
                   placeholder:text-gray-400 dark:placeholder:text-gray-600
                   focus:ring-0"
        aria-label="Note title"
        maxLength={200}
      />

      {/* Blocks */}
      <div className="space-y-4">
        {blocks
          .sort((a, b) => a.order - b.order)
          .map(block => (
            <BlockEditor
              key={block.id}
              block={block}
              onUpdate={(updates) => handleBlockUpdate(block.id, updates)}
              onDelete={() => handleBlockDelete(block.id)}
              onChangeType={(type) => handleBlockTypeChange(block.id, type)}
            />
          ))}
      </div>

      {/* Add Block Menu */}
      <div className="relative" ref={addMenuRef}>
        <Button
          variant="ghost"
          onClick={() => setShowAddMenu(!showAddMenu)}
          className="w-full"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Block
        </Button>

        {showAddMenu && (
          <div className="absolute top-full left-0 mt-2 py-1 bg-white dark:bg-gray-800 
                        rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[200px]">
            <button
              onClick={() => handleAddBlock('text')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                       flex items-center gap-2 transition-colors"
            >
              <Type className="w-4 h-4" />
              Text Block
            </button>
            <button
              onClick={() => handleAddBlock('checklist')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                       flex items-center gap-2 transition-colors"
            >
              <CheckSquare className="w-4 h-4" />
              Checklist
            </button>
            <button
              onClick={() => handleAddBlock('table')}
              className="w-full px-4 py-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700 
                       flex items-center gap-2 transition-colors"
            >
              <Table className="w-4 h-4" />
              Table
            </button>
          </div>
        )}
      </div>

      {/* Save indicator */}
      {isDirty && autoSave && (
        <div className="text-xs text-gray-500 dark:text-gray-400">
          Saving...
        </div>
      )}
    </div>
  );
}
