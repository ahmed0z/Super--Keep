/**
 * NoteInput component - the "Take a note..." input box.
 * Expands to a full editor when clicked.
 */
import React, { useState } from 'react';
import { ListBulletIcon } from '@heroicons/react/24/outline';
import { NoteEditor } from './NoteEditor';
import { clsx } from '../../utils/clsx';

interface NoteInputProps {
  className?: string;
}

export const NoteInput: React.FC<NoteInputProps> = ({ className }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [initialType, setInitialType] = useState<'text' | 'checklist'>('text');

  const handleOpen = (type: 'text' | 'checklist' = 'text') => {
    setInitialType(type);
    setIsExpanded(true);
  };

  return (
    <>
      {/* Collapsed state - M3 Expressive style */}
      <div
        className={clsx(
          'mx-auto max-w-xl rounded-3xl border-2 border-[var(--color-outline-variant)]',
          'bg-[var(--color-surface-container)] shadow-md',
          'transition-all duration-300 ease-[cubic-bezier(0.2,0,0,1)]',
          'hover:shadow-lg hover:border-[var(--color-outline)]',
          className
        )}
      >
        <div className="flex items-center">
          <button
            type="button"
            onClick={() => handleOpen('text')}
            className="flex-1 px-5 py-4 text-left text-base text-[var(--color-text-tertiary)] font-medium"
          >
            Take a note...
          </button>

          <div className="flex items-center gap-1 px-3">
            <button
              type="button"
              onClick={() => handleOpen('checklist')}
              className="rounded-full p-2.5 text-[var(--color-text-secondary)] transition-all duration-200 hover:bg-[var(--color-surface-container-high)] active:scale-95"
              aria-label="New checklist"
            >
              <ListBulletIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Editor dialog */}
      <NoteEditor
        isOpen={isExpanded}
        onClose={() => setIsExpanded(false)}
        initialType={initialType}
      />
    </>
  );
};
