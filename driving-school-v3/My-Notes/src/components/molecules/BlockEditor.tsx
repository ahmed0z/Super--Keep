/**
 * BlockEditor Component - Advanced Block-Based Content Editor
 * 
 * A flexible, Notion-inspired editor that allows users to create and manage content
 * using a block-based system. Each block can be either text or a checklist item,
 * and users can freely mix and reorder them.
 * 
 * @features
 * - **Always-visible controls**: Drag handles and '+' buttons are always visible for better discoverability
 * - **Drag-and-drop reordering**: Click and drag the handle icon to reorder blocks
 * - **Context menu**: Right-click equivalent on handle for Turn into, Duplicate, Delete actions
 * - **Type-aware row creation**: Enter key creates new blocks matching the current block type
 * - **Slash commands**: Type '/' in an empty block to open the type selection menu
 * - **Tab navigation**: Press Tab on an empty block to open the command menu
 * - **Permanent add button**: Always-visible '+' button at the bottom with type selection menu
 * - **Empty row indicators**: Empty rows are subtly highlighted to guide users
 * - **Keyboard shortcuts**: 
 *   - Enter: Create new block (same type as current)
 *   - Backspace: Delete empty block and focus previous
 *   - Ctrl/Cmd+D: Duplicate current block
 *   - Delete: Remove current block
 *   - Tab: Open type selection menu on empty blocks
 * 
 * @example
 * ```tsx
 * const [blocks, setBlocks] = useState<ContentBlock[]>([]);
 * 
 * <BlockEditor
 *   blocks={blocks}
 *   onBlocksChange={setBlocks}
 *   readOnly={false}
 * />
 * ```
 */
import React, { useState, useRef, useEffect } from 'react';
import { 
  PlusIcon, 
  Bars3Icon,
  DocumentDuplicateIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  ChevronRightIcon,
} from '@heroicons/react/24/outline';
import { Menu, MenuButton, MenuItems, MenuItem } from '@headlessui/react';
import type { ContentBlock, BlockType } from '../../types';
import { Checkbox } from '../atoms/Checkbox';
import { clsx } from '../../utils/clsx';

/**
 * Props for the BlockEditor component
 */
interface BlockEditorProps {
  /** Array of content blocks to render and manage */
  blocks: ContentBlock[];
  
  /** Callback fired when blocks are added, removed, reordered, or updated */
  onBlocksChange: (blocks: ContentBlock[]) => void;
  
  /** If true, disables all editing features (no drag handles, add buttons, or menus) */
  readOnly?: boolean;
  
  /** Additional CSS classes to apply to the root container */
  className?: string;
}

