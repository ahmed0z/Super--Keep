'use client';

import { useState, useRef, useEffect } from 'react';
import { NoteColor } from '@/types';
import { Filter, X } from 'lucide-react';
import { Button } from './Button';

export interface FilterOptions {
  colors: NoteColor[];
  tags: string[];
  showPinned: boolean | null; // null = all, true = only pinned, false = only unpinned
  showArchived: boolean | null; // null = all, true = only archived, false = only active
}

interface FilterMenuProps {
  filters: FilterOptions;
  onChange: (filters: FilterOptions) => void;
  availableTags: string[];
  className?: string;
}

const colorOptions: { value: NoteColor; label: string }[] = [
  { value: 'default', label: 'Default' },
  { value: 'red', label: 'Red' },
  { value: 'orange', label: 'Orange' },
  { value: 'yellow', label: 'Yellow' },
  { value: 'green', label: 'Green' },
  { value: 'teal', label: 'Teal' },
  { value: 'blue', label: 'Blue' },
  { value: 'purple', label: 'Purple' },
  { value: 'pink', label: 'Pink' }
];

export function FilterMenu({ 
  filters, 
  onChange, 
  availableTags,
  className = '' 
}: FilterMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleColor = (color: NoteColor) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    onChange({ ...filters, colors: newColors });
  };

  const toggleTag = (tag: string) => {
    const newTags = filters.tags.includes(tag)
      ? filters.tags.filter(t => t !== tag)
      : [...filters.tags, tag];
    onChange({ ...filters, tags: newTags });
  };

  const clearFilters = () => {
    onChange({
      colors: [],
      tags: [],
      showPinned: null,
      showArchived: null
    });
  };

  const activeFilterCount = 
    filters.colors.length + 
    filters.tags.length + 
    (filters.showPinned !== null ? 1 : 0) + 
    (filters.showArchived !== null ? 1 : 0);

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      {/* Trigger Button */}
      <Button
        variant="ghost"
        onClick={() => setIsOpen(!isOpen)}
        className="relative"
      >
        <Filter className="w-4 h-4 mr-2" />
        Filters
        {activeFilterCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs 
                         rounded-full w-5 h-5 flex items-center justify-center">
            {activeFilterCount}
          </span>
        )}
      </Button>

      {/* Filter Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-80 bg-white dark:bg-gray-800 
                      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50 
                      max-h-[500px] overflow-y-auto">
          <div className="p-4 space-y-4">
            {/* Header */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">Filters</h3>
              {activeFilterCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-sm text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Clear all
                </button>
              )}
            </div>

            {/* Colors */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Colors
              </h4>
              <div className="flex flex-wrap gap-2">
                {colorOptions.map(({ value: color, label }) => (
                  <button
                    key={color}
                    onClick={() => toggleColor(color)}
                    className={`px-3 py-1 rounded-full text-sm border transition-colors
                              ${filters.colors.includes(color)
                                ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                                : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                              }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* Tags */}
            {availableTags.length > 0 && (
              <div>
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Tags
                </h4>
                <div className="flex flex-wrap gap-2">
                  {availableTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors
                                ${filters.tags.includes(tag)
                                  ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                                  : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                                }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Pinned */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Pinned
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ ...filters, showPinned: null })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.showPinned === null
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  All
                </button>
                <button
                  onClick={() => onChange({ ...filters, showPinned: true })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.showPinned === true
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  Pinned
                </button>
                <button
                  onClick={() => onChange({ ...filters, showPinned: false })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.showPinned === false
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  Unpinned
                </button>
              </div>
            </div>

            {/* Archived */}
            <div>
              <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Status
              </h4>
              <div className="flex gap-2">
                <button
                  onClick={() => onChange({ ...filters, showArchived: false })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.showArchived === false
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  Active
                </button>
                <button
                  onClick={() => onChange({ ...filters, showArchived: true })}
                  className={`px-3 py-1 rounded-full text-sm border transition-colors
                            ${filters.showArchived === true
                              ? 'bg-blue-100 dark:bg-blue-900/30 border-blue-600 text-blue-700 dark:text-blue-300'
                              : 'border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
                            }`}
                >
                  Archived
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
