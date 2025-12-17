/**
 * ColorPicker component for note colors.
 * Displays a grid of color options matching Keep's palette.
 */
import React from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/20/solid';
import type { NoteColor } from '../../types';
import { clsx } from '../../utils/clsx';
import { IconButton } from '../atoms/IconButton';

// Heroicons doesn't have a palette icon, so we'll create a simple one
const PaletteIcon = () => (
  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.401-6.402M6.75 21A3.75 3.75 0 013 17.25V4.125C3 3.504 3.504 3 4.125 3h5.25c.621 0 1.125.504 1.125 1.125v4.072M6.75 21a3.75 3.75 0 003.75-3.75V8.197M6.75 21h13.125c.621 0 1.125-.504 1.125-1.125v-5.25c0-.621-.504-1.125-1.125-1.125h-4.072M10.5 8.197l2.88-2.88c.438-.439 1.15-.439 1.59 0l3.712 3.713c.44.44.44 1.152 0 1.59l-2.879 2.88M6.75 17.25h.008v.008H6.75v-.008z" />
  </svg>
);

interface ColorPickerProps {
  selectedColor: NoteColor;
  onColorChange: (color: NoteColor) => void;
  className?: string;
}

const COLORS: { value: NoteColor; label: string; bg: string }[] = [
  { value: 'default', label: 'Default', bg: 'bg-white border-2 border-gray-300 dark:bg-gray-800' },
  { value: 'red', label: 'Red', bg: 'bg-note-red' },
  { value: 'orange', label: 'Orange', bg: 'bg-note-orange' },
  { value: 'yellow', label: 'Yellow', bg: 'bg-note-yellow' },
  { value: 'green', label: 'Green', bg: 'bg-note-green' },
  { value: 'teal', label: 'Teal', bg: 'bg-note-teal' },
  { value: 'blue', label: 'Blue', bg: 'bg-note-blue' },
  { value: 'darkblue', label: 'Dark Blue', bg: 'bg-note-darkblue' },
  { value: 'purple', label: 'Purple', bg: 'bg-note-purple' },
  { value: 'pink', label: 'Pink', bg: 'bg-note-pink' },
  { value: 'brown', label: 'Brown', bg: 'bg-note-brown' },
  { value: 'gray', label: 'Gray', bg: 'bg-note-gray' },
];

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor,
  onColorChange,
  className,
}) => {
  return (
    <Menu as="div" className={clsx('relative', className)}>
      <MenuButton as={React.Fragment}>
        {({ active }) => (
          <IconButton
            icon={<PaletteIcon />}
            label="Background color"
            showTooltip={!active}
            className={active ? 'bg-gray-100 dark:bg-gray-700' : ''}
          />
        )}
      </MenuButton>

      <MenuItems
        className="absolute left-0 z-50 mt-2 w-36 origin-top-left rounded-lg bg-white p-2 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-white/10"
        anchor="bottom start"
      >
        <div className="grid grid-cols-4 gap-1" role="listbox" aria-label="Note colors">
          {COLORS.map((color) => (
            <MenuItem key={color.value}>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => onColorChange(color.value)}
                  className={clsx(
                    'flex h-8 w-8 items-center justify-center rounded-full transition-transform',
                    color.bg,
                    focus && 'ring-2 ring-blue-500 ring-offset-1',
                    'hover:scale-110'
                  )}
                  role="option"
                  aria-selected={selectedColor === color.value}
                  aria-label={color.label}
                >
                  {selectedColor === color.value && (
                    <CheckIcon className="h-4 w-4 text-gray-700" />
                  )}
                </button>
              )}
            </MenuItem>
          ))}
        </div>
      </MenuItems>
    </Menu>
  );
};