export const BlockEditor: React.FC<BlockEditorProps> = ({
  blocks,
  onBlocksChange,
  readOnly = false,
  className,
}) => {
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const [showCommandMenu, setShowCommandMenu] = useState<string | null>(null);
  const inputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  /**
   * Adds a new block with a specified type after the given block
   * Used when pressing Enter to maintain block type consistency (text after text, checklist after checklist)
   * 
   * @param afterId - The ID of the block after which to insert the new block
   * @param type - The type of block to create ('text' | 'checklist')
   */
  const handleAddBlockWithType = (afterId: string, type: BlockType = 'text') => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      content: '',
      checked: type === 'checklist' ? false : undefined,
      isExpanded: type === 'toggle' ? true : undefined,
      children: type === 'toggle' ? [] : undefined,
      order: blocks.find(b => b.id === afterId)!.order + 0.5,
    };
    
    const updatedBlocks = [...blocks, newBlock]
      .sort((a, b) => a.order - b.order)
      .map((block, index) => ({ ...block, order: index }));
    
    onBlocksChange(updatedBlocks);
    
    // Focus the new block after a brief delay to allow rendering
    setTimeout(() => {
      inputRefs.current.get(newBlock.id)?.focus();
    }, 10);
  };

  /**
   * Adds a new empty block and immediately opens the command menu
   * Used by the '+' buttons to let users choose the block type via menu
   * Provides a more discoverable way to add blocks compared to slash commands
   * 
   * @param afterId - The ID of the block after which to insert the new block
   */
  const handleAddBlockWithMenu = (afterId: string) => {
    const newBlock: ContentBlock = {
      id: Math.random().toString(36).substr(2, 9),
      type: 'text',
      content: '',
      order: blocks.find(b => b.id === afterId)!.order + 0.5,
    };
    
    const updatedBlocks = [...blocks, newBlock]
      .sort((a, b) => a.order - b.order)
      .map((block, index) => ({ ...block, order: index }));
    
    onBlocksChange(updatedBlocks);
    
    // Open command menu and focus after rendering
    setTimeout(() => {
      setShowCommandMenu(newBlock.id);
      inputRefs.current.get(newBlock.id)?.focus();
    }, 10);
  };

  /**
   * Updates a specific block's properties (content, type, checked state, etc.)
   * Used for real-time editing as user types or toggles checkboxes
   * 
   * @param id - The ID of the block to update
   * @param updates - Partial object containing properties to update
   */
  const handleUpdateBlock = (id: string, updates: Partial<ContentBlock>) => {
    const updatedBlocks = blocks.map(block =>
      block.id === id ? { ...block, ...updates } : block
    );
    onBlocksChange(updatedBlocks);
  };

  /**
   * Deletes a block and manages focus after deletion
   * Automatically focuses the previous block, providing smooth navigation
   * 
   * @param id - The ID of the block to delete
   */
  const handleDeleteBlock = (id: string) => {
    const blockIndex = blocks.findIndex(b => b.id === id);
    const updatedBlocks = blocks
      .filter(block => block.id !== id)
      .map((block, index) => ({ ...block, order: index }));
    onBlocksChange(updatedBlocks);
    
    // Focus the previous block if available, otherwise the next one
    setTimeout(() => {
      const focusIndex = Math.max(0, blockIndex - 1);
      if (updatedBlocks[focusIndex]) {
        inputRefs.current.get(updatedBlocks[focusIndex].id)?.focus();
      }
    }, 10);
  };

  /**
   * Initiates drag operation when user starts dragging a block
   * Sets visual feedback and allows move operation
   */
  const handleDragStart = (e: React.DragEvent, blockId: string) => {
    setDraggingId(blockId);
    e.dataTransfer.effectAllowed = 'move';
    
    // Create a custom drag image for better visual feedback
    const target = e.currentTarget as HTMLElement;
    const dragImage = target.cloneNode(true) as HTMLElement;
    dragImage.style.position = 'absolute';
    dragImage.style.top = '-9999px';
    dragImage.style.opacity = '0.8';
    dragImage.style.transform = 'rotate(3deg)';
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    
    // Clean up drag image after a brief delay
    setTimeout(() => {
      document.body.removeChild(dragImage);
    }, 0);
  };

  /**
   * Handles drag-over events to enable drop zone and perform real-time reordering
   * Prevents default to allow drop, and reorders blocks as user drags
   */
  const handleDragOver = (e: React.DragEvent, targetId: string) => {
    e.preventDefault();
    if (!draggingId || draggingId === targetId) return;

    const dragIndex = blocks.findIndex(b => b.id === draggingId);
    const targetIndex = blocks.findIndex(b => b.id === targetId);

    const reordered = [...blocks];
    const [removed] = reordered.splice(dragIndex, 1);
    reordered.splice(targetIndex, 0, removed);

    const updated = reordered.map((block, index) => ({ ...block, order: index }));
    onBlocksChange(updated);
  };

  const handleDragEnd = () => {
    setDraggingId(null);
  };

  /**
   * Centralized keyboard shortcut handler for block operations
   * Implements Notion-like keyboard navigation and shortcuts
   * 
   * Supported shortcuts:
   * - Enter: Create new block (preserves current block type)
   * - Backspace: Delete empty block and focus previous
   * - Ctrl/Cmd+D: Duplicate current block
   * - Delete: Remove current block
   * - Tab: Open command menu on empty blocks
   */
  const handleKeyDown = (e: React.KeyboardEvent, blockId: string, block: ContentBlock) => {
    // Tab: Open command menu for current row (doesn't create new row)
    if (e.key === 'Tab') {
      e.preventDefault();
      setShowCommandMenu(blockId);
    }
    // Enter: Create new block below (allows leaving current row empty)
    else if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleAddBlockWithType(blockId, block.type);
    } 
    // Backspace on empty block: Delete current block
    else if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      if (blocks.length > 1) {
        handleDeleteBlock(blockId);
      }
    } 
    // Slash command: Open command menu for type selection
    else if (e.key === '/' && block.content === '') {
      e.preventDefault();
      setShowCommandMenu(blockId);
    }
    // Ctrl+D: Duplicate block
    else if (e.ctrlKey && e.key === 'd') {
      e.preventDefault();
      handleDuplicateBlock(block);
    }
    // Delete key: Delete block
    else if (e.key === 'Delete' && block.content === '' && blocks.length > 1) {
      e.preventDefault();
      handleDeleteBlock(blockId);
    }
  };

  /**
   * Handles selection from the slash command menu
   * Converts the current block to the selected type and closes the menu
   * 
   * @param blockId - ID of the block being converted
   * @param type - The new block type to apply
   */
  const handleCommandSelect = (blockId: string, type: BlockType) => {
    const updates: Partial<ContentBlock> = { type };
    
    if (type === 'checklist') {
      updates.checked = false;
    } else if (type === 'toggle') {
      updates.isExpanded = true;
      updates.children = [];
    }
    
    handleUpdateBlock(blockId, updates);
    setShowCommandMenu(null);
    
    // Focus the input after type conversion
    setTimeout(() => {
      inputRefs.current.get(blockId)?.focus();
    }, 10);
  };

  /**
   * Duplicates a block, creating an exact copy below the original
   * Useful keyboard shortcut: Ctrl/Cmd+D
   * 
   * @param block - The block to duplicate
   */
  const handleDuplicateBlock = (block: ContentBlock) => {
    const duplicated: ContentBlock = {
      ...block,
      id: Math.random().toString(36).substr(2, 9),
      order: block.order + 0.5,
    };
    const updated = [...blocks, duplicated]
      .sort((a, b) => a.order - b.order)
      .map((b, index) => ({ ...b, order: index }));
    onBlocksChange(updated);
  };

  /**
   * Converts a block from one type to another (text ↔ checklist ↔ toggle)
   * Accessible via the context menu on the drag handle
   * 
   * @param blockId - ID of the block to convert
   * @param newType - The target block type
   */
  const handleTurnInto = (blockId: string, newType: BlockType) => {
    const updates: Partial<ContentBlock> = { type: newType };
    
    if (newType === 'checklist') {
      updates.checked = false;
    } else if (newType === 'toggle') {
      updates.isExpanded = true;
      updates.children = [];
    }
    
    handleUpdateBlock(blockId, updates);
    
    // Focus the input after type conversion
    setTimeout(() => {
      inputRefs.current.get(blockId)?.focus();
    }, 10);
  };

  /**
   * Initialization Effect
   * Ensures at least one empty block exists when the editor is first rendered
   * This provides users with an immediate place to start typing
   */
  useEffect(() => {
    if (blocks.length === 0) {
      const initialBlock: ContentBlock = {
        id: Math.random().toString(36).substr(2, 9),
        type: 'text',
        content: '',
        order: 0,
      };
      onBlocksChange([initialBlock]);
    }
  }, []);

  return (
    <div className={clsx('min-h-[500px]', className)}>
      {blocks.map((block) => (
        <div
          key={block.id}
          draggable={!readOnly}
          onDragStart={(e) => handleDragStart(e, block.id)}
          onDragOver={(e) => handleDragOver(e, block.id)}
          onDragEnd={handleDragEnd}
          className={clsx(
            'group relative flex items-start gap-1 py-1 mb-0.5 rounded-md transition-all duration-200',
            'hover:bg-gray-50 dark:hover:bg-gray-800/50',
            draggingId === block.id && 'opacity-40 scale-95',
            draggingId && draggingId !== block.id && 'transition-transform duration-300 ease-out'
          )}
          style={{
            boxShadow: draggingId === block.id ? '0 4px 12px rgba(0, 0, 0, 0.15)' : undefined
          }}
        >
          {/* Left control panel: Drag handle + Add button (shows on row hover) */}
          {!readOnly && (
            <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {/* Drag handle with context menu */}
              <Menu as="div" className="relative">
                {({ open }) => {
                  const [showMenu, setShowMenu] = React.useState(false);
                  const mouseDownTime = React.useRef<number>(0);
                  const hasDragged = React.useRef(false);
                  
                  return (
                    <>
                      <div
                        className={clsx(
                          'p-1 rounded cursor-grab active:cursor-grabbing transition-colors',
                          'text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700',
                          (open || showMenu) && 'bg-gray-200 dark:bg-gray-700'
                        )}
                        draggable={true}
                        onMouseDown={() => {
                          mouseDownTime.current = Date.now();
                          hasDragged.current = false;
                        }}
                        onMouseUp={() => {
                          const holdDuration = Date.now() - mouseDownTime.current;
                          
                          // Only open menu if it was a quick click and no drag occurred
                          if (holdDuration < 200 && !hasDragged.current) {
                            setShowMenu(!showMenu);
                          }
                          
                          mouseDownTime.current = 0;
                          hasDragged.current = false;
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                        }}
                        onDragStart={(e: React.DragEvent) => {
                          hasDragged.current = true;
                          setShowMenu(false);
                          handleDragStart(e, block.id);
                        }}
                        onDragEnd={() => {
                          handleDragEnd();
                        }}
                      >
                        <Bars3Icon className="h-4 w-4" />
                      </div>

                      {showMenu && <MenuButton className="hidden" />}

                    {showMenu && (
                      <MenuItems 
                        static
                        className="absolute left-0 top-full mt-1 w-56 origin-top-left rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 focus:outline-none z-50 py-1"
                      >
                      {/* Turn into submenu */}
                      <MenuItem>
                        {({ focus }) => (
                          <div className="relative">
                            <button
                              type="button"
                              className={clsx(
                                'flex w-full items-center justify-between px-3 py-2 text-sm',
                                focus ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'
                              )}
                            >
                              <span className="flex items-center gap-2">
                                <ArrowsUpDownIcon className="h-4 w-4" />
                                Turn into
                              </span>
                              <span className="text-gray-400">›</span>
                            </button>
                            {/* Submenu appears on hover */}
                            {focus && (
                              <div className="absolute left-full top-0 ml-1 w-48 rounded-lg bg-white dark:bg-gray-800 shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-1">
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleTurnInto(block.id, 'text');
                                    setShowMenu(false);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                  <span className="text-gray-500">T</span>
                                  <span>Text</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleTurnInto(block.id, 'checklist');
                                    setShowMenu(false);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                  <span className="text-gray-500">☑</span>
                                  <span>Checklist</span>
                                </button>
                                <button
                                  type="button"
                                  onClick={() => {
                                    handleTurnInto(block.id, 'toggle');
                                    setShowMenu(false);
                                  }}
                                  className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                                >
                                  <span className="text-gray-500">▸</span>
                                  <span>Toggle list</span>
                                </button>
                              </div>
                            )}
                          </div>
                        )}
                      </MenuItem>

                      {/* Duplicate block */}
                      <MenuItem>
                        {({ focus }) => (
                          <button
                            type="button"
                            onClick={() => {
                              handleDuplicateBlock(block);
                              setShowMenu(false);
                            }}
                            className={clsx(
                              'flex w-full items-center gap-2 px-3 py-2 text-sm',
                              focus ? 'bg-gray-100 dark:bg-gray-700' : 'text-gray-700 dark:text-gray-200'
                            )}
                          >
                            <DocumentDuplicateIcon className="h-4 w-4" />
                            <span>Duplicate</span>
                            <span className="ml-auto text-xs text-gray-400">Ctrl+D</span>
                          </button>
                        )}
                      </MenuItem>

                      {/* Delete block (only show if more than one block exists) */}
                      {blocks.length > 1 && (
                        <>
                          <div className="my-1 border-t border-gray-200 dark:border-gray-700" />
                          <MenuItem>
                            {({ focus }) => (
                              <button
                                type="button"
                                onClick={() => {
                                  handleDeleteBlock(block.id);
                                  setShowMenu(false);
                                }}
                                className={clsx(
                                  'flex w-full items-center gap-2 px-3 py-2 text-sm text-red-600 dark:text-red-400',
                                  focus && 'bg-red-50 dark:bg-red-900/20'
                                )}
                              >
                                <TrashIcon className="h-4 w-4" />
                                <span>Delete</span>
                                <span className="ml-auto text-xs text-gray-400">Del</span>
                              </button>
                            )}
                          </MenuItem>
                        </>
                      )}
                      </MenuItems>
                    )}
                    </>
                  );
                }}
              </Menu>

              {/* Add block button (shows on handle hover) */}
              <button
                type="button"
                onClick={() => handleAddBlockWithMenu(block.id)}
                className="p-1 rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
                title="Add block below"
              >
                <PlusIcon className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Content input area with optional checkbox or toggle icon */}
          <div className="flex-1 relative min-w-0 flex items-start gap-2">
            {/* Checkbox for checklist items only */}
            {block.type === 'checklist' && (
              <div className="flex-shrink-0 mt-0.5">
                <Checkbox
                  checked={block.checked || false}
                  onChange={() => handleUpdateBlock(block.id, { checked: !block.checked })}
                />
              </div>
            )}

            {/* Toggle arrow for toggle lists */}
            {block.type === 'toggle' && (
              <button
                type="button"
                onClick={() => handleUpdateBlock(block.id, { isExpanded: !block.isExpanded })}
                className="flex-shrink-0 mt-0.5 p-0.5 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                title={block.isExpanded ? 'Collapse' : 'Expand'}
              >
                <ChevronRightIcon 
                  className={clsx(
                    'h-4 w-4 text-gray-500 transition-transform',
                    block.isExpanded && 'rotate-90'
                  )}
                />
              </button>
            )}
            
            {/* Text input */}
            <div className="flex-1 relative">
              <input
                ref={(el) => {
                  if (el) {
                    inputRefs.current.set(block.id, el);
                  } else {
                    inputRefs.current.delete(block.id);
                  }
                }}
                type="text"
                value={block.content}
                onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                onKeyDown={(e) => handleKeyDown(e, block.id, block)}
                readOnly={readOnly}
                className={clsx(
                  'w-full bg-transparent text-sm py-1 focus:outline-none',
                  block.checked 
                    ? 'text-gray-400 line-through dark:text-gray-500'
                    : 'text-[var(--color-text-primary)]'
                )}
              />

              {/* Slash command menu (appears when typing '/') */}
              {showCommandMenu === block.id && (
                <div className="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 rounded-lg shadow-xl ring-1 ring-black/5 dark:ring-white/10 py-1 z-50 w-52">
                  <div className="px-3 py-1 text-xs font-medium text-gray-500 dark:text-gray-400">
                    Turn into
                  </div>
                  <button
                    type="button"
                    onClick={() => handleCommandSelect(block.id, 'text')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <span className="text-gray-500">T</span>
                    <span>Text</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommandSelect(block.id, 'checklist')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <span className="text-gray-500">☑</span>
                    <span>To-do list</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCommandSelect(block.id, 'toggle')}
                    className="w-full px-3 py-2 text-left text-sm hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2 text-gray-700 dark:text-gray-200"
                  >
                    <span className="text-gray-500">▸</span>
                    <span>Toggle list</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Nested children for toggle blocks */}
          {block.type === 'toggle' && block.isExpanded && block.children && block.children.length > 0 && (
            <div className="ml-10 mt-1 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-3">
              <BlockEditor
                blocks={block.children}
                onBlocksChange={(newChildren) => {
                  handleUpdateBlock(block.id, { children: newChildren });
                }}
                readOnly={readOnly}
              />
            </div>
          )}

          {/* Add child button for expanded toggle blocks */}
          {block.type === 'toggle' && block.isExpanded && (!block.children || block.children.length === 0) && !readOnly && (
            <div className="ml-10 mt-1 pl-3 border-l-2 border-gray-200 dark:border-gray-700">
              <button
                type="button"
                onClick={() => {
                  const newChild: ContentBlock = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    content: '',
                    order: 0,
                  };
                  handleUpdateBlock(block.id, { children: [newChild] });
                  
                  // Focus the new child after rendering
                  setTimeout(() => {
                    inputRefs.current.get(newChild.id)?.focus();
                  }, 10);
                }}
                className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 py-1"
              >
                + Add item
              </button>
            </div>
          )}
        </div>
      ))}

      {/* Notion-style bottom row - shows controls on hover, tabbing creates actual editable row */}
      {!readOnly && (
        <div className="group relative flex items-start gap-1 py-1 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50">
          {/* Left controls: + and drag handle (only show on hover) */}
          <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 focus-within:opacity-100">
            <button
              type="button"
              onClick={() => {
                // Add new block at the end
                const lastBlock = blocks[blocks.length - 1];
                if (lastBlock) {
                  handleAddBlockWithType(lastBlock.id, 'text');
                } else {
                  const newBlock: ContentBlock = {
                    id: Math.random().toString(36).substr(2, 9),
                    type: 'text',
                    content: '',
                    order: 0,
                  };
                  onBlocksChange([newBlock]);
                }
              }}
              className="p-1 rounded text-gray-400 hover:bg-gray-200 hover:text-gray-600 dark:hover:bg-gray-700 dark:hover:text-gray-300 transition-colors"
              title="Add block below"
            >
              <PlusIcon className="h-4 w-4" />
            </button>

            <button
              type="button"
              className="p-1 rounded text-gray-400 cursor-default"
              tabIndex={-1}
              aria-hidden="true"
            >
              <Bars3Icon className="h-4 w-4" />
            </button>
          </div>

          {/* Spacer for alignment */}
          <div className="w-5 h-5 flex-shrink-0" />

          {/* Clickable/tabbable area that creates actual row when focused */}
          <div className="flex-1 relative min-w-0">
            <input
              type="text"
              onFocus={(e) => {
                // When tabbed/clicked, add a real editable block and focus it
                const lastBlock = blocks[blocks.length - 1];
                const newBlock: ContentBlock = {
                  id: Math.random().toString(36).substr(2, 9),
                  type: 'text',
                  content: '',
                  order: lastBlock ? lastBlock.order + 1 : 0,
                };
                onBlocksChange([...blocks, newBlock]);
                
                // Blur this input
                e.target.blur();
                // Focus immediately after state update (React 19 synchronous updates)
                const input = inputRefs.current.get(newBlock.id);
                if (!input) {
                  // If ref not yet set, focus on next tick
                  queueMicrotask(() => {
                    inputRefs.current.get(newBlock.id)?.focus();
                  });
                } else {
                  input.focus();
                }
              }}
              readOnly
              className="w-full bg-transparent text-sm py-1 focus:outline-none cursor-text"
            />
          </div>
        </div>
      )}
    </div>
  );
};
