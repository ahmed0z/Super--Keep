'use client';

import { useState, useRef, useEffect } from 'react';

interface TableCellProps {
  value: string;
  onUpdate: (value: string) => void;
  readOnly?: boolean;
  rowIndex: number;
  colIndex: number;
}

export function TableCell({ 
  value, 
  onUpdate, 
  readOnly = false,
  rowIndex,
  colIndex 
}: TableCellProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState(value);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setText(value);
  }, [value]);

  const handleBlur = () => {
    setIsEditing(false);
    if (text !== value) {
      onUpdate(text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setText(value);
      setIsEditing(false);
      inputRef.current?.blur();
    } else if (e.key === 'Tab') {
      // Let default tab behavior work (move to next cell)
      handleBlur();
    }
  };

  const handleDoubleClick = () => {
    if (!readOnly) {
      setIsEditing(true);
      setTimeout(() => inputRef.current?.focus(), 0);
    }
  };

  return (
    <td
      className="border border-gray-300 dark:border-gray-600 p-2 min-w-[100px]
                 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
      onDoubleClick={handleDoubleClick}
    >
      {isEditing ? (
        <input
          ref={inputRef}
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className="w-full bg-transparent border-none outline-none focus:ring-2 
                     focus:ring-blue-500 rounded px-1 -mx-1"
          placeholder="Enter text..."
          maxLength={500}
          autoFocus
        />
      ) : (
        <div 
          className="min-h-[24px] cursor-pointer"
          onClick={() => !readOnly && handleDoubleClick()}
        >
          {value || (
            <span className="text-gray-400 dark:text-gray-600 text-sm">
              {readOnly ? '' : 'Double-click to edit'}
            </span>
          )}
        </div>
      )}
    </td>
  );
}
