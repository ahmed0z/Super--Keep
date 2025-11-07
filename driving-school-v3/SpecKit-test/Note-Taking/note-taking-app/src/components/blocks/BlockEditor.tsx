'use client';

import { Block, BlockType } from '@/types';
import { ChecklistBlock } from './ChecklistBlock';
import { TableBlock } from './TableBlock';
import { IconButton } from '@/components/ui/IconButton';
import { MoreVertical, Type, CheckSquare, Table as TableIcon, Trash2 } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

interface BlockEditorProps {
  block: Block;
  onUpdate: (updates: Partial<Block>) => void;
  onDelete: () => void;
  onChangeType: (type: BlockType) => void;
  readOnly?: boolean;
}

export function BlockEditor({ 
  block, 
  onUpdate, 
  onDelete,
  onChangeType,
  readOnly = false 
}: BlockEditorProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showTypeSelector, setShowTypeSelector] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const typeSelectorRef = useRef<HTMLDivElement>(null);

  // Close menus when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowMenu(false);
      }
      if (typeSelectorRef.current && !typeSelectorRef.current.contains(event.target as Node)) {
        setShowTypeSelector(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderBlock = () => {
    switch (block.type) {
      case 'text':
        return (
          <div
            contentEditable={!readOnly}
            suppressContentEditableWarning
            onBlur={(e) => {
              if (!readOnly) {
                onUpdate({ content: e.currentTarget.textContent || '' });
              }
            }}
            className="min-h-[100px] p-4 outline-none bg-transparent
                       prose prose-sm dark:prose-invert max-w-none
                       focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-lg"
            dangerouslySetInnerHTML={{ __html: block.content || '' }}
          />
        );

      case 'checklist':
        return (
          <ChecklistBlock
            block={block}
            onUpdate={onUpdate}
            readOnly={readOnly}
          />
        );

      case 'table':
        return (
          <TableBlock
            block={block}
            onUpdate={onUpdate}
            readOnly={readOnly}
          />
        );

      default:
        return <div>Unknown block type</div>;
    }
  };

  const blockTypeIcons = {
    text: Type,
    checklist: CheckSquare,
    table: TableIcon
  };

  const blockTypeLabels = {
    text: 'Text',
    checklist: 'Checklist',
    table: 'Table'
  };

  const CurrentIcon = blockTypeIcons[block.type];

  return (
    <div className="group relative border border-gray-200 dark:border-gray-700 rounded-lg p-4 
                    hover:border-gray-300 dark:hover:border-gray-600 transition-colors">
      {/* Block Type Indicator & Menu */}
      {!readOnly && (
        <div className="absolute top-2 right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          {/* Type Selector */}
          <div className="relative" ref={typeSelectorRef}>
            <button
              onClick={() => setShowTypeSelector(!showTypeSelector)}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 
                       hover:bg-gray-200 dark:hover:bg-gray-600 rounded flex items-center gap-1"
              title="Change block type"
            >
              <CurrentIcon className="w-3 h-3" />
              {blockTypeLabels[block.type]}
            </button>

            {showTypeSelector && (
              <div className="absolute top-full right-0 mt-1 py-1 bg-white dark:bg-gray-800 
                            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[120px]">
                {(['text', 'checklist', 'table'] as BlockType[]).map((type) => {
                  const Icon = blockTypeIcons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => {
                        onChangeType(type);
                        setShowTypeSelector(false);
                      }}
                      className={`w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700
                                flex items-center gap-2 transition-colors
                                ${block.type === type ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : ''}`}
                    >
                      <Icon className="w-4 h-4" />
                      {blockTypeLabels[type]}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* More Menu */}
          <div className="relative" ref={menuRef}>
            <IconButton
              icon={<MoreVertical className="w-4 h-4" />}
              label="Block options"
              onClick={() => setShowMenu(!showMenu)}
              variant="ghost"
              size="sm"
            />

            {showMenu && (
              <div className="absolute top-full right-0 mt-1 py-1 bg-white dark:bg-gray-800 
                            rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-10 min-w-[150px]">
                <button
                  onClick={() => {
                    onDelete();
                    setShowMenu(false);
                  }}
                  className="w-full px-3 py-2 text-left text-sm text-red-600 dark:text-red-400
                           hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2"
                >
                  <Trash2 className="w-4 h-4" />
                  Delete block
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Block Content */}
      <div className="mt-2">
        {renderBlock()}
      </div>
    </div>
  );
}
