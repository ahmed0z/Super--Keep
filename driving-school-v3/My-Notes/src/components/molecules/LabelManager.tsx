/**
 * LabelManager component for adding/removing labels on notes.
 */
import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { TagIcon, PlusIcon, CheckIcon } from '@heroicons/react/24/outline';
import { useLabelsStore } from '../../store/labelsStore';
import { IconButton } from '../atoms/IconButton';
import { Input } from '../atoms/Input';
import { clsx } from '../../utils/clsx';

interface LabelManagerProps {
  selectedLabels: string[];
  onAddLabel: (labelId: string) => void;
  onRemoveLabel: (labelId: string) => void;
  className?: string;
}

export const LabelManager: React.FC<LabelManagerProps> = ({
  selectedLabels,
  onAddLabel,
  onRemoveLabel,
  className,
}) => {
  const labels = useLabelsStore((state) => state.labels);
  const createLabel = useLabelsStore((state) => state.createLabel);
  const [newLabelName, setNewLabelName] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  const handleToggleLabel = (labelId: string) => {
    if (selectedLabels.includes(labelId)) {
      onRemoveLabel(labelId);
    } else {
      onAddLabel(labelId);
    }
  };

  const handleCreateLabel = async () => {
    if (!newLabelName.trim()) return;

    try {
      const label = await createLabel(newLabelName);
      onAddLabel(label.id);
      setNewLabelName('');
      setIsCreating(false);
    } catch {
      // Error already handled by store
    }
  };

  return (
    <Menu as="div" className={clsx('relative', className)}>
      <MenuButton as={React.Fragment}>
        {({ active }) => (
          <IconButton
            icon={<TagIcon className="h-5 w-5" />}
            label="Add label"
            showTooltip={!active}
            className={active ? 'bg-gray-100 dark:bg-gray-700' : ''}
          />
        )}
      </MenuButton>

      <MenuItems
        className="absolute left-0 z-50 mt-2 w-56 origin-top-left rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-white/10"
        anchor="bottom start"
      >
        <div className="px-3 pb-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Labels</p>
        </div>

        {/* Existing labels */}
        <div className="max-h-48 overflow-y-auto">
          {labels.length === 0 && !isCreating && (
            <div className="px-3 py-2 text-sm text-gray-500 dark:text-gray-400">
              No labels yet
            </div>
          )}

          {labels.map((label) => (
            <MenuItem key={label.id}>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => handleToggleLabel(label.id)}
                  className={clsx(
                    'flex w-full items-center gap-3 px-3 py-2 text-sm',
                    focus
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  <span
                    className={clsx(
                      'flex h-4 w-4 items-center justify-center rounded border',
                      selectedLabels.includes(label.id)
                        ? 'border-blue-500 bg-blue-500 text-white'
                        : 'border-gray-300 dark:border-gray-600'
                    )}
                  >
                    {selectedLabels.includes(label.id) && (
                      <CheckIcon className="h-3 w-3" />
                    )}
                  </span>
                  <span className="truncate">{label.name}</span>
                </button>
              )}
            </MenuItem>
          ))}
        </div>

        {/* Create new label */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-2 pt-2">
          {isCreating ? (
            <div className="px-3 py-2">
              <Input
                value={newLabelName}
                onChange={(e) => setNewLabelName(e.target.value)}
                placeholder="Enter label name"
                className="text-sm"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleCreateLabel();
                  }
                  if (e.key === 'Escape') {
                    setIsCreating(false);
                    setNewLabelName('');
                  }
                }}
              />
              <div className="mt-2 flex gap-2">
                <button
                  type="button"
                  onClick={handleCreateLabel}
                  className="text-sm text-blue-600 hover:underline dark:text-blue-400"
                >
                  Create
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setNewLabelName('');
                  }}
                  className="text-sm text-gray-500 hover:underline dark:text-gray-400"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => setIsCreating(true)}
                  className={clsx(
                    'flex w-full items-center gap-3 px-3 py-2 text-sm',
                    focus
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  <PlusIcon className="h-5 w-5" />
                  <span>Create new label</span>
                </button>
              )}
            </MenuItem>
          )}
        </div>
      </MenuItems>
    </Menu>
  );
};
