/**
 * ReminderPicker component for setting note reminders.
 */
import React, { useState } from 'react';
import { Menu, MenuButton, MenuItem, MenuItems } from '@headlessui/react';
import { BellIcon, ClockIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { format, addWeeks, setHours, setMinutes, startOfTomorrow } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import type { Reminder } from '../../types';
import { IconButton } from '../atoms/IconButton';
import { clsx } from '../../utils/clsx';

interface ReminderPickerProps {
  reminder?: Reminder;
  onSetReminder: (reminder: Reminder | undefined) => void;
  className?: string;
}

export const ReminderPicker: React.FC<ReminderPickerProps> = ({
  reminder,
  onSetReminder,
  className,
}) => {
  const [showCustom, setShowCustom] = useState(false);
  const [customDate, setCustomDate] = useState('');
  const [customTime, setCustomTime] = useState('08:00');

  // Quick reminder options
  const quickOptions = [
    {
      label: 'Later today',
      getDate: () => setHours(setMinutes(new Date(), 0), 18),
    },
    {
      label: 'Tomorrow morning',
      getDate: () => setHours(setMinutes(startOfTomorrow(), 0), 8),
    },
    {
      label: 'Next week',
      getDate: () => setHours(setMinutes(addWeeks(new Date(), 1), 0), 8),
    },
  ];

  const handleQuickOption = (getDate: () => Date) => {
    const dateTime = getDate();
    onSetReminder({
      id: uuidv4(),
      dateTime: dateTime.toISOString(),
      isRecurring: false,
      notified: false,
    });
  };

  const handleCustomReminder = () => {
    if (!customDate) return;

    const [hours, minutes] = customTime.split(':').map(Number);
    const date = new Date(customDate);
    date.setHours(hours, minutes, 0, 0);

    onSetReminder({
      id: uuidv4(),
      dateTime: date.toISOString(),
      isRecurring: false,
      notified: false,
    });

    setShowCustom(false);
    setCustomDate('');
    setCustomTime('08:00');
  };

  const handleRemoveReminder = () => {
    onSetReminder(undefined);
  };

  return (
    <Menu as="div" className={clsx('relative', className)}>
      <MenuButton as={React.Fragment}>
        {({ active }) => (
          <IconButton
            icon={
              <BellIcon
                className={clsx(
                  'h-5 w-5',
                  reminder && 'text-blue-500'
                )}
              />
            }
            label={reminder ? 'Edit reminder' : 'Add reminder'}
            showTooltip={!active}
            className={active ? 'bg-gray-100 dark:bg-gray-700' : ''}
          />
        )}
      </MenuButton>

      <MenuItems
        className="absolute left-0 z-50 mt-2 w-64 origin-top-left rounded-lg bg-white py-2 shadow-lg ring-1 ring-black/5 focus:outline-none dark:bg-gray-800 dark:ring-white/10"
        anchor="bottom start"
      >
        <div className="px-3 pb-2">
          <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Reminder</p>
        </div>

        {/* Current reminder display */}
        {reminder && (
          <div className="mx-3 mb-2 flex items-center justify-between rounded-lg bg-blue-50 px-3 py-2 dark:bg-blue-900/30">
            <div className="flex items-center gap-2">
              <ClockIcon className="h-4 w-4 text-blue-500" />
              <span className="text-sm text-blue-700 dark:text-blue-300">
                {format(new Date(reminder.dateTime), 'MMM d, h:mm a')}
              </span>
            </div>
            <button
              type="button"
              onClick={handleRemoveReminder}
              className="rounded-full p-1 text-blue-500 hover:bg-blue-100 dark:hover:bg-blue-800"
              aria-label="Remove reminder"
            >
              <XMarkIcon className="h-4 w-4" />
            </button>
          </div>
        )}

        {/* Quick options */}
        {!showCustom && (
          <>
            {quickOptions.map((option) => (
              <MenuItem key={option.label}>
                {({ focus }) => (
                  <button
                    type="button"
                    onClick={() => handleQuickOption(option.getDate)}
                    className={clsx(
                      'flex w-full items-center gap-3 px-3 py-2 text-sm',
                      focus
                        ? 'bg-gray-100 dark:bg-gray-700'
                        : 'text-gray-700 dark:text-gray-200'
                    )}
                  >
                    <ClockIcon className="h-5 w-5 text-gray-400" />
                    <span>{option.label}</span>
                    <span className="ml-auto text-xs text-gray-400">
                      {format(option.getDate(), 'MMM d')}
                    </span>
                  </button>
                )}
              </MenuItem>
            ))}

            <div className="border-t border-gray-200 dark:border-gray-700 my-2" />

            <MenuItem>
              {({ focus }) => (
                <button
                  type="button"
                  onClick={() => setShowCustom(true)}
                  className={clsx(
                    'flex w-full items-center gap-3 px-3 py-2 text-sm',
                    focus
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'text-gray-700 dark:text-gray-200'
                  )}
                >
                  <ClockIcon className="h-5 w-5 text-gray-400" />
                  <span>Pick date & time</span>
                </button>
              )}
            </MenuItem>
          </>
        )}

        {/* Custom date/time picker */}
        {showCustom && (
          <div className="px-3 py-2">
            <div className="mb-3">
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                Date
              </label>
              <input
                type="date"
                value={customDate}
                onChange={(e) => setCustomDate(e.target.value)}
                min={format(new Date(), 'yyyy-MM-dd')}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="mb-3">
              <label className="mb-1 block text-xs text-gray-500 dark:text-gray-400">
                Time
              </label>
              <input
                type="time"
                value={customTime}
                onChange={(e) => setCustomTime(e.target.value)}
                className="w-full rounded border border-gray-300 px-2 py-1.5 text-sm dark:border-gray-600 dark:bg-gray-700"
              />
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleCustomReminder}
                disabled={!customDate}
                className="flex-1 rounded bg-blue-500 px-3 py-1.5 text-sm text-white hover:bg-blue-600 disabled:opacity-50"
              >
                Save
              </button>
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="rounded px-3 py-1.5 text-sm text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </MenuItems>
    </Menu>
  );
};
