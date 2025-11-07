'use client';

import { useState, useRef, useEffect } from 'react';
import { NoteColor } from '@/types';
import { NOTE_COLORS } from '@/lib/utils/colors';
import { Palette, Check } from 'lucide-react';

interface ColorPickerProps {
  value: NoteColor;
  onChange: (color: NoteColor) => void;
  label?: string;
  className?: string;
}

export function ColorPicker({ 
  value, 
  onChange, 
  label = 'Color',
  className = '' 
}: ColorPickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  // Close picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const colorOptions: NoteColor[] = [
    'default',
    'red',
    'orange',
    'yellow',
    'green',
    'teal',
    'blue',
    'purple',
    'pink'
  ];

  const colorLabels: Record<NoteColor, string> = {
    default: 'Default',
    red: 'Red',
    orange: 'Orange',
    yellow: 'Yellow',
    green: 'Green',
    teal: 'Teal',
    blue: 'Blue',
    purple: 'Purple',
    pink: 'Pink'
  };

  return (
    <div className={`relative ${className}`} ref={pickerRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg border border-gray-300 
                   dark:border-gray-600 bg-white dark:bg-gray-800 
                   hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
        aria-label={`${label}: ${colorLabels[value]}`}
      >
        <Palette className="w-4 h-4 text-gray-600 dark:text-gray-400" />
        <span className="text-sm text-gray-700 dark:text-gray-300">
          {colorLabels[value]}
        </span>
      </button>

      {/* Color Palette */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-2 p-3 bg-white dark:bg-gray-800 
                      rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 z-50">
          <div className="grid grid-cols-3 gap-2 min-w-[200px]">
            {colorOptions.map((color) => {
              const colorClass = NOTE_COLORS[color].bg.split(' ')[0];
              const isSelected = value === color;

              return (
                <button
                  key={color}
                  type="button"
                  onClick={() => {
                    onChange(color);
                    setIsOpen(false);
                  }}
                  className={`relative flex flex-col items-center gap-1 p-2 rounded-lg 
                            hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors
                            ${isSelected ? 'ring-2 ring-blue-500' : ''}`}
                  aria-label={`Select ${colorLabels[color]}`}
                  title={colorLabels[color]}
                >
                  <div
                    className={`w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-600
                              ${colorClass} flex items-center justify-center`}
                  >
                    {isSelected && (
                      <Check className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    )}
                  </div>
                  <span className="text-xs text-gray-600 dark:text-gray-400">
                    {colorLabels[color]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
