/**
 * Checkbox component with custom styling.
 * Accessible with proper ARIA attributes.
 */
import React from 'react';
import { CheckIcon } from '@heroicons/react/20/solid';
import { clsx } from '../../utils/clsx';

interface CheckboxProps {
  id?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  className?: string;
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  onChange,
  disabled = false,
  label,
  className,
}) => {
  return (
    <label
      className={clsx(
        'inline-flex items-center gap-2 cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <span
        role="checkbox"
        aria-checked={checked}
        tabIndex={disabled ? -1 : 0}
        id={id}
        onClick={() => !disabled && onChange(!checked)}
        onKeyDown={(e) => {
          if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
            e.preventDefault();
            onChange(!checked);
          }
        }}
        className={clsx(
          'flex h-5 w-5 items-center justify-center rounded-md border-2',
          'transition-all duration-200 ease-[cubic-bezier(0.2,0,0,1)]',
          'focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-[var(--color-primary)] focus-visible:ring-offset-2',
          checked
            ? 'border-[var(--color-primary)] bg-[var(--color-primary)] text-white scale-100'
            : 'border-[var(--color-outline)] bg-transparent hover:border-[var(--color-primary)] hover:bg-[var(--color-primary-container)]/30'
        )}
      >
        {checked && <CheckIcon className="h-4 w-4 animate-[scaleIn_0.2s_ease-out]" />}
      </span>
      {label && (
        <span
          className={clsx(
            'text-sm text-gray-700 dark:text-gray-200',
            checked && 'line-through text-gray-400 dark:text-gray-500'
          )}
        >
          {label}
        </span>
      )}
    </label>
  );
};
